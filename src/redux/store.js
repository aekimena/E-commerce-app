import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers';
import {thunk} from 'redux-thunk';

const middleware = process.env.NODE_ENV === 'development' ? [thunk] : [];

export default configureStore(
  {
    reducer: rootReducer,
  },
  applyMiddleware(...middleware),
);
