import { memo, useRef, useState, useEffect, useMemo } from 'react';
import './PhotoPreviewer.css';
// import { useVirtual } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useNavigate } from 'react-router-dom';
import { useKeyPress, useKeysPress } from 'renderer/src/hooks/utils';
import { useAppSelector } from 'renderer/src/hooks/redux';
import { selectCurrentList } from 'renderer/src/stores/labelSlice';

const FileImage = memo(
  ({ url, style = { maxHeight: 82 } }: { url: string; style: any }) => {
    // console.log(url);
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

const useLabelSet = (filePath, key, setter) => {
  const pressed = useKeyPress(key);

  useEffect(() => {
    if (pressed)
      setter((prev) => {
        if (!prev[filePath]) prev[filePath] = new Set();
        console.log(prev[filePath].has(key));
        prev[filePath].has(key)
          ? prev[filePath].delete(key)
          : prev[filePath].add(key);

        return { ...prev };
      });
  }, [pressed]);
};

function useLabelKeyPressed(targetKeys: string[], filePath: string): boolean {
  const [labelPressed, setLabelPressed] = useState({});
  const filePathRef = useRef();
  filePathRef.current = filePath;
  // State for keeping track of whether key is pressed
  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }): void {
    const _filePath = filePathRef.current;
    console.log('downHandler', filePath, targetKeys, _filePath);

    if (targetKeys.includes(key)) {
      setLabelPressed((prev) => {
        if (!prev[_filePath]) prev[_filePath] = new Set();
        console.log(prev[_filePath].has(key));
        prev[_filePath].has(key)
          ? prev[_filePath].delete(key)
          : prev[_filePath].add(key);

        return { ...prev };
      });

      // setKeyPressed((prev) => (!prev.includes(key) ? [...prev, key] : prev));
    }
  }

  // If released key is our target key then set to false
  // const upHandler = ({ key }: { key: string }): void => {
  //   if (targetKeys.includes(key)) {
  //     setKeyPressed((prev) =>
  //       prev.includes(key) ? prev.filter((_key) => _key !== key) : prev
  //     );
  //   }
  // };
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    // window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      // window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return labelPressed;
}

const useLabelSets = (filePath, keys, setter) => {
  const keyPressed = useKeysPress(labelList.map(({ keyPress }) => keyPress));

  useEffect(() => {
    if (pressed)
      setter((prev) => {
        if (!prev[filePath]) prev[filePath] = new Set();
        console.log(prev[filePath].has(key));
        prev[filePath].has(key)
          ? prev[filePath].delete(key)
          : prev[filePath].add(key);

        return { ...prev };
      });
  }, [pressed]);
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

  const [selected, setSelected] = useState();

  const [linkedLabels, setLinkedLabels] = useState({});
  const [indexWidth, setIndexWidth] = useState({});

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
  useLabelSet(selected, 'a', setLinkedLabels);
  useLabelSet(selected, 's', setLinkedLabels);
  useLabelSet(selected, 'd', setLinkedLabels);

  // console.log(spacePressed);
  // console.log(selected);
  // console.log(linkedLabels);
  console.log({ urlMappedLabels, selected });

  const handleSave = () => {
    const dirLength = directory.length;
    Object.keys(linkedLabels).forEach((filePath) => {
      console.log('filepath', filePath);
      if (linkedLabels[filePath].size) {
        const copySettings = {
          file: filePath.slice(dirLength + 1),
          source: directory,
          folders: [...linkedLabels[filePath]],
        };
        console.log('copySettings', copySettings);

        window.electronStore.directory.copyFileToDirectory(copySettings);
      }
    });
  };

  const colorsMap = useMemo(
    () =>
      labelList.reduce((acc, curr) => {
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
            // console.log(photoList[virtualColumn.index]);
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
                {/* Column {virtualColumn.index} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
const LabelsLinked = ({ labels, colors }) => {
  const _colors = [];
  labels?.forEach((keyPressed) => {
    colors[keyPressed].forEach((label) => {
      _colors.push(label.color);
    });
  });

  return _colors.map((color, index) => (
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

export { PhotoPreviewer, FileImage };
