import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiPaper-rounded': {
      borderRadius: theme.spacing(1.5),
    },
  },
  noPadding: {
    '& .MuiPaper-root': {
      '& .MuiDialogContent-root': {
        padding: '0',
      },
    },
  },
}));

export const ModalContainer = ({
  open,
  onClose,
  noPadding = false,
  className = undefined,
  children,
  closeOnClickAway = true,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Dialog
      onBackdropClick={() => {
        if (closeOnClickAway) {
          onClose();
        }
      }}
      className={clsx(classes.root, { [classes.noPadding]: noPadding }, className)}
      scroll="paper"
      open={open}
      fullWidth
      {...props}
    >
      {children}
    </Dialog>
  );
};
