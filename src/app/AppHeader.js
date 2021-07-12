/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import {
  Container, Grid, Typography, Tooltip,
} from '@material-ui/core';
import CopyToClipboard from 'react-copy-to-clipboard';
import { makeStyles } from '@material-ui/core/styles';
import { networks } from '../constants';

const useStyles = makeStyles((theme) => ({
  logo: {
    marginTop: 8,
  },
  grid: {
    display: 'flex',
    padding: '18px 0',
    alignItems: 'center',
  },
  header: {
    backgroundColor: theme.inputColor,
    position: 'relative',
    zIndex: 999,
    padding: 0,
  },
  addressBox: {
    width: '228px',
    float: 'right',
    textAlign: 'end',
    color: '#5643CC',
  },
  addressText: {
    padding: '5px 0',
  },
  versionText: {
    paddingRight: '20px',
    color: '#9A8EE0',
  },
  networkPaper: {
    borderRadius: '4px',
    backgroundColor: '#2FD593',
    color: 'white',
    textTransform: 'uppercase',
    padding: '0 12px',
    float: 'right',
    textAlign: 'center',
    '& .MuiFormControl-root': {
      '& .MuiInput-underline:before': {
        borderBottom: 'none',
      },
    },
  },
  networkText: {
    padding: '4px 15px',
  },
  flexDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
}));

const AppHeader = ({ address, id }) => {
  const classes = useStyles();
  const [ copied, setCopied ] = useState(false);

  const onCopy = () => {
    if (!copied) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  };

  const formatAddress = () => {
    if (!address) {
      return '...';
    }

    const l = address.length;
    return (
      <CopyToClipboard text={ address } onCopy={ onCopy }>
        <Tooltip title={ copied ? 'Copied!' : 'Click to copy' }>
          <Typography className={ classes.accountNumberText }>
            {address.slice(0, 9)}
            ...
            {address.slice(l - 10, l)}
          </Typography>
        </Tooltip>
      </CopyToClipboard>
    );
  };

  return (
    <div className={ classes.header }>
      <Container style={ { padding: 0 } }>
        <Grid className={ classes.grid }>
          <Grid item xs={ 2 } className={ classes.networkPaper }>
            <Typography className={ classes.networkText }>
              {networks[ id ] || '........'}
            </Typography>
          </Grid>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Grid item xs={ 10 } className={ classes.addressBox }>
            <Typography className={ classes.addressText }>
              {formatAddress()}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AppHeader;
