/* eslint-disable max-len */
import HomeBridgeContract from '../contractInterface/homeBridgeContract';
import Erc677BridgeTokenContract from '../contractInterface/erc677BridgeTokenContract';

import { contractAddresses } from '../constants';

const ContractInitialization = async (homeWeb3) => {
  const homeBridgeContract = HomeBridgeContract(contractAddresses.homeBridge, homeWeb3);
  const homeBridgeContractInstance = await homeBridgeContract.getInstance();

  const erc677HomeBridgeTokenContract = Erc677BridgeTokenContract(contractAddresses.bscTKN, homeWeb3);
  const erc677HomeBridgeTokenContractInstance = await erc677HomeBridgeTokenContract.getInstance();

  return {
    homeBridgeContractInstance,
    erc677HomeBridgeTokenContractInstance,
  }
}

export default ContractInitialization;
