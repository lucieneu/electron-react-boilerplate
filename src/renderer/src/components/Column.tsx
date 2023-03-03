import { useRef } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

function Column() {
  const parentRef = useRef();

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
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
        {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
          <div
            key={virtualColumn.index}
            className={virtualColumn.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${virtualColumn.size}px`,
              transform: `translateX(${virtualColumn.start}px)`,
            }}
          >
            Column {virtualColumn.index}
          </div>
        ))}
      </div>
    </div>
  );
}
export { Column };
