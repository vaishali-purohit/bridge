/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-inner-declarations */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles, Button, Box, Grid, InputBase, Typography,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import BN from 'bignumber.js';
import ContractInitialization from '../utils/contractInitialization';
import ContractInitializationHome from '../utils/contractInitializeHome';
import {
  getBalanceOf, getMaxPerTxLimit, getMinPerTxLimit, getDecimals, getCurrentLimit, getSymbol, getblockConfirmations, gasPriceInHex, isStatusSuccess, addWaitingForConfirmation, getEvents, getTotalSupply,
} from '../utils/contract';
import PopupDialog from '../component/PopupModal';
import AlertModal from '../component/AlertModal';
import { contractAddresses, COMMON_HOME_RPC_URL, URLs } from '../constants';
import { toDecimals } from '../utils/decimals';
import { estimateGas, getBlockNumber } from '../utils';
import SuccessModal from '../component/SuccessModal';
import ModalContainer from './ModalContainer';
import { updateForeignBalance, updateHomeBalance } from '../reducers/user';

const useStyles = makeStyles((theme) => ({
  box: {
    backgroundColor: theme.backgroundColor,
    padding: '8px 16px',
    '& input': {
      color: theme.text,
    },
  },
  maxButton: {
    marginRight: '0',
    color: theme.grid.color,
    background: 'rgb(104 219 218 / 15%)',
    borderRadius: '0',
    padding: '4px 18px',
    marginLeft: '16px',
    '&:disabled': {
      color: 'white',
      background: '#585d6e',
    },
    '&:hover': {
      background: 'rgb(104 219 218 / 15%)',
    },
  },
  input: {
    color: theme.text,
    backgroundColor: 'transparent',
    fontWeight: 700,
    paddingLeft: '16px',
    border: 'none',
    '&:focus': {
      outline: 'none',
    },
  },
  label: {
    color: theme.text,
    fontWeight: 700,
    lineHeight: '48px',
    margin: '0 10px',
    textTransform: 'uppercase',
  },
  typography: {
    color: theme.text,
    fontWeight: 700,
    fontSize: '20px',
  },
  labelText: {
    color: theme.text,
  },
  belowText: {
    color: theme.grid.color,
    textAlign: 'center',
    opacity: '0.5',
    lineHeight: '5vh',
  },
  errorText: {
    fontSize: 14,
    color: 'red',
  },
}));

