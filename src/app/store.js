import { configureStore } from '@reduxjs/toolkit';
import sagaMiddleware from './rootSaga';
import createRootReducer from './rootReducer';

const rootReducer = createRootReducer()

const middleware = [ sagaMiddleware ];

const store = configureStore({
  middleware,
  reducer: rootReducer,
});

export default store;
