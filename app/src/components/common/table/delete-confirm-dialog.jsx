import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

export const DeleteConfirmDialog = ({
  content,
  onConfirm,
  onCancel
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box py={1}>
        <Typography variant="h6">Delete ?</Typography>
      </Box>
      <Divider />

      <Box py={3}>
        <Typography variant="body1">{content}</Typography>
      </Box>
      <Divider />

      <Box display="flex" justifyContent="flex-end" py={1}>
        <Box px={1}>
          <Button variant="outlined" onClick={onCancel} color="primary">Cancel</Button>
        </Box>
        <Box px={1}>
          <Button variant="contained" onClick={onConfirm} color="primary">Confirm</Button>
        </Box>
      </Box>

    </Box>
  );
};
