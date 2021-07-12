/* eslint-disable no-console */
/* eslint-disable max-len */
import {
  takeEvery, put, fork, call, take, select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  getAccounts, getNetworkName, getNetworkId, metaMaskAccountsChanged,
} from '../utils/index';
import {
  updateAccount, updateNetwork, updateNetworkID,
} from '../reducers/user';
import { networks } from '../constants';

function* networkId() {
  const network = yield getNetworkName()
  const networkID = yield getNetworkId()
  if (networks[ networkID ]) {
    yield put(updateNetwork(network))
  } else {
    yield put(updateNetwork(`${ network } network not supported please switch to Kovan`))
  }
  yield put(updateNetworkID(networkID))
}

function createMetaMaskAccountChannel() {
  return eventChannel((emit) => {
    metaMaskAccountsChanged((account) => {
      emit(account)
    });
    return () => {
      console.log('Account changed');
    }
  })
}

export function* watchMetaMaskAccountChange() {
  const accountChannel = yield call(createMetaMaskAccountChannel)
  while (true) {
    try {
      yield take(accountChannel)
      const oldnetwork = yield select((state) => state.user.networkID)
      const newnetwork = yield getNetworkId()
      yield put({ type: 'NETWORK' })
      if (oldnetwork === newnetwork) {
        // only account has been changed
        const account = yield getAccounts()
        yield put(updateAccount(account[ 0 ]))
      } else if (oldnetwork && newnetwork) {
        window.location.reload()
      }
    } catch (err) {
      console.error('error in Channel:', err)
    }
  }
}

function* userSaga() {
  yield takeEvery('NETWORK', networkId);
  yield fork(watchMetaMaskAccountChange);
}

export default userSaga;
