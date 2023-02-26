import { useCallback, useLayoutEffect, useRef } from 'react';

const useEvent = (handler: Function) => {
  const handlerRef = useRef(handler);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
};

export { useEvent };
