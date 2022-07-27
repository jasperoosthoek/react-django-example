import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { authReducer } from '../components/shared/Login';
import factory from './factory';
import { LOGIN_UNSET_CURRENT_USER } from '../components/shared/ReactToolbox';

const consoleLogReducer = (state = null, { type, ...action }) => {
  console.log(type, action, state);
  return state;
}

const createRootReducer = history => {
  const rootReducer = (state, action) => consoleLogReducer(combineReducers({
    router: connectRouter(history),
    ...authReducer,
    ...factory.reducers,
  })(state, action), action);
  
  return (state, action) => {
    if (action.type === LOGIN_UNSET_CURRENT_USER) {
      return rootReducer(undefined, action)
    }

    return rootReducer(state, action)
  };
}

export default createRootReducer;


// export default createRootReducer;