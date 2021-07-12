/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable radix */
import BN from 'bignumber.js';
import {
  fromWei, toHex, toWei, toBN,
} from 'web3-utils';
import { fromDecimals } from './decimals';
import {
  COMMON_FOREIGN_GAS_PRICE_FACTOR, COMMON_FOREIGN_GAS_PRICE_SPEED_TYPE, URLs,
} from '../constants';
import FOREIGN_AMB_ABI from '../ABI/ForeignAMB.json';
import { getBlockNumber } from '.';
import { getPastEvents as commonGetPastEvents } from './foreignStore';

const waitingForConfirmation = new Set();
const filter = false;
let events = [];
let filteredBlockNumber = 0;

export const AMB_MULTIPLE_REQUESTS_PER_TX_VERSION = {
  major: 5,
  minor: 0,
  patch: 0,
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getBalanceOf = async (contract, address) => {
  const balance = await contract.methods.balanceOf(address).call()
  const decimals = await contract.methods.decimals().call()
  return fromDecimals(balance, decimals)
}

export const getFeeManager = async (contract) => {
  try {
    return await contract.methods.feeManagerContract().call()
  } catch (e) {
    return ZERO_ADDRESS
  }
}

export const getFeeManagerMode = (contract) => contract.methods.getFeeManagerMode().call()

export const getHomeFee = async (contract) => {
  const feeInWei = await contract.methods.getHomeFee().call()
  return new BN(fromWei(feeInWei.toString()))
}

export const getForeignFee = async (contract) => {
  const feeInWei = await contract.methods.getForeignFee().call()
  return new BN(fromWei(feeInWei.toString()))
}

export const getFee = async (contract) => {
  try {
    const feeInWei = await contract.methods.getFee().call()
    return new BN(fromWei(feeInWei.toString()))
  } catch (e) {
    return new BN(0)
  }
}

export const getMaxPerTxLimit = async (contract, decimals) => {
  const maxPerTx = await contract.methods.maxPerTx().call()
  return fromDecimals(maxPerTx, decimals)
}

export const getMinPerTxLimit = async (contract, decimals) => {
  const minPerTx = await contract.methods.minPerTx().call()
  return fromDecimals(minPerTx, decimals)
}

export const getSymbol = (contract) => contract.methods.symbol().call()

export const getDecimals = (contract) => contract.methods.decimals().call()

export const getBridgeContract = async (contract) => contract.methods.bridgeContract().call()

export const getCurrentLimit = async (contract, otherContract, decimals) => {
  const currentDay = await contract.methods.getCurrentDay().call()
  const dailyLimit = await contract.methods.dailyLimit().call()
  const totalSpentPerDay = await otherContract.methods.totalExecutedPerDay(currentDay).call()
  const maxCurrentDeposit = new BN(dailyLimit).minus(new BN(totalSpentPerDay)).toString(10)
  return {
    maxCurrentDeposit: fromDecimals(maxCurrentDeposit, decimals),
    dailyLimit: fromDecimals(dailyLimit, decimals),
    totalSpentPerDay: fromDecimals(totalSpentPerDay, decimals),
  }
}

export const getRequiredBlockConfirmations = async (contract) => {
  const blockConfirmations = await contract.methods.requiredBlockConfirmations().call()
  return parseInt(blockConfirmations)
}

export const getblockConfirmations = async (contract, web3, id) => {
  let requiredBlockConfirmations;
  if (id === 42) {
    const foreignAMBBridgeContract = await getBridgeContract(contract)
    const ambBridgeContract = new web3.eth.Contract(FOREIGN_AMB_ABI, foreignAMBBridgeContract)
    requiredBlockConfirmations = await getRequiredBlockConfirmations(ambBridgeContract)
  } else {
    requiredBlockConfirmations = await getRequiredBlockConfirmations(contract)
  }
  return requiredBlockConfirmations;
}

const gasPriceWithinLimits = (gasPrice, limits) => {
  if (!limits) {
    return gasPrice
  }
  if (gasPrice < limits.MIN) {
    return limits.MIN
  } if (gasPrice > limits.MAX) {
    return limits.MAX
  }
  return gasPrice
}

const normalizeGasPrice = (oracleGasPrice, factor, limits = null) => {
  let gasPrice = oracleGasPrice * factor
  gasPrice = gasPriceWithinLimits(gasPrice, limits)
  return toBN(toWei(gasPrice.toFixed(2).toString(), 'gwei'))
}

export const gasPriceFromSupplier = async (fetchFn, options = {}) => {
  try {
    const response = await fetchFn()
    const json = await response.json()

    const oracleGasPrice = json[ options.speedType ]

    if (!oracleGasPrice) {
      options.logger
        && options.logger.error
        && options.logger.error(`Response from Oracle didn't include gas price for ${ options.speedType } type.`)
      return null
    }

    const normalizedGasPrice = normalizeGasPrice(oracleGasPrice, options.factor, options.limits)

    options.logger
      && options.logger.debug
      && options.logger.debug({ oracleGasPrice, normalizedGasPrice }, 'Gas price updated using the API')

    return normalizedGasPrice
  } catch (e) {
    options.logger && options.logger.error && options.logger.error(`Gas Price API is not available. ${ e.message }`)
  }
  return null
}

export const gasPriceInHex = async () => {
  const oracleOptions = { speedType: COMMON_FOREIGN_GAS_PRICE_SPEED_TYPE, factor: Number(COMMON_FOREIGN_GAS_PRICE_FACTOR), logger: console }
  const fetchFn = URLs.COMMON_FOREIGN_GAS_PRICE_SUPPLIER_URL === 'gas-price-oracle' ? null : () => fetch(URLs.COMMON_FOREIGN_GAS_PRICE_SUPPLIER_URL)
  const gasPrice = await gasPriceFromSupplier(fetchFn, oracleOptions)
  return toHex(gasPrice.toString())
}

export const isStatusSuccess = (tx) => {
  const statusSuccess = tx.status && (tx.status === true || toBN(tx.status).eq(toBN(1)))
  const eventEmitted = tx.logs && tx.logs.length
  return statusSuccess || eventEmitted
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[ index ], index, array)
  }
}

