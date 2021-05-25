import React from 'react';
import Box from '@material-ui/core/Box';
import FileCopy from '@material-ui/icons/FileCopy';

export const File = ({ name = '' }) => {
  return (
    <Box>
      {name ? (
        <Box display="flex" alignItems="center">
          <FileCopy fontSize="small" />
          {name}
        </Box>
      ) : 'N/A' }
    </Box>
  );
};
