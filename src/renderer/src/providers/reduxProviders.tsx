import { Provider } from 'react-redux';
import { store } from '../stores';

console.log(store);
function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

export default ReduxProvider;
