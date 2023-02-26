import { ElectronHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    electronStore: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      directory: {
        fetch: (directoryUrl: string) => void;
        getStats: (directoryUrl: string) => void;
      };
    };
  }
}
// ...

export {};
