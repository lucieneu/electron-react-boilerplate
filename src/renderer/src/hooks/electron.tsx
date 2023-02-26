import { useEffect } from 'react';
import { useEvent } from './utils';

const useListener = (func: Function, key: string) => {
  const funcEvent = useEvent(func);
  useEffect(() => {
    // Listen for the event
    const subscription = window.electron.ipcRenderer.on(
      key, // ||'test-luc'
      funcEvent
    );

    // Clean the listener after the component is dismounted
    return () => {
      subscription();
    };
  }, []);
};

export { useListener };
