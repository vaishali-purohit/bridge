import erc677BridgeToken from '../ABI/ERC677BridgeToken.json';

class ERC677BridgeToken {
  constructor(address, web3) {
    this.UserContract = new web3.eth.Contract(erc677BridgeToken, address);
  }

  getInstance = async () => this.UserContract;
}

let contract = null
const getContract = (address, web3) => {
  contract = new ERC677BridgeToken(address, web3);
  Object.freeze(contract);
  return contract;
}

export default getContract;
