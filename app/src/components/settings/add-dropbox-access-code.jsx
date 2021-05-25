import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Loading from '../common/loading';

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export const AddDropboxAccessCodeDialog = ({ title = '', onConfirm, onCancel }) => {
  const classes = useStyles();
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setAccessCode(event.target.value);

  return (
    <Box display="flex" flexDirection="column">
      <Box py={1}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider />
      <Box py={3}>
        <Paper component="div" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Paste Dropbox Access Code here..."
            value={accessCode}
            onChange={handleChange}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleChange(event);
              }
            }}
          />
          {loading && <Loading contained size={25} />}
        </Paper>
      </Box>
      <Box display="flex" justifyContent="flex-end" py={1}>
        <Box px={1}>
          <Button
            variant="outlined"
            onClick={onCancel}
            color="primary"
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
        <Box px={1}>
          <Button
            variant="contained"
            onClick={() => {
              setLoading(true);
              onConfirm(accessCode).then(() => {
                setLoading(false);
                onCancel();
              })
            }}
            color="primary"
            disabled={!accessCode || !accessCode.length || loading}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