const DetailForm = ({
  // eslint-disable-next-line no-shadow
  home, foreign, updateForeignBalance, updateHomeBalance, networkID, address, foreignWeb3, homeWeb3, setLoading, setLoadingText, openMessage, setOpenMessage, setMessage, message,
}) => {
  const classes = useStyles();
  const [ fromAmount, setFromAmount ] = useState();
  const [ instance, setInstance ] = useState([]);
  const [ homeInstance, sethomeInstance ] = useState([]);
  const [ balance, setBalance ] = useState(0.00);
  const [ homeBalance, setHomeBalance ] = useState(0.00);
  const [ errorText, setErrorText ] = useState('');
  const [ open, setOpen ] = useState(false);
  const [ confirmationData, setConfirmationData ] = useState({});
  const [ error, setError ] = useState('');
  const [ openal, setOpenal ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ modalData, setModalData ] = useState({});

  const totalSupplyBalance = async () => {
    let totalSupply; let totalBalance; let decimals; let minPerTx; let maxPerTx; let result;

    totalSupply = await getTotalSupply(instance.erc677ForeignBridgeTokenContractInstance);
    totalBalance = await getBalanceOf(instance.erc677ForeignBridgeTokenContractInstance, address);
    decimals = await getDecimals(instance.erc677ForeignBridgeTokenContractInstance);
    minPerTx = await getMinPerTxLimit(instance.foreignBridgeContractInstance, decimals);
    maxPerTx = await getMaxPerTxLimit(instance.foreignBridgeContractInstance, decimals)
    result = await getCurrentLimit(
      instance.foreignBridgeContractInstance,
      homeInstance.homeBridgeContractInstance,
      decimals,
    )
    await updateForeignBalance({
      totalSupply, balance: totalBalance, minPerTx, maxPerTx, maxCurrentLimit: result.maxCurrentDeposit,
    });

    totalSupply = await getTotalSupply(homeInstance.erc677HomeBridgeTokenContractInstance)
    totalBalance = await getBalanceOf(homeInstance.erc677HomeBridgeTokenContractInstance, address)
    decimals = await getDecimals(homeInstance.erc677HomeBridgeTokenContractInstance);
    minPerTx = await getMinPerTxLimit(homeInstance.homeBridgeContractInstance, decimals);
    maxPerTx = await getMaxPerTxLimit(homeInstance.homeBridgeContractInstance, decimals)
    result = await getCurrentLimit(
      homeInstance.homeBridgeContractInstance,
      instance.foreignBridgeContractInstance,
      decimals,
    )
    await updateHomeBalance({
      totalSupply, balance: totalBalance, minPerTx, maxPerTx, maxCurrentLimit: result.maxCurrentDeposit,
    });
  }

  useEffect(() => {
    if ((networkID === 42 || networkID === 97) && address) {
      async function fetchData() {
        const value = await ContractInitialization(foreignWeb3);
        const data = await ContractInitializationHome(homeWeb3);
        setInstance(value)
        sethomeInstance(data);
      }
      fetchData();
      setInterval(async () => {
        if (networkID === 42) {
          await getEvents(null, null, homeInstance.homeBridgeContractInstance, homeWeb3, setOpenMessage, setMessage)
        } else {
          await getEvents(null, null, instance.foreignBridgeContractInstance, foreignWeb3, setOpenMessage, setMessage)
        }
      }, 15000)
    }
  }, [ networkID, address ])

  const getCardBalances = async () => {
    try {
      let data;
      if (networkID === 42) {
        data = {
          from: 'Kovan',
          to: 'BSC TKN',
          fromCurrency: 'TKN',
          toCurrency: 'BTKN',
        }
        setConfirmationData(data);
        const kbalance = await getBalanceOf(instance.erc677ForeignBridgeTokenContractInstance, address);
        const sbalance = await getBalanceOf(homeInstance.erc677HomeBridgeTokenContractInstance, address);
        setBalance(kbalance);
        setHomeBalance(sbalance);
        updateForeignBalance({ ...foreign, balance: kbalance });
        updateHomeBalance({ ...home, balance: sbalance });
      } else {
        data = {
          from: 'BSC TKN',
          to: 'Kovan',
          fromCurrency: 'BTKN',
          toCurrency: 'TKN',
        }
        setConfirmationData(data);
        const sbalance = await getBalanceOf(instance.erc677ForeignBridgeTokenContractInstance, address);
        const kbalance = await getBalanceOf(homeInstance.erc677HomeBridgeTokenContractInstance, address);

        setBalance(kbalance);
        setHomeBalance(sbalance);
        updateForeignBalance({ ...foreign, balance: sbalance });
        updateHomeBalance({ ...home, balance: kbalance });
      }
      await totalSupplyBalance();
    } catch (e) {
      console.log('Balances ', e);
    }
  }

  const updateAllBalances = async () => {
    setLoading(true);
    setLoadingText('Fetching balances...');
    await getCardBalances();
    setLoadingText('Loading');
    setLoading(false);
  };

  useEffect(async () => {
    if (Object.keys(instance).length && networkID && Object.keys(homeInstance).length) {
      await updateAllBalances();
    }
  }, [ instance, networkID, homeInstance ])

  const onInputChange = (event) => {
    event.preventDefault()
    setErrorText('');
    setFromAmount(event.target.value);
  };

  const transfer = async (e) => {
    e.preventDefault();

    if (fromAmount === '') {
      setErrorText('Please enter an amount');
      return;
    }

    if (parseFloat(fromAmount) <= 0) {
      setErrorText('Amount can not be zero or negative. Please enter valid amount');
      return;
    }

    try {
      setLoading(true);
      setLoadingText('Waiting for Confirmation...')
      const finalAmount = new BN(fromAmount);
      let data;
      if (networkID === 42) {
        data = {
          ...confirmationData,
          fromAmount,
          toAmount: finalAmount,
        }
      } else {
        data = {
          ...confirmationData,
          fromAmount,
          toAmount: finalAmount,
        }
      }
      setOpen(true);
      setLoading(false);
      setConfirmationData(data);
    } catch (er) {
      console.log('Transfer ', er);
    }
  }

  const isLessThan = (amount, base) => new BN(amount).lt(new BN(base))

  const isGreaterThan = (amount, base) => new BN(amount).gt(new BN(base))

  const getTxStatus = async (hash, requiredConfirmations) => {
    window.web3.eth.getTransactionReceipt(hash, async (e, res) => {
      if (res && res.blockNumber) {
        if (isStatusSuccess(res)) {
          let latestBlockNumber;
          if (networkID === 42) {
            latestBlockNumber = await getBlockNumber(foreignWeb3)
          } else {
            latestBlockNumber = await getBlockNumber(homeWeb3)
          }
          const blockConfirmations = latestBlockNumber - res.blockNumber
          if (blockConfirmations >= requiredConfirmations) {
            setLoadingText('Validators Verifying Transaction...')
            if (networkID === 42) {
              addWaitingForConfirmation(hash, homeInstance.homeBridgeContractInstance, homeWeb3, setOpenMessage, setMessage)
            } else {
              addWaitingForConfirmation(hash, instance.foreignBridgeContractInstance, foreignWeb3, setOpenMessage, setMessage)
            }
          } else {
            getTxStatus(hash, requiredConfirmations)
          }
        } else {
          setLoading(false)
          setError(`${ hash } Mined but with errors. Perhaps out of gas`)
        }
      } else {
        getTxStatus(hash, requiredConfirmations)
      }
    })
  }

  const getTxReceipt = (hash, requiredConfirmations) => {
    window.web3.eth.getTransaction(hash, (e, res) => {
      if (res && res.blockNumber) {
        getTxStatus(hash, requiredConfirmations)
      } else {
        console.log('not mined yet', hash)
        setTimeout(() => {
          getTxReceipt(hash, requiredConfirmations)
        }, 5000)
      }
    })
  }

  const doSend = async ({
    to, from, value, data, contract,
  }) => {
    try {
      const requiredConfirmations = await getblockConfirmations(contract, networkID === 42 ? homeWeb3 : foreignWeb3, networkID)
      const gasPrice = await gasPriceInHex()
      const gas = await estimateGas(to, gasPrice, from, value, data)
      return window.web3.eth
        .sendTransaction({
          to,
          gasPrice,
          gas,
          from,
          value,
          data,
          chainId: networkID,
        })
        .on('transactionHash', (hash) => {
          console.log('txHash', hash)
          setLoadingText('Waiting for Block Confirmations...');
          getTxReceipt(hash, requiredConfirmations)
        })
        .on('error', (e) => {
          if (
            !e.message.includes('not mined within 50 blocks')
            && !e.message.includes('Failed to subscribe to new newBlockHeaders')
          ) {
            setLoading(false)
            setError('Transaction rejected on wallet')
          }
        })
    } catch (e) {
      console.log(e.message);
      return 0;
    }
  }

  const erc20transfer = async ({
    to, from, value, contract,
  }) => {
    try {
      const data = await contract.methods
        .transfer(to, value)
        .encodeABI({ from: address })
      return doSend({
        to: contractAddresses.tkn,
        from,
        value: '0x',
        data,
        contract: homeInstance.erc677HomeBridgeTokenContractInstance,
      })
    } catch (e) {
      console.log('Erc20 transfer: ', e);
      return 0;
    }
  }

  const erc677transferAndCall = async ({
    to, from, value, contract,
  }) => {
    try {
      const data = await contract.methods
        .transferAndCall(to, value, '0x')
        .encodeABI()

      return doSend({
        to: contractAddresses.bscTKN,
        from,
        value: '0x00',
        data,
        contract: instance.foreignBridgeContractInstance,
      })
    } catch (e) {
      console.log('Erc677 transfer: ', e);
      return 0;
    }
  }

  const sendToForeign = async (amount) => {
    setLoadingText('Checking for sufficient Balance...');
    const decimals = await getDecimals(instance.erc677ForeignBridgeTokenContractInstance);
    const minPerTx = await getMinPerTxLimit(instance.foreignBridgeContractInstance, decimals);
    const maxPerTx = await getMaxPerTxLimit(instance.foreignBridgeContractInstance, decimals)
    const result = await getCurrentLimit(
      instance.foreignBridgeContractInstance,
      homeInstance.homeBridgeContractInstance,
      decimals,
    )
    const { maxCurrentDeposit } = result;
    const symbol = await getSymbol(instance.erc677ForeignBridgeTokenContractInstance);

    if (isLessThan(amount, minPerTx)) {
      setError(
        `The amount is less than minimum amount per transaction.\nThe min per transaction is: ${
          minPerTx
        } ${ symbol }`,
      )
      setOpenal(true)
      return
    } if (isGreaterThan(amount, maxPerTx)) {
      setError(
        `The amount is above maximum amount per transaction.\nThe max per transaction is: ${ maxPerTx } ${
          symbol
        }`,
      )
      setOpenal(true)
      return
    } if (isGreaterThan(amount, maxCurrentDeposit)) {
      setError(
        `The amount is above current daily limit.\nThe max withdrawal today: ${ maxCurrentDeposit } ${
          symbol
        }`,
      )
      setOpenal(true)
      return
    } if (isGreaterThan(amount, balance)) {
      setError(`Insufficient token balance. Your balance is ${ balance } ${ symbol }`)
      setOpenal(true)
    } else {
      try {
        setLoadingText('Loading')
        const value = await erc20transfer({
          to: contractAddresses.foreignBridge,
          from: address,
          value: toDecimals(amount, decimals),
          contract: instance.erc677ForeignBridgeTokenContractInstance,
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  const sendToHome = async (amount) => {
    setLoadingText('Checking for sufficient Balance...');
    const decimals = await getDecimals(homeInstance.erc677HomeBridgeTokenContractInstance);
    const minPerTx = await getMinPerTxLimit(homeInstance.homeBridgeContractInstance, decimals);
    const maxPerTx = await getMaxPerTxLimit(homeInstance.homeBridgeContractInstance, decimals)
    const result = await getCurrentLimit(
      homeInstance.homeBridgeContractInstance,
      instance.foreignBridgeContractInstance,
      decimals,
    )
    const { maxCurrentDeposit } = result;
    const symbol = await getSymbol(homeInstance.erc677HomeBridgeTokenContractInstance);

    if (isLessThan(amount, minPerTx)) {
      setError(
        `The amount is less than minimum amount per transaction.\nThe min per transaction is: ${
          minPerTx
        } ${ symbol }`,
      )
      setOpenal(true)
      return
    } if (isGreaterThan(amount, maxPerTx)) {
      setError(
        `The amount is above maximum amount per transaction.\nThe max per transaction is: ${ maxPerTx } ${
          symbol
        }`,
      )
      setOpenal(true)
      return
    } if (isGreaterThan(amount, maxCurrentDeposit)) {
      setError(
        `The amount is above current daily limit.\nThe max withdrawal today: ${ maxCurrentDeposit } ${
          symbol
        }`,
      )
      setOpenal(true)
      return
    } if (isGreaterThan(amount, balance)) {
      setError(`Insufficient token balance. Your balance is ${ balance } ${ symbol }`)
      setOpenal(true)
    } else {
      try {
        setLoadingText('Loading')
        await erc677transferAndCall({
          to: contractAddresses.homeBridge,
          from: address,
          value: toDecimals(amount, decimals),
          contract: homeInstance.erc677HomeBridgeTokenContractInstance,
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  const onTransferConfirmation = async () => {
    try {
      setOpen(false);
      setLoading(true);
      if (networkID === 42) { await sendToForeign(fromAmount); } else { await sendToHome(fromAmount); }
    } catch (e) {
      console.log('On Confrimation ', e);
    }
  }

  const loadForeignDetails = async () => {
    const data = {
      isHome: false,
      networkName: 'Kovan',
      url: 'https://kovan.infura.io/v3',
      address: contractAddresses.foreignBridge,
      currency: 'TKN',
      maxCurrentLimit: foreign.maxCurrentLimit,
      maxPerTx: foreign.maxPerTx,
      minPerTx: foreign.minPerTx,
      tokenAddress: contractAddresses.tkn,
      tokenName: 'Token',
      totalSupply: foreign.totalSupply,
      balance: foreign.balance,
      displayTokenAddress: true,
      displayBridgeLimits: false,
      addressUrl: URLs.UI_FOREIGN_EXPLORER_ADDRESS_TEMPLATE,
    }
    setModalData(data);
    setShowModal(true);
  }

  const loadHomeDetails = async () => {
    const data = {
      isHome: true,
      networkName: 'BSC TKN',
      url: COMMON_HOME_RPC_URL,
      address: contractAddresses.homeBridge,
      currency: 'BTKN',
      maxCurrentLimit: home.maxCurrentLimit,
      maxPerTx: home.maxPerTx,
      minPerTx: home.minPerTx,
      totalBalance: home.totalSupply,
      balance: home.balance,
      displayTokenAddress: true,
      tokenAddress: contractAddresses.bscTKN,
      tokenName: 'Binance Pegged Token',
      displayBridgeLimits: true,
      nativeSupplyTitle: false,
      addressUrl: URLs.UI_HOME_EXPLORER_ADDRESS_TEMPLATE,
    }
    setModalData(data);
    setShowModal(true);
  }

  return (
    <>
      <Grid style={ { display: 'flex' } }>
        <Grid item xs>
          <Typography className={ classes.typography }>
            {confirmationData.from}
          </Typography>
          <br />
          <Typography className={ classes.labelText }>
            Balance:
            {' '}
            <span style={ { color: '#68dbda' } }>
              {balance}
              {' '}
              {confirmationData.fromCurrency}
              {' '}
            </span>
          </Typography>
          <br />
          <Box style={ { display: 'flex', cursor: 'pointer' } } onClick={ () => (confirmationData.from === 'Kovan' ? loadForeignDetails() : loadHomeDetails()) }>
            <InfoOutlinedIcon style={ { color: '#68dbda' } } />
          &nbsp;&nbsp;
            <Typography className={ classes.labelText } style={ { color: '#68dbda' } }>
              Show More
            </Typography>
          </Box>
        </Grid>
        <Grid item xs>
          <Box display="flex" paddingX="12px" paddingTop="9px" className={ classes.box }>
            <Grid item xs={ 8 }>
              <InputBase
                value={ fromAmount }
                type="number"
                size="small"
                placeholder={ 0 }
                className={ classes.input }
                onChange={ (event) => onInputChange(event) }
              />
            </Grid>
            <Grid item xs={ 4 }>
              <Button
                size="small"
                className={ classes.maxButton }
                variant="outlined"
                onClick={ (event) => transfer(event) }
              >
                Transfer
              </Button>
            </Grid>
          </Box>
          <Typography className={ classes.errorText }>{errorText}</Typography>
          <Typography className={ classes.belowText }>
            {fromAmount || 0}
            {' '}
            {confirmationData.fromCurrency}
            {' '}
            {'->'}
            {' '}
            {fromAmount || 0}
            {' '}
            {confirmationData.toCurrency}
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography className={ classes.typography } style={ { textAlign: 'end' } }>
            {confirmationData.to}
          </Typography>
          <br />
          <Typography className={ classes.labelText } style={ { textAlign: 'end' } }>
            Balance:
            {' '}
            <span style={ { color: '#68dbda' } }>
              {homeBalance}
              {' '}
              {confirmationData.toCurrency}
              {' '}
            </span>
          </Typography>
          <br />
          <Box style={ { display: 'flex', float: 'right', cursor: 'pointer' } } onClick={ () => (confirmationData.to === 'Kovan' ? loadForeignDetails() : loadHomeDetails()) }>
            <Typography className={ classes.labelText } style={ { textAlign: 'end', color: '#68dbda' } }>
              Show More
            </Typography>
          &nbsp;&nbsp;
            <InfoOutlinedIcon style={ { color: '#68dbda' } } />
          </Box>
        </Grid>
      </Grid>
      {open && (
      <PopupDialog
        handleConfirmClick={ () => onTransferConfirmation() }
        handleClose={ () => setOpen(false) }
        open={ open }
        // eslint-disable-next-line react/jsx-props-no-spreading
        { ...confirmationData }
      />
      )}
      <ModalContainer { ...modalData } open={ showModal } onClose={ () => setShowModal(false) } />
      <AlertModal message={ error } onClose={ () => { setOpenal(false); setLoading(false) } } open={ openal } />
      {openMessage && <SuccessModal id={ networkID } message={ message } onClose={ () => { setOpenMessage(false); setLoading(false); getCardBalances(); } } open /> }
    </>
  )
}

const mapStateToProps = (state) => ({
  home: state.user.home,
  foreign: state.user.foreign,
});

export default connect(mapStateToProps, { updateHomeBalance, updateForeignBalance })(DetailForm)
