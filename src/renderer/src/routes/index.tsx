import { useRoutes } from 'react-router-dom';
import { routePhotoViewer } from '../features/photoViewer';
import ReduxProvider from '../providers/reduxProviders';

const MainRouteProvider = () => {
  const routeElement = useRoutes(routePhotoViewer);
  return <ReduxProvider>{routeElement}</ReduxProvider>;
};

export default MainRouteProvider;
