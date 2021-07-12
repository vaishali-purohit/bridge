/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import numeral from 'numeral';
import { Typography, makeStyles, withStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    paddingBottom: '0px',
  },
  textContainer: {
    margin: '24px 0px',
  },
  title: {
    color: theme.text,
    fontSize: '20px',
    lineHeight: '28px',
  },
  subTitle: {
    color: theme.secondaryText,
    fontSize: '14px',
  },
  plText: {
    color: theme.text,
    fontSize: '14px',
  },
  divider: {
    margin: '10px 0px',
    border: theme.borderAlt,
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
  },
  activeButton: {
    backgroundColor: theme.maxButton.color,
    color: theme.maxButton.activeColor,
  },
}))

const CustomDialog = withStyles({
  paper: {
    backgroundColor: '#2C2D3D',
    width: '341px',
  },
})(Dialog)

const PopupDialog = ({
  handleConfirmClick,
  handleClose,
  from,
  to,
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
  open,
}) => {
  const classes = useStyles()
  const formattedFromAmount = numeral(fromAmount).format('0,0[.][000000000000000000]', Math.floor)
  const formattedToAmount = numeral(toAmount).format('0,0[.][000000000000000000]', Math.floor)

  return (
    <CustomDialog
      open={ open }
      onClose={ handleClose }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div className={ classes.textContainer }>
            <Typography className={ classes.plText }>
              Please confirm that you would like to send
              {' '}
              {formattedFromAmount}
              {' '}
              {fromCurrency}
              {' '}
              from
              {' '}
              {from}
              {' '}
              to receive
              {' '}
              {formattedToAmount}
              {' '}
              {toCurrency}
              {' '}
              on
              {' '}
              {to}
              .
            </Typography>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={ classes.buttonContainer }>
        <Button className={ classes.maxButton } onClick={ handleClose } color="primary">
          Cancel
        </Button>
        <Button className={ `${ classes.maxButton } ${ classes.activeButton }` } onClick={ handleConfirmClick } color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </CustomDialog>
  );
}

export default PopupDialog
