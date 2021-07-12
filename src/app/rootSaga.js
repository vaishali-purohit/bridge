import { all, fork } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import startUpSaga from '../saga/startUpSaga';
import userSaga from '../saga/userSaga';

function* rootSaga() {
  yield all(
    [
      fork(startUpSaga),
      fork(userSaga),
    ],
  );
}

const sagaMiddleware = createSagaMiddleware();

export const startSaga = () => {
  sagaMiddleware.run(rootSaga);
};

export default sagaMiddleware;
