import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './redux/reducers';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history),
  {},
  compose(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
    ),
  ),
);

const Root = ({ children }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      {children}
    </ConnectedRouter>
  </Provider>
);

export default Root;
