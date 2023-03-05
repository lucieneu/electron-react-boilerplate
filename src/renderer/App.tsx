import {
  MemoryRouter as Router,
  Routes,
  Route,
  useRoutes,
  RouterProvider,
  BrowserRouter,
} from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import { useListener } from './src/hooks/electron';
import {
  FileImage,
  PhotoPreviewer,
} from './src/features/photoViewer/components/PhotoPreviewer';
import { allowImgTypes } from './src/config/static';
import mainRoute from './src/routes';
import MainRouteProvider from './src/routes';

// window.electronStore.directory.fetch(`C:/Users/Lucien/Pictures/CV`);

function DirInput({ onSubmit }: { onSubmit: Function }) {
  const [state, setState] = useState(
    `D:/backup oneplus camera/archive-delete 2017-2018`
  );
  const handleClick = () => {
    onSubmit(state);
  };

  useEffect(() => {
    handleClick();
  }, []);
  return (
    <div>
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <button type="button" onClick={handleClick}>
        Click.
      </button>
    </div>
  );
}

function Hello() {
  const [searchDir, setSearchDir] = useState();
  const [direct, setDirect] = useState();

  const handleFetchDirectory = (dir = '') => {
    console.log('start');
    // false
    //   ? `C:/Users/Lucien/Pictures/CV`
    //   : `D:/backup oneplus camera/archive-delete 2017-2018`;

    const res = window.electronStore.directory.fetch(dir);
    console.log('end', res);
    // console.log(
    //   window.electronStore.directory.getStats(
    //     `C:/Users/Lucien/Pictures/CV`
    //   )
    // );
  };
  useListener((directory) => {
    console.log(
      'RECEIVED1',
      directory,
      directory.result.filter((file) => allowImgTypes.includes(file.extension))
    );
    setDirect({
      ...directory,
      result: directory.result.filter((file) =>
        allowImgTypes.includes(file.extension)
      ),
    });
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

  return (
    <div>
      {/* <FileImage url={`${direct.directory}/${direct.result[0].name}`} /> */}
      {direct && (
        <PhotoPreviewer
          directory={direct.directory}
          photoList={direct.result}
        />
      )}
      <DirInput onSubmit={handleFetchDirectory} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainRouteProvider />
    </BrowserRouter>
  );
}
