/* eslint-disable react/prop-types */
import React from 'react';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Dialog, makeStyles, withStyles } from '@material-ui/core';
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

const AlertModal = (props) => {
  const {
    message, onClose, open,
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
        <Typography variant="h6" style={ { color: 'red' } }>Error</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={ classes.closeButton } onClick={ onClose }>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {message}
        </Typography>
      </DialogContent>
    </CustomDialog>
  );
}

export default AlertModal;
