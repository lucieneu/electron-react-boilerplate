/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs, { promises as promiseFs } from 'fs';
import Store from 'electron-store';
import url from 'url';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

const store = new Store();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// // eslint-disable-next-line prettier/prettier
// fs.readdir(`C:/Users/Lucien/Pictures/CV`,  (err, files)=> {
//   // handling error
//   if (err) {
//     return console.log(`Unable to scan directory: ${err}`);
//   }
//   // listing all files using forEach
//   files.forEach(function (file) {
//     // Do whatever you want to do with the file
//     console.log(file);
//   });
// });
ipcMain.on('dir-channel', async (event, arg) => {
  console.log('receive dir-channel', arg);

  const fileStats: fs.Stats[] = [];
  // eslint-disable-next-line prettier/prettier
  const fileObjs = fs.readdirSync(`C:/Users/Lucien/Pictures/CV`, {
    withFileTypes: true,
  });
  console.log('\nCurrent directory files:');
  fileObjs.forEach((file: any) => {
    // console.log(file);
    // https://www.geeksforgeeks.org/node-js-fs-stat-method/?ref=lbp
    fs.stat(`C:/Users/Lucien/Pictures/CV/${file.name}`, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Stats object for: example_file.txt');
        console.log(stats);
        fileStats.push(stats);
        // Using methods of the Stats object
        console.log('Path is file:', stats.isFile());
        console.log('Path is directory:', stats.isDirectory());
      }
    });
    mainWindow.webContents.send('update-files', fileStats);
    // Use fs.readFile() method to read the file
    // eslint-disable-next-line prettier/prettier
    fs.readFile(
      `C:/Users/Lucien/Pictures/CV/${file.name}`,
      'utf8',
      function (err, data) {
        // Display the file content
        // console.log(data);
      }
    );
  });

  // const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  // console.log(msgTemplate(arg));
  // event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      // webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// IPC listener
ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});

ipcMain.on('electron-read-file', async (event, path) => {
  fs.readFile(path, 'utf8', function (err, data) {
    // Display the file content
    console.log(!!data);
    // mainWindow.webContents.send('electron-read-file-send', {
    //   data: new Buffer(data).toString('base64'),
    //   url: `file://${path}`,
    // });
  });
});

ipcMain.on('electron-directory-fetch', async (event, directoryUrl) => {
  console.log('start electron-directory-fetch');
  const list: {
    name: string;
    extension: string;
    stats: fs.Stats;
    isFile: boolean;
    isDirectory: boolean;
  }[] = [];

  fs.readdir(directoryUrl, { withFileTypes: true }, (err, files) => {
    console.log('\nCurrent directory files:');
    if (err) console.log(err);
    else {
      files.forEach((file, index) => {
        console.log('file', file);
        fs.stat(`${directoryUrl}/${file.name}`, (error, _stats) => {
          if (error) {
            console.log(error);
          } else {
            // console.log('Stats object for: example_file.txt');
            // console.log(_stats);
            const res = {
              name: file.name,
              extension: file.name.split('.').slice(-1)[0],

              stats: _stats,
              isFile: _stats.isFile(),
              isDirectory: _stats.isDirectory(),
            };
            // Using methods of the Stats object
            console.log('Path is file:', _stats.isFile());
            console.log('Path is directory:', _stats.isDirectory());
            list.push(res);
          }
          if (files.length - 1 === index) {
            console.log('GO PUSH', new Date(), list.length);
            mainWindow.webContents.send('test-luc', {
              directory: directoryUrl,
              result: [...list],
              count: [...list].length,
            });
          }
        });
      });
    }
  });
  // const fileStats: fs.Stats[] = [];
  // // eslint-disable-next-line prettier/prettier
  // const fileObjs = fs.readdirSync(directoryUrl, { withFileTypes: true });
  // console.log('\nCurrent directory files:');
  // const res = fileObjs.map((file: any) => {
  //   console.log(file);

  //   // https://www.geeksforgeeks.org/node-js-fs-stat-method/?ref=lbp
  //   const _stats = fs.statSync(`${directoryUrl}/${file.name}`);

  //   // console.log('fileStats', fileStats.length);
  //   // Using methods of the Stats object
  //   console.log('Path is file:', _stats.isFile());
  //   console.log('Path is directory:', _stats.isDirectory());

  //   return {
  //     name: file.name,
  //     extension: file.name.split('.').slice(-1)[0],

  //     stats: _stats,
  //     isFile: _stats.isFile(),
  //     isDirectory: _stats.isDirectory(),
  //   };
  // });
  // const key = `electron-directory-stats:${directoryUrl}`;
  // console.log(key, res);
  // store.set(key, res);

  // mainWindow.webContents.send('test-luc', {
  //   directory: directoryUrl,
  //   result: res,
  // });

  // console.log('end electron-directory-fetch');
  // return (event.returnValue = { directory: directoryUrl, result: res });
  // store.set(
  //   `electron-directory-stats:${directoryUrl}`,
  //   JSON.stringify(fileStats)
  // );
});

ipcMain.on('electron-directory-stats', async (event, directoryUrl) => {
  const key = `electron-directory-stats:${directoryUrl}`;
  console.log('get ', key, store.get(key));
  event.returnValue = store.get(key);
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    protocol.registerFileProtocol('localasset', (request, callback) => {
      console.log('localasset', request);
      const filePath = url.fileURLToPath(
        `file://${request.url.slice('localasset://'.length)}`
      );
      // const filePath = url.fileURLToPath('file://' + request.url.slice('atom://'.length))
      console.log({ filePath });
      callback(filePath);
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// ,
//     async (error, stats) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('Stats object for: example_file.txt');
//         // console.log(stats);
//         fileStats = [...fileStats, stats];
//         console.log('fileStats', fileStats.length);
//         // Using methods of the Stats object
//         console.log('Path is file:', stats.isFile());
//         console.log('Path is directory:', stats.isDirectory());
//         if (fileObjs[fileObjs.length - 1].name === file.name) {
//           // console.log(`electron-directory-stats:${directoryUrl}`, fileStats);

//           // console.log(
//           //   'setting: ',
//           //   `electron-directory-stats:${directoryUrl}`,
//           //   store.get(`electron-directory-stats:${directoryUrl}`)
//           // );
//         }
//       }

//       return 'hello world';
//     }
