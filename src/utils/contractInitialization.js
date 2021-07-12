/* eslint-disable max-len */
import ForeignBridgeContract from '../contractInterface/foreignBridgeContract';
import Erc677BridgeTokenContract from '../contractInterface/erc677BridgeTokenContract';

import { contractAddresses } from '../constants';

const ContractInitialization = async (foreignWeb3) => {
  const foreignBridgeContract = ForeignBridgeContract(contractAddresses.foreignBridge, foreignWeb3);
  const foreignBridgeContractInstance = await foreignBridgeContract.getInstance();

  const erc677ForeignBridgeTokenContract = Erc677BridgeTokenContract(contractAddresses.tkn, foreignWeb3);
  const erc677ForeignBridgeTokenContractInstance = await erc677ForeignBridgeTokenContract.getInstance();

  return {
    foreignBridgeContractInstance,
    erc677ForeignBridgeTokenContractInstance,
  }
}

export default ContractInitialization;
