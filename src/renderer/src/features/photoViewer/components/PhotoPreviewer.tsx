import React, {
  memo,
  useRef,
  useState,
  useEffect,
  useMemo,
  ReactElement,
  Fragment,
} from 'react';
import './PhotoPreviewer.css';
// import { useVirtual } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useKeyPress } from 'renderer/src/hooks/utils';
import { useAppSelector } from 'renderer/src/hooks/redux';
import { Label, selectCurrentList } from 'renderer/src/stores/labelSlice';
import { AnimatePresence, motion } from 'framer-motion';

type FileImageProps = { url: string; style: any };

const FileImage = memo(
  ({ url, style = { maxHeight: 82 } }: FileImageProps): ReactElement => {
    return (
      <motion.img
        initial={{
          x: '24vw',
          y: '10vw',
          opacity: 0,
          scale: 0,

          // rotateY: '-50deg',
        }}
        animate={{
          // opacity: [0, 0.4, 0.75],
          // scale: [0.75, 0.8, 0.85, 1],
          // rotateY: '0deg',
          y: '0vw',
          opacity: 1,
          zIndex: 1,
          scale: 1,
          x: '0vw',
          transition: {
            y: { delay: 0 },
            opacity: { delay: 0, duration: 0.75 },
            scale: { delay: 0 },
          },
        }}
        exit={{
          opacity: 0,
          scale: [1, 0.85, 0.8, 0.75],
          // opacity: 0,
          // scale: 0.75,
          x: '-24vw',
          y: '10vw',
          // rotateY: '50deg',
          zIndex: 0,
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute',
          ...style,
        }}
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
        zIndex: 2,
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
    <motion.div
      className="photoViewer"
      initial={{
        background: 'var(--background-photoViewer-init)',
      }}
      animate={{
        background: 'var(--background-photoViewer)',
      }}
    >
      <div
        style={{
          maxHeight: 'calc(100vh - 100px)',
          maxWidth: 'calc(100vw )',
          position: 'relative',
          display: 'flex',
          height: '100%',
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatePresence>
          {selected && (
            <FileImage
              key={selected}
              url={selected}
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
              }}
            />
          )}
        </AnimatePresence>
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
                <FileImage url={url} />
                <LabelsLinked
                  labels={urlMappedLabels[url]}
                  colors={colorsMap}
                />
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export { PhotoPreviewer, FileImage };
