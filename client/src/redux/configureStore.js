import ReduxThunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import Reducers from './combinedReducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const store = createStore(
    Reducers,
    composeEnhancers(applyMiddleware(ReduxThunk))
  );

  return store;
};

export default configureStore;
