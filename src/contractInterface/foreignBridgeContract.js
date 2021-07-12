import foreignBridgeErc677ToErc677 from '../ABI/ForeignBridgeErc677ToErc677.json';

class ForeignBridgeErc677ToErc677 {
  constructor(address, web3) {
    this.UserContract = new web3.eth.Contract(foreignBridgeErc677ToErc677, address);
  }

  getInstance = async () => this.UserContract;
}

let contract = null
const getContract = (address, web3) => {
  contract = new ForeignBridgeErc677ToErc677(address, web3);
  Object.freeze(contract);
  return contract;
}

export default getContract;
