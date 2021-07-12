/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button, Typography } from '@material-ui/core';
import { createAction } from '@reduxjs/toolkit';
import { makeStyles } from '@material-ui/core/styles';

const connectWallet = createAction('CONNECT_WALLET')

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.dropdown.backgroundColor,
    padding: 24,
    display: 'grid',
    width: '341px',
    height: '290px',
  },
  walletButton: {
    marginTop: 16,
    fontSize: '14px',
    marginLeft: 'auto',
    borderRadius: 0,
    width: '100%',
    padding: '7px 5px',
    background: '#3B3C51',
    border: '#3B3C51',
    color: theme.text,
    textTransform: 'none',
    '&:hover': {
      background: theme.grid.color,
      border: theme.grid.color,
      color: 'black',
    },
  },
  walletTypography: {
    color: 'white',
    textAlign: 'center',
    fontSize: '20px',
  },
}));

const WalletModal = ({ open, connectWallet }) => {
  const classes = useStyles()

  const handleClick = (wallet, network) => {
    connectWallet({ wallet, network })
  }

  return (
    <Modal
      className={ classes.modal }
      open={ open }
      closeAfterTransition
      BackdropComponent={ Backdrop }
      BackdropProps={ {
        timeout: 500,
      } }
    >
      <Fade in={ open }>
        <div className={ classes.paper }>
          <Typography className={ classes.walletTypography }>Please connect your wallet</Typography>
          <Button
            variant="outlined"
            size="small"
            className={ classes.walletButton }
            onClick={ () => handleClick('Metamask', null) }
          >
            Metamask
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={ classes.walletButton }
            onClick={ () => handleClick('Torus', 42) }
          >
            Torus Wallet (Kovan)
          </Button>
        </div>
      </Fade>
    </Modal>
  );
}

export default connect(null, { connectWallet })(WalletModal);
