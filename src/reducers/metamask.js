/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

const configSlice = createSlice({
  name: 'metamask',
  initialState: {
    isAvailable: false,
    homeWeb3: null,
    foreignWeb3: null,
  },
  reducers: {
    connectMetamask() { },
    updateMetaMask(state, action) {
      state.isAvailable = action.payload.isAvailable;
    },
    updateHomeWeb3Instance(state, action) {
      state.homeWeb3 = action.payload
    },
    updateForeignWeb3Instance(state, action) {
      state.foreignWeb3 = action.payload
    },
  },
})

const { actions, reducer } = configSlice;

export const {
  updateMetaMask, connectMetamask, updateForeignWeb3Instance, updateHomeWeb3Instance,
} = actions;

export default reducer;
