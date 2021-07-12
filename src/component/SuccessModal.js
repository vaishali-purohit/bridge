/* eslint-disable react/prop-types */
import React from 'react';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Dialog, makeStyles, withStyles } from '@material-ui/core';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { UI_HOME_NETWORK_DISPLAY_NAME } from '../constants';

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
}));

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const CustomDialog = withStyles({
  paper: {
    backgroundColor: '#2C2D3D',
    width: '341px',
    color: 'white',
  },
})(Dialog)

const SuccessModal = (props) => {
  const {
    message, onClose, open, id,
  } = props;
  const classes = useStyles()

  return (
    <CustomDialog
      onClose={ onClose }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      open={ open }
    >
      <MuiDialogTitle disableTypography className={ classes.root }>
        <Typography variant="h6" style={ { color: '#2FD593' } }>Success</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={ classes.closeButton } onClick={ onClose }>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Tokens received on
          {' '}
          { UI_HOME_NETWORK_DISPLAY_NAME }
          {' '}
          on Tx
          {' '}
          {id === 42
            ? (
              <a
                href={ `https://testnet.bscscan.com/tx/${ message }` }
                target="blank"
                className={ classes.link }
              >
                { message }
              </a>
            ) : (
              <a
                href={ `https://kovan.etherscan.io/tx/${ message }` }
                target="blank"
                className={ classes.link }
              >
                { message }
              </a>
            )}
        </Typography>
      </DialogContent>
      <DialogActions className={ classes.buttonContainer }>
        <Button className={ classes.maxButton } onClick={ onClose } color="primary">
          Ok
        </Button>
      </DialogActions>
    </CustomDialog>
  );
}

export default SuccessModal;
