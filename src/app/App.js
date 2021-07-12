/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  makeStyles, Backdrop, Paper, Grid, Container, Typography,
} from '@material-ui/core';
import AppHeader from './AppHeader';
import DetailForm from '../container/DetailForm';
import WalletModal from '../component/WalletModal';
import Loader from '../assets/loadingIconWhite.bin';
import Refresh from '../assets/loader.svg';
import { networks } from '../constants';

const useStyles = makeStyles((theme) => ({
  content: {
    position: 'relative',
    zIndex: 10,
    gridGap: '50px',
    marginBottom: '2%',
    padding: 0,
  },
  paper: {
    ...theme.card,
    padding: theme.spacing(4, 3),
  },
  typography: {
    color: theme.secondaryText,
    textAlign: 'center',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  title: {
    color: theme.text,
    fontSize: 24,
  },
  gridStyle: {
    textAlign: 'center',
  },
  addressBox: {
    ...theme.card,
    padding: '0 12px',
    float: 'right',
    textAlign: 'center',
    color: 'white',
    '& .MuiFormControl-root': {
      '& .MuiInput-underline:before': {
        borderBottom: 'none',
      },
      '& .MuiInput-underline:after': {
        borderBottom: 'none',
      },
    },
  },
  flexDiv: {
    display: 'flex',
    margin: '64px 0 24px',
  },
}));

const App = (props) => {
  const classes = useStyles();
  const [ open, setOpen ] = useState(true);
  const [ loadingText, setLoadingText ] = useState('Loading');
  const [ loading, setLoading ] = useState(false);
  const [ openMessage, setOpenMessage ] = useState(false);
  const [ message, setMessage ] = useState('');

  useEffect(() => {
    if (props.user.address) setOpen(false);
  }, [ props.user.address ])

  const renderLoadingBackdrop = () => (
    <Backdrop className={ classes.backdrop } open={ loading }>
      <Grid className={ classes.gridStyle }>
        <img src={ Loader } alt="lock" width="20%" />
        <Typography
          className={ classes.typographyBackdropLoading }
        >
          {loadingText}
        </Typography>
      </Grid>
    </Backdrop>
  );

  return (
    <>
      <Backdrop
        className={ classes.backdrop }
        open={ props.user.isLoading }
      >
        <Grid style={ { textAlign: 'center' } }>
          <img src={ Loader } alt="lock" width="20%" />
          <Typography className={ classes.typography } style={ { textAlign: 'center' } }>{props.user.loadingMessage}</Typography>
        </Grid>
      </Backdrop>
      {props.user.address && (
        <Backdrop className={ classes.backdrop } open={ !networks[ props.networkID ] }>
          <Grid style={ { textAlign: 'center' } }>
            <img src={ Refresh } alt="lock" width="20%" />
            <Typography className={ classes.typography }>Please attach Wallet and connect to the Kovan or BSC testnet network.</Typography>
          </Grid>
        </Backdrop>
      )}
      {loading && renderLoadingBackdrop()}
      <WalletModal open={ open } />
      <AppHeader address={ props.user.address } id={ props.networkID } />
      <Container className={ `${ classes.content } content` }>
        <div className={ classes.flexDiv }>
          <Grid item md={ 6 }>
            <Typography className={ classes.title }>Bridge</Typography>
          </Grid>
        </div>
        <br />
        <Grid xs={ 12 } className={ classes.grid }>
          <Paper className={ classes.paper }>
            <DetailForm
              setLoading={ setLoading }
              setLoadingText={ setLoadingText }
              networkID={ props.networkID }
              address={ props.user.address }
              foreignWeb3={ props.foreignWeb3 }
              homeWeb3={ props.homeWeb3 }
              openMessage={ openMessage }
              setOpenMessage={ setOpenMessage }
              setMessage={ setMessage }
              message={ message }
            />
          </Paper>
        </Grid>
      </Container>
      <div id="background" />
    </>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  network: state.user.network,
  networkID: state.user.networkID,
  foreignWeb3: state.metamask.foreignWeb3,
  homeWeb3: state.metamask.homeWeb3,
});

export default connect(mapStateToProps, null)(App)
