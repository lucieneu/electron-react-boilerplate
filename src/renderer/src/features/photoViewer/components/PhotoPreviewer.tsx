import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useMemo,
  ReactElement,
} from 'react';
import './PhotoPreviewer.css';
// import { useVirtual } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useKeyPress } from 'renderer/src/hooks/utils';
import { useAppSelector } from 'renderer/src/hooks/redux';
import { Label, selectCurrentList } from 'renderer/src/stores/labelSlice';

type FileImageProps = { url: string; style: any };

const FileImage = memo(
  ({ url, style = { maxHeight: 82 } }: FileImageProps): ReactElement => {
    return (
      <img
        style={style}
        src={`localasset://${url}`}
        alt="url"
        onLoad={console.log}
      />
    );
  }
);

type props = {
  photoList: any;
  directory: any;
};

type PressedLabels = {
  [key: string]: Set<string>;
};

function useLabelKeyPressed(
  targetKeys: string[],
  filePath: string
): PressedLabels {
  const [labelPressed, setLabelPressed] = useState<PressedLabels>({});
  const filePathRef = useRef<string | undefined>();
  filePathRef.current = filePath;

  // State for keeping track of whether key is pressed
  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }): void {
    const newFilePath: string | undefined = filePathRef.current;

    if (newFilePath && targetKeys.includes(key)) {
      setLabelPressed((prev: PressedLabels) => {
        if (!prev[newFilePath]) prev[newFilePath] = new Set();
        console.log(prev[newFilePath].has(key));

        if (prev[newFilePath].has(key)) prev[newFilePath].delete(key);
        else prev[newFilePath].add(key);

        return { ...prev };
      });
    }
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return labelPressed;
}

type LabelMapType = {
  [key: string]: Label;
};
type ColorsMapType = {
  [key: string]: Label[];
};
type LabelsLinkedProps = {
  labels: Set<string> | undefined;
  colors: ColorsMapType;
};
const LabelsLinked = ({
  labels,
  colors,
}: LabelsLinkedProps): ReactElement[] => {
  const renderColors: string[] = [];
  labels?.forEach((keyPressed: string) => {
    colors[keyPressed].forEach((label: Label) => {
      renderColors.push(label.color);
    });
  });

  return renderColors.map((color: string, index) => (
    <div
      style={{
        background: color,
        width: 10,
        height: 10,
        borderRadius: 4,

        position: 'absolute',
        marginLeft: index * 10,
      }}
    />
  ));
};

function PhotoPreviewer({ directory, photoList = [] }: props) {
  const spacePressed = useKeyPress(' ');
  const parentRef = useRef(null);
  const labelList = useAppSelector(selectCurrentList);

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: photoList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const [selected, setSelected] = useState<string>('');

  // const [indexWidth, setIndexWidth] = useState({});

  useEffect(() => {
    if (spacePressed) {
      const currentIndex = photoList.findIndex(
        (photo: { name: any }) => `${directory}/${photo.name}` === selected
      );
      if (currentIndex >= 0) {
        const newSelected = `${directory}/${photoList[currentIndex + 1].name}`;

        setSelected(newSelected);
      }
    }
  }, [spacePressed]);

  const urlMappedLabels = useLabelKeyPressed(
    labelList.map(({ keyPress }) => keyPress),
    selected
  );

  const handleSave = () => {
    // based on keyPress
    const labelMap = labelList.reduce((acc: LabelMapType, curr) => {
      acc[curr.keyPress] = curr;
      return acc;
    }, {});
    const dirLength = directory.length;
    Object.keys(urlMappedLabels).forEach((filePath) => {
      if (urlMappedLabels[filePath].size) {
        const folderNames: string[] = [];
        urlMappedLabels[filePath].forEach((keyPressed) => {
          folderNames.push(labelMap[keyPressed].name);
        });
        const copySettings = {
          file: filePath.slice(dirLength + 1),
          source: directory,
          folders: folderNames,
        };

        window.electronStore.directory.copyFileToDirectory(copySettings);
      }
    });
  };

  const colorsMap = useMemo(
    () =>
      labelList.reduce((acc: ColorsMapType, curr) => {
        if (!acc[curr.keyPress]) acc[curr.keyPress] = [];

        acc[curr.keyPress].push(curr);
        return acc;
      }, {}),
    [labelList]
  );

  return (
    <div className="photoViewer">
      <div
        style={{
          maxHeight: 'calc(100vh - 100px)',
          maxWidth: 'calc(100vw )',
        }}
      >
        {selected && (
          <FileImage
            url={selected}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
          />
        )}
      </div>
      <div
        ref={parentRef}
        className="List"
        style={{
          width: `100vw`,
          height: `100px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            width: columnVirtualizer.getTotalSize(),
            height: '100%',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            style={{
              position: 'fixed',
              left: 0,
              bottom: 100,
              zIndex: 1,
              borderRadius: '0 6px 0 0',
            }}
          >
            save
          </button>
          {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const url = `${directory}/${photoList[virtualColumn.index].name}`;

            // TODO: Check for width/height of preview img
            return (
              <div
                key={url ?? virtualColumn.index}
                className={
                  virtualColumn.index % 2 ? 'ListItemOdd' : 'ListItemEven'
                }
                onClick={() => setSelected(url)}
                data-index={virtualColumn.index}
                aria-hidden="true"
                ref={columnVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: 83 ?? '100%',

                  width: `${virtualColumn.size}px`,
                  transform: `translateX(${virtualColumn.start}px)`,

                  boxShadow:
                    url !== selected ? 'unset' : 'inset black 0 0 5px 1px',
                }}
              >
                <LabelsLinked
                  labels={urlMappedLabels[url]}
                  colors={colorsMap}
                />
                <FileImage url={url} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { PhotoPreviewer, FileImage };
