import homeBridgeErcToErc from '../ABI/HomeBridgeErcToErc.json';

class HomeBridgeErcToErc {
  constructor(address, web3) {
    this.UserContract = new web3.eth.Contract(homeBridgeErcToErc, address);
  }

  getInstance = async () => this.UserContract;
}

let contract = null
const getContract = (address, web3) => {
  contract = new HomeBridgeErcToErc(address, web3);
  Object.freeze(contract);
  return contract;
}

export default getContract;
