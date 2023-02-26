// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';
export type DirChannel = 'dir-channel';

const electronHandler = {
  ipcRenderer: {
    checkDir(channel: DirChannel, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    onUpdateFiles: (callback) => ipcRenderer.on('update-files', callback),
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

contextBridge.exposeInMainWorld('electronStore', {
  store: {
    get(key) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
    // Other method you want to add like has(), reset(), etc.
  },
  directory: {
    fetch(directoryUrl) {
      ipcRenderer.send('electron-directory-fetch', directoryUrl);
    },
    readFile(path) {
      ipcRenderer.send('electron-read-file', path);
    },
    getStats(directoryUrl) {
      return ipcRenderer.sendSync('electron-directory-stats', directoryUrl);
    },
  },
  // Any other methods you want to expose in the window object.
  // ...
});
