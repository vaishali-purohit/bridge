/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import Torus from '@toruslabs/torus-embed';
import '@metamask/legacy-web3';
import Web3 from 'web3';
import { toHex } from 'web3-utils'

export const isMetamaskInstalled = () => !!window.ethereum || !!window.web3

export const initializeWeb3 = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    // window.ethereum.autoRefreshOnNetworkChange = false;
  } else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
}

export const askPermission = async () => {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    throw new Error(error);
  }
}

export const initializeTorusWallet = async (networkId) => {
  const torus = new Torus({
    buttonPosition: 'bottom-right',
  });
  const network = {
    42: { host: 'kovan', chainId: 42 },
  }
  try {
    await torus.init({ showTorusButton: true, network: network[ networkId ] });
    await torus.login();
    window.web3 = new Web3(torus.provider);
    return true
  } catch (error) {
    await torus.cleanUp();
    console.log(error)
    return false
  }
}

export const getNetworkId = async () => window.web3.eth.net.getId();

export const getAccounts = async () => window.web3.eth.getAccounts();

export const getAccountAddress = async () => {
  const [ address ] = await window.web3.eth.getAccounts();
  return address
}

export const getNetworkName = () => window.web3.eth.net.getNetworkType()

export const isUserLoggedIn = () => new Promise((resolve, reject) => {
  window.web3.eth.getAccounts((err, accounts) => {
    if (err != null) {
      console.log(err)
      reject(err);
    }
    resolve(accounts.length !== 0)
  });
});

export const metaMaskAccountsChanged = (callback) => {
  window.ethereum.on('chainChanged', callback)
  window.ethereum.on('accountsChanged', callback);
}

export const getWeb3Instance = (url) => {
  const web3Provider = new Web3.providers.HttpProvider(url);
  return new Web3(web3Provider);
}

export const getNetwork = async (web3) => {
  const id = await web3.eth.getChainId()
  const name = getNetworkName(id)
  return {
    id,
    name,
  }
}

export const estimateGas = async (to, gasPrice, from, value, data) => {
  const gas = await window.web3.eth.estimateGas({
    to, gasPrice, from, value, data,
  })
  return toHex(gas.toString())
}

export const getBlockNumber = (web3) => web3.eth.getBlockNumber()
