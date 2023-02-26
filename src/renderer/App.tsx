import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import { useListener } from './src/hooks/electron';

// window.electronStore.directory.fetch(`C:/Users/Lucien/Pictures/CV`);

function FileImage({ url }) {
  return <img style={{ width: 50, height: 50 }} src={`localasset://${url}`} />;
}

function Hello() {
  const [searchDir, setSearchDir] = useState();
  const [direct, setDirect] = useState();

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
  useListener((directory) => {
    console.log('RECEIVED1', directory);
    setDirect(directory);
  }, 'test-luc');
  // useEffect(() => {
  //   // Listen for the event
  //   const subscription = window.electron.ipcRenderer.on(
  //     'test-luc',
  //     (directory) => {
  //       console.log('RECEIVED1', directory);
  //       setDirect(directory);
  //     }
  //   );

  //   // Clean the listener after the component is dismounted
  //   return () => {
  //     subscription();
  //   };
  // }, []);

  console.log(searchDir, '- ', direct);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.webkitdirectory = true;

    inputRef.current.directory = true;
  }, []);

  return (
    <div>
      {direct && (
        <FileImage url={`${direct.directory}/${direct.result[0].name}`} />
      )}
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          console.log(URL.createObjectURL(e.target.files));
          setSearchDir(e.target.files);
        }}
        webkitdirectory
        webkitEntries
        webkitentries
        multiple
      />
      <button
        type="button"
        onClick={() => {
          window.electronStore.store.set('foo', 'bar');

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
