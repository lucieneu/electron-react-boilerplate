import { ElectronHandler } from 'main/preload';

type copySettings = {
  file: string;
  source: string;
  folders: any[];
};
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
        copyFileToDirectory: (copyFileSettings: copySettings) => void;
      };
    };
  }
}
// ...

export {};
