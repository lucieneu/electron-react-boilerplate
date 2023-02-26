import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import icon from '../../assets/icon.svg';
import './App.css';
// import { default } from '../../.erb/configs/webpack.paths';

// var remote = require('remote'); // Load remote compnent that contains the dialog dependency
// var dialog = remote.require('dialog'); // Load the dialogs component of the OS
// var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

function FileImage({ url }) {
  const [img, setImg] = useState();

  // useEffect(() => {
  //   window.electronStore.directory.readFile(url);

  //   // Listen for the event
  //   const subscription = window.electron.ipcRenderer.on(
  //     'electron-read-file-send',
  //     (result) => {
  //       const base64ImageString = Buffer.from(result.data, 'binary').toString(
  //         'base64'
  //       );
  //       console.log(
  //         'RECEIVED',
  //         !!result.data,
  //         typeof result.data,
  //         result.data,
  //         base64ImageString
  //       );
  //       // const blobImg = new Blob(result.data, { type: 'text/html' });
  //       // const reader = new FileReader();
  //       // reader.onload = (evt) => {
  //       //   console.log(evt.target.result);
  //       // };
  //       // reader.readAsText(blobImg);
  //       // console.log();
  //       setImg(result.url ?? `data:image/jpg;base64,${result.data}`);
  //     }
  //   );
  //   // ipcRenderer.on(channels.GET_DATA, (event, arg) => {
  //   //   setData(arg);
  //   // });
  //   // Clean the listener after the component is dismounted
  //   return () => {
  //     subscription();
  //     // ipcRenderer.ipcMain.removeListener();
  //   };
  // }, []);
  console.log(img, url, '1');

  return <img style={{ width: 50, height: 50 }} src={`localasset://${url}`} />;
  // return img ? (
  //   <>
  //     <img style={{ width: 50, height: 50 }} src={img} />
  //     <img style={{ width: 50, height: 50 }} src={`localAsset://${url}`} />
  //   </>
  // ) : (
  //   <p>nothing</p>
  // );
}

function Hello() {
  const [preview, setPreview] = useState();
  const [file, setFile] = useState<File>();

  const [direct, setDirect] = useState();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // window.electron.ipcRenderer.checkDir('dir-channel', ['test']);
      window.electronStore.directory.fetch(`C:/Users/Lucien/Pictures/CV`);

      setFile(e.target.files[0]);
    }
  };

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFetchDirectory = () => {
    console.log('start');
    const res = window.electronStore.directory.fetch(
      false
        ? `C:/Users/Lucien/Pictures/CV`
        : `D:/backup oneplus camera/archive-delete 2017-2018`
    );
    console.log('end', res);
    // console.log(
    //   window.electronStore.directory.getStats(
    //     `C:/Users/Lucien/Pictures/CV`
    //   )
    // );
  };
  useEffect(() => {
    // Listen for the event
    const subscription = window.electron.ipcRenderer.on(
      'test-luc',
      (directory) => {
        console.log('RECEIVED1', directory);
        setDirect(directory);
      }
    );
    // ipcRenderer.on(channels.GET_DATA, (event, arg) => {
    //   setData(arg);
    // });
    // Clean the listener after the component is dismounted
    return () => {
      subscription();
      // ipcRenderer.ipcMain.removeListener();
    };
  }, []);
  console.log(direct);
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        {/* <button type="button" onClick={} >
          test
        </button> */}
        <input type="file" onChange={handleFileChange} />
        {file && <img style={{ width: 50, height: 50 }} src={preview} />}
        {direct && (
          <FileImage url={`${direct.directory}/${direct.result[0].name}`} />
        )}
        <button
          type="button"
          onClick={() => {
            window.electronStore.store.set('foo', 'bar');
            // // or
            // console.log(window.electronStore.store.get('foo'));

            console.log(
              window.electronStore.directory.getStats(
                `C:/Users/Lucien/Pictures/CV`
              )
            );
          }}
        >
          GET.
        </button>
        <button type="button" onClick={handleFetchDirectory}>
          FETCH.
        </button>
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs 1
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
