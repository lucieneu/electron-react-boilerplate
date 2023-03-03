import { memo, useRef, useState } from 'react';

// import { useVirtual } from '@tanstack/react-virtual';
import { useVirtualizer } from '@tanstack/react-virtual';

const FileImage = memo(
  ({ url, style = { maxHeight: 50 } }: { url: string; style: any }) => {
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
function PhotoPreviewer({ directory, photoList = [] }: props) {
  // console.log(directory, photoList);

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

  const parentRef = useRef();

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: photoList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });
  console.log(columnVirtualizer.getVirtualItems());

  const [selected, setSelected] = useState();
  return (
    <div>
      <div style={{ height: 250, width: 250 }}>
        {selected && (
          <FileImage url={selected} style={{ maxWidth: 250, maxHeight: 250 }} />
        )}
      </div>
      <div
        ref={parentRef}
        className="List"
        style={{
          width: `400px`,
          height: `100px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            width: `${columnVirtualizer.getTotalSize()}px`,
            height: '100%',
            position: 'relative',
          }}
        >
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
                aria-hidden="true"
                ref={columnVirtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: 50 ?? '100%',

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
