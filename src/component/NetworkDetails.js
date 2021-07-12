/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
import React from 'react';
import numeral from 'numeral';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles, withStyles, Grid,
} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import MuiDialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[ 500 ],
  },
  buttonContainer: {
    margin: '24px 20px',
    marginTop: '2px',
    padding: '0px',
  },
  maxButton: {
    flex: 'auto',
    fontSize: '14px',
    border: theme.borderAlt,
    borderRadius: '0px',
    color: theme.text,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#2FD593',
      color: 'white',
    },
  },
  link: {
    color: '#2FD593',
    textDecoration: 'none',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  flexDiv: {
    display: 'flex',
    lineHeight: '28px',
  },
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const NetworkDetails = ({
  isHome,
  url,
  address,
  currency,
  maxCurrentLimit,
  maxPerTx,
  minPerTx,
  tokenAddress,
  totalSupply,
  totalBalance,
  balance,
  displayTokenAddress,
  displayBridgeLimits,
  nativeSupplyTitle,
  tokenName,
  addressUrl,
}) => {
  const classes = useStyles()
  const networkTitle = isHome ? 'Bridge Home' : 'Bridge Foreign'
  const totalTitle = isHome && !displayTokenAddress
    ? nativeSupplyTitle
      ? 'Native Coins Amount'
      : 'Totally minted by the bridge'
    : `${ currency } Tokens Amount`
  const totalAmount = isHome ? totalBalance : totalSupply
  const formattedBalance = isNaN(numeral(balance).format('0.00', Math.floor))
    ? numeral(0).format('0,0.00', Math.floor)
    : numeral(balance).format('0,0.000', Math.floor)

  return (
    <DialogContent dividers>
      <Grid>
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 4 }>
            <Typography>Network</Typography>
          </Grid>
          <Grid item xs={ 8 } style={ { textAlign: 'end', color: '#2FD593' } }>
            <Typography>{url}</Typography>
          </Grid>
        </Grid>
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>
            {networkTitle}
            {' '}
            Address
          </Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            <a
              href={ `${ addressUrl }/${ address }` }
              target="_blank"
              rel="noopener noreferrer"
              className={ classes.link }
            >
              {address.slice(0, 27).concat('...')}
            </a>
            <CopyToClipboard text={ address }>
              <span className="copy-icon copy-icon-right">
                <FileCopyOutlinedIcon style={ { color: '#2FD593', fontSize: 14 } } />
              </span>
            </CopyToClipboard>
          </Grid>
        </Grid>
        {displayBridgeLimits && (
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>
            Remaining Daily
            {' '}
            {currency}
            {' '}
            Quota
          </Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            {numeral(maxCurrentLimit).format('0,0.0', Math.floor)}
            <span className="details-description-currency-core">{` ${ currency }`}</span>
          </Grid>
        </Grid>
        )}
        {displayBridgeLimits && (
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>Maximum Amount Per Transaction</Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            {numeral(maxPerTx).format('0,0.0', Math.floor)}
            <span className="details-description-currency-core">{` ${ currency }`}</span>
          </Grid>
        </Grid>
        )}
        {displayBridgeLimits && (
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>Minimum Amount Per Transaction</Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            {numeral(minPerTx).format('0,0.000', Math.floor)}
            <span className="details-description-currency-core">{` ${ currency }`}</span>
          </Grid>
        </Grid>
        )}
        {displayTokenAddress && (
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>Token Address</Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            <a
              href={ `${ addressUrl }/${ tokenAddress }` }
              target="_blank"
              rel="noopener noreferrer"
              className={ classes.link }
            >
              {tokenAddress.slice(0, 27).concat('...')}
            </a>
            <CopyToClipboard text={ tokenAddress }>
              <span className="copy-icon copy-icon-right">
                <FileCopyOutlinedIcon style={ { color: '#2FD593', fontSize: 14 } } />
              </span>
            </CopyToClipboard>
          </Grid>
        </Grid>
        )}
        {displayTokenAddress && (
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>Token Name</Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            {tokenName || 'No token name'}
          </Grid>
        </Grid>
        )}
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>{totalTitle}</Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            {numeral(totalAmount).format('0,0.000', Math.floor)}
            <span className="details-description-currency-core">{` ${ currency }`}</span>
          </Grid>
        </Grid>
        <Grid className={ classes.flexDiv }>
          <Grid item xs={ 6 }>
            Your
            {' '}
            {currency}
            {' '}
            Balance
          </Grid>
          <Grid item xs={ 6 } style={ { textAlign: 'end' } }>
            {formattedBalance}
            <span className="details-description-currency-core">{` ${ currency }`}</span>
          </Grid>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

export default NetworkDetails;
