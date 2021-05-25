import React from 'react';
import { Box, Button, Divider, Typography } from '@material-ui/core';

export const FlagConfirm = ({ item, onConfirm, onCancel }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Box pb={1}>
        <Typography variant="h6">
          {item.flagged ? 'Unflag Item ?' : 'Flag Item ?'}
        </Typography>
      </Box>
      <Divider />
      <Box py={1} display="flex" alignItems="center" flexWrap="wrap">
        {item.flagged ? (
          <Typography variant="body1">{`Are you sure you want to UNFLAG ${item.name} ?`}</Typography>
        ) : (
          <Typography variant="body1">{`Are you sure you want to FLAG ${item.name} ?`}</Typography>
        )}
      </Box>
      <Divider />
      <Box display="flex" justifyContent="flex-end" py={1}>
        <Box px={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={onCancel}
            color="primary"
          >
            Cancel
          </Button>
        </Box>
        <Box px={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              onConfirm(true);
            }}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
