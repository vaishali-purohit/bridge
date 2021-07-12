/* eslint-disable no-console */
/* eslint-disable max-len */
import {
  put, takeLatest, call,
} from 'redux-saga/effects';
import { updateMetaMask, updateForeignWeb3Instance, updateHomeWeb3Instance } from '../reducers/metamask';
import {
  initializeWeb3, isMetamaskInstalled, askPermission, getNetworkId, initializeTorusWallet, getNetworkName, getAccountAddress, getWeb3Instance,
} from '../utils/index';
import {
  updateNetwork, updateNetworkID, updateAccount, updateIsLoading, updateLoadingMessage,
} from '../reducers/user';
import { COMMON_FOREIGN_RPC_URL, COMMON_HOME_RPC_URL } from '../constants';

function* startSaga() {
  // yield takeLatest('FETCH_DATA', startupSaga);
  yield takeLatest('CONNECT_WALLET', connectWallet);
}

function* connectWallet(action) {
  try {
    const isMetamask = yield isMetamaskInstalled();
    yield put(updateMetaMask({ isAvailable: isMetamask }))
    if (isMetamask && action.payload.wallet === 'Metamask') {
      initializeWeb3()
      yield askPermission()
      yield call(startupSaga)
      const network = yield getNetworkName()
      const id = yield getNetworkId();
      if (id === 56) {
        yield put(updateNetwork('bsc-mainnet'))
      } else if (id === 97) {
        yield put(updateNetwork('bsc-testnet'))
      } else {
        yield put(updateNetwork(network))
      }
      yield put(updateNetworkID(id))
      const walletAddress = yield getAccountAddress()
      yield put(updateAccount(walletAddress))
    } else if (action.payload.wallet === 'Torus') {
      const isWalletConnected = yield initializeTorusWallet(action.payload.network)
      if (isWalletConnected) {
        yield call(startupSaga)
        yield put(updateNetwork(action.payload.network === 56 ? 'bsc-mainnet' : 'kovan'))
        yield put(updateNetworkID(action.payload.network))
      }
      const walletAddress = yield getAccountAddress()
      yield put(updateAccount(walletAddress))
    }
  } catch (error) {
    console.log(error)
  }
}

export function* startupSaga() {
  try {
    yield put(updateIsLoading(true));
    yield put(updateLoadingMessage('Fetching values. Please wait.'));

    const homeURL = yield getWeb3Instance(COMMON_HOME_RPC_URL);
    yield put(updateHomeWeb3Instance(homeURL));

    const foreignURL = yield getWeb3Instance(COMMON_FOREIGN_RPC_URL);
    yield put(updateForeignWeb3Instance(foreignURL));
  } catch (error) {
    console.log(error)
  }
  yield put(updateIsLoading(false));
}

export default startSaga;
