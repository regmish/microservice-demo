import React from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SuccessIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/HighlightOff';
import ErrorIcon from  '@material-ui/icons/ErrorOutline';
import { withToast } from '../../../providers';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px 4px 12px 8px',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 500,

  },
  success: {
    backgroundColor: theme.palette.status.active
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  }
}));

const Toast = ({
  isOpen,
  hideToast,
  status = 'success',
  message
}) => {
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    hideToast();
  };

  return ReactDOM.createPortal(
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={6000}
      open={isOpen}
      onClose={handleClose}
    >
      <Box className={clsx(classes.container, classes[status])}>
        <Box pr={2}>
          { status === 'success' ? <SuccessIcon fontSize="small" /> : <ErrorIcon fontSize="small" />}
        </Box>
        <Box fontWeight="500"> { message } </Box>
        <Box pl={2} cursor="pointer">
          <IconButton size="small" onClick={hideToast}>
            <CloseIcon fontSize="small" htmlColor="#fff" />
          </IconButton>
        </Box>
      </Box>
    </Snackbar>,
    document.body
  );
};

const enhanced = withToast(Toast);

export { enhanced as Toast };
