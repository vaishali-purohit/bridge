import foreignAMB from '../ABI/ForeignAMB.json';

class ForeignAMB {
  constructor(address, web3) {
    this.UserContract = new web3.eth.Contract(foreignAMB, address);
  }

  getInstance = async () => this.UserContract;
}

let contract = null
const getContract = (address, web3) => {
  contract = new ForeignAMB(address, web3);
  Object.freeze(contract);
  return contract;
}

export default getContract;
