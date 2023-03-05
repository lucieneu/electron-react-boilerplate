import { useRoutes } from 'react-router-dom';
import { routePhotoViewer } from '../features/photoViewer';

const MainRouteProvider = () => {
  const routeElement = useRoutes(routePhotoViewer);
  return routeElement;
};

export default MainRouteProvider;
