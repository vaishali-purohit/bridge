import BN from 'bignumber.js';

export const networks = {
  42: 'Kovan',
  97: 'BSC Testnnet',
}

export const networkName = 'Kovan'

export const contractAddresses = {
  homeBridge: '',
  foreignBridge: '',
  bscTKN: '',
  tkn: '',
}

export const COMMON_HOME_RPC_URL = 'https://data-seed-prebsc-2-s3.binance.org:8545/'
export const COMMON_FOREIGN_RPC_URL = 'https://kovan.infura.io/v3/8c958ab1f2574a5ab388a955941d2d7b'

export const UI_NATIVE_TOKEN_DISPLAY_NAME = 'TKN'
export const UI_HOME_NETWORK_DISPLAY_NAME = 'BSC TKN'
export const UI_FOREIGN_NETWORK_DISPLAY_NAME = 'Kovan'

// Set to true if network doesn't support events
export const UI_HOME_WITHOUT_EVENTS = false
export const UI_FOREIGN_WITHOUT_EVENTS = false

export const URLs = {
  UI_HOME_EXPLORER_TX_TEMPLATE: 'https://testnet.bscscan.com/tx',
  UI_FOREIGN_EXPLORER_TX_TEMPLATE: 'https://kovan.etherscan.io/tx',
  UI_HOME_EXPLORER_ADDRESS_TEMPLATE: 'https://testnet.bscscan.com/address',
  UI_FOREIGN_EXPLORER_ADDRESS_TEMPLATE: 'https://kovan.etherscan.io/address',
  COMMON_HOME_GAS_PRICE_SUPPLIER_URL: 'https://gasprice.poa.network/',
  COMMON_FOREIGN_GAS_PRICE_SUPPLIER_URL: 'https://gasprice.poa.network/',
}

export const COMMON_HOME_GAS_PRICE_SPEED_TYPE = 'standard'
export const COMMON_HOME_GAS_PRICE_FALLBACK = 5000000000
export const UI_HOME_GAS_PRICE_UPDATE_INTERVAL = 15000
export const COMMON_HOME_GAS_PRICE_FACTOR = 1
export const COMMON_FOREIGN_GAS_PRICE_SPEED_TYPE = 'standard'
export const COMMON_FOREIGN_GAS_PRICE_FALLBACK = 5000000000
export const UI_FOREIGN_GAS_PRICE_UPDATE_INTERVAL = 15000
export const COMMON_FOREIGN_GAS_PRICE_FACTOR = 1

// Default
export const UI_TITLE = 'TKN BSC-ETH Bridge UI app'
export const UI_OG_TITLE = 'TKN BSC-ETH Bridge UI'
export const UI_DESCRIPTION = 'TKN BSC-ETH cross-chain bridge serves as a method of transferring TKN native tokens from the Ethereum Network to the BSC network in a quick and cost-efficient manner.'
export const UI_PORT = 3000
export const UI_PUBLIC_URL = 'https://bridge.poa.net'

// RSK
export const UI_STYLES = 'core'

export const BRIDGE_MODES = {
  ERC_TO_ERC: 'ERC_TO_ERC',
}

export const ERC_TYPES = {
  ERC20: 'ERC20',
}

export const feeManager = {
  totalFeeDistributedFromSignatures: BN(0),
  totalFeeDistributedFromAffirmation: BN(0),
  feeManagerMode: 'UNDEFINED',
  homeFee: new BN(0),
  foreignFee: new BN(0),
}