export const getPastEvents = (bridge, fromBlock, toBlock, event = 'allEvents', options = {}) => commonGetPastEvents(bridge, {
  fromBlock, toBlock, event, options,
})

export const getMessage = (contract, messageHash) => contract.methods.message(messageHash).call()

export const getSignedTx = async (messageHash, contract) => {
  try {
    const message = await getMessage(contract, messageHash)
    return `0x${ message.substring(106, 170) }`
  } catch (e) {
    console.error(e)
    return 0;
  }
}

export const getExplorerTxUrl = (txHash) => URLs.UI_HOME_EXPLORER_TX_TEMPLATE.replace('%s', txHash)

export const getEvents = async (fromBlock, toBlock, bridge, web3, setOpenMessage, setMessage) => {
  const latestBlockNumber = await getBlockNumber(web3)
  fromBlock = fromBlock || filteredBlockNumber || latestBlockNumber - 50
  toBlock = toBlock || filteredBlockNumber || 'latest'

  if (fromBlock < 0) {
    fromBlock = 0
  }

  try {
    const event = await getPastEvents(bridge, fromBlock, toBlock).catch((e) => {
      console.error("Couldn't get events", e)
      return []
    })

    const homeEvents = []
    await asyncForEach(event, async (e) => {
      if (e.event === 'SignedForUserRequest' || e.event === 'CollectedSignatures') {
        e.signedTxHash = await getSignedTx(e.returnValues.messageHash, bridge)
      }
      homeEvents.push(e)
    })

    if (!filter) {
      events = homeEvents
    }
    console.log('homeEvents:===========', homeEvents)

    if (waitingForConfirmation.size) {
      const confirmationEvents = homeEvents.filter(
        (e) => e.event === 'AffirmationCompleted'
          && waitingForConfirmation.has(e.returnValues.transactionHash),
      )
      console.log('waitingForConfirmation:=======', waitingForConfirmation);
      console.log('confirmationEvents:=======', confirmationEvents);

      // if (confirmationEvents.size) {
      confirmationEvents.forEach((e) => {
        // const urlExplorer = getExplorerTxUrl(e.transactionHash)
        // const unitReceived = 'Tokens'
        setTimeout(() => {
          setOpenMessage(true)
          setMessage(e.transactionHash)
        }, 2000)
        waitingForConfirmation.delete(e.returnValues.transactionHash)
      })
      // } else {
      //   setTimeout(() => {
      //     setOpenMessage(true)
      //   }, 8000)
      // }
    }

    return homeEvents
  } catch (e) {
    console.log(
      `Cannot establish connection to Home Network.\n
               Please make sure you have set it up in env variables`,
    )
    return 0;
  }
}

export const setBlockFilter = async (blockNumber, bridge, web3, setOpenMessage, setMessage) => {
  filteredBlockNumber = blockNumber
  events = await getEvents(null, null, bridge, web3, setOpenMessage, setMessage)
}

export const addWaitingForConfirmation = async (hash, bridge, web3, setOpenMessage, setMessage) => {
  waitingForConfirmation.add(hash)
  setBlockFilter(0, bridge, web3, setOpenMessage, setMessage)
}

export const getTotalSupply = async (contract) => {
  const totalSupply = await contract.methods.totalSupply().call()
  const decimals = await contract.methods.decimals().call()
  return fromDecimals(totalSupply, decimals)
}
