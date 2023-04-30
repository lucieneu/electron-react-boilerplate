import { memo, useRef, useState, useEffect } from 'react';
import './PhotoPreviewer.css';
// import { useVirtual } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useNavigate } from 'react-router-dom';
import { useKeyPress } from 'renderer/src/hooks/utils';

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

function PhotoPreviewer({ directory, photoList = [] }: props) {
  // console.log(directory, photoList);
  // const navigate = useNavigate();
  const spacePressed = useKeyPress(' ');

  // <div
  //   className="photo-review"
  //   style={{
  //     display: 'flex',
  //     flexDirection: 'row',
  //     maxWidth: '250px',
  //     overflowY: 'scroll',
  //   }}
  // >
  //   {photoList.map((photo: { name: string }) => {
  //     return (
  //       <div key={photo.name}>
  //         <FileImage url={`${directory}/${photo.name}`} />
  //       </div>
  //     );
  //   })}
  // </div>;

  const parentRef = useRef(null);

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: photoList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });
  // console.log(columnVirtualizer.getVirtualItems());

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
  useLabelSet(selected, 'a', setLinkedLabels);
  useLabelSet(selected, 's', setLinkedLabels);
  useLabelSet(selected, 'd', setLinkedLabels);

  console.log(spacePressed);
  console.log(selected);
  console.log(linkedLabels);

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

export { PhotoPreviewer, FileImage };
