import { createBrowserRouter } from 'react-router-dom';
import { NotFound } from './NotFound';
import { PhotoViewer } from './PhotoViewer';
import { Root } from './Root';
import { SelectDirectory } from './SelectDirectory';
import { LabelCreation } from './LabelCreation';

const routePhotoViewer = [
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'photo-viewer',
        element: <PhotoViewer />,
      },
      {
        path: 'directory',
        element: <SelectDirectory />,
      },

      {
        path: 'label-creation',
        element: <LabelCreation />,
      },

      // {
      //   path: 'dashboard',
      //   element: <Dashboard />,
      //   loader: ({ request }) =>
      //     fetch('/api/dashboard.json', {
      //       signal: request.signal,
      //     }),
      // },
      // {
      //   element: <AuthLayout />,
      //   children: [
      //     {
      //       path: 'login',
      //       element: <Login />,
      //       loader: redirectIfUser,
      //     },
      //     {
      //       path: 'logout',
      //       action: logoutUser,
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routePhotoViewer;
