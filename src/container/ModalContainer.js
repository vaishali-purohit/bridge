/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {
  Dialog, makeStyles, withStyles,
} from '@material-ui/core';
import NetworkDetails from '../component/NetworkDetails';

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

const CustomDialog = withStyles({
  paper: {
    backgroundColor: '#2C2D3D',
    width: '570px',
    color: 'white',
  },
})(Dialog)

const ModalContainer = (props) => {
  const classes = useStyles()

  return (
    <CustomDialog
      onClose={ props.onClose }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      open={ props.open }
    >
      <MuiDialogTitle disableTypography className={ classes.root }>
        <Typography variant="h6">{props.networkName}</Typography>
        {props.onClose ? (
          <IconButton aria-label="close" className={ classes.closeButton } onClick={ props.onClose }>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
      <NetworkDetails { ...props } />
    </CustomDialog>
  )
}

export default ModalContainer;
