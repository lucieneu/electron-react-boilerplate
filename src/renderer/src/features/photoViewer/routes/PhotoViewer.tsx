// import {
//   MemoryRouter as Router,
//   Routes,
//   Route,
//   useRoutes,
//   RouterProvider,
//   BrowserRouter,
// } from 'react-router-dom';
// import { useEffect, useState, useRef } from 'react';
// import icon from '../../assets/icon.svg';
// import './App.css';
// import { useListener } from './src/hooks/electron';
// import { FileImage, PhotoPreviewer } from './src/components/PhotoPreviewer';
// import { allowImgTypes } from './src/config/static';
// import mainRoute from './src/routes';
// import MainRouteProvider from './src/routes';

import { useEffect, useState } from 'react';
import { allowImgTypes } from 'renderer/src/config/static';
import { useListener } from 'renderer/src/hooks/electron';
import { useAppSelector } from 'renderer/src/hooks/redux';
import { selectPath } from 'renderer/src/stores/directorySlice';
import { PhotoPreviewer } from '../components/PhotoPreviewer';

// window.electronStore.directory.fetch(`C:/Users/Lucien/Pictures/CV`);

type DirectType = {
  directory: any;
  result: any;
};

function PhotoViewerPage() {
  const [direct, setDirect] = useState<DirectType>();
  const path = useAppSelector(selectPath);

  useEffect(() => {
    console.log('start');
    const res = window.electronStore.directory.fetch(path);
    console.log('end', res);
  }, [path]);

  useListener((directory: { result: { filter: any } }) => {
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
  console.log(direct);
  // useEffect(() => {
  //   if (reset) navigate('/');
  // }, []);

  return (
    <div>
      {direct && (
        <PhotoPreviewer
          directory={direct.directory}
          photoList={direct.result}
        />
      )}
    </div>
  );
}

function PhotoViewer() {
  return <PhotoViewerPage />;
}
export { PhotoViewer };
