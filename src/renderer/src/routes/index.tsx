import { useRoutes } from 'react-router-dom';
import { routePhotoViewer } from '../features/photoViewer';
import ReduxProvider from '../providers/reduxProviders';

function MainRouteProvider() {
  const routeElement = useRoutes(routePhotoViewer);
  return <ReduxProvider>{routeElement}</ReduxProvider>;
}

export default MainRouteProvider;
