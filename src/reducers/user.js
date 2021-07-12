/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const configSlice = createSlice({
  name: 'user',
  initialState: {
    address: '',
    balances: {},
    network: '',
    networkID: '',
    isLoading: false,
    loadingMessage: '',
    foreign: {
      totalSupply: 0.00,
      balance: 0.00,
      minPerTx: 0.00,
      maxPerTx: 0.00,
      maxCurrentLimit: 0.00,
    },
    home: {
      totalSupply: 0.00,
      balance: 0.00,
      minPerTx: 0.00,
      maxPerTx: 0.00,
      maxCurrentLimit: 0.00,
    },
  },
  reducers: {
    startUpdateAccount() { },
    updateAccount(state, action) {
      state.address = action.payload;
    },
    updateBalance(state, action) {
      state.balances[ action.payload.name ] = action.payload.value
    },
    updateNetwork(state, action) {
      state.network = action.payload
    },
    updateNetworkID(state, action) {
      state.networkID = action.payload
    },
    updateIsLoading(state, action) {
      state.isLoading = action.payload
    },
    updateLoadingMessage(state, action) {
      state.loadingMessage = action.payload
    },
    updateForeignBalance(state, action) {
      state.foreign = action.payload
    },
    updateHomeBalance(state, action) {
      state.home = action.payload
    },
  },
})

const { actions, reducer } = configSlice;

export const {
  updateForeignBalance, updateHomeBalance, updateAccount, updateBalance, updateNetwork, updateNetworkID, updateIsLoading, updateLoadingMessage,
} = actions;

export default reducer;
