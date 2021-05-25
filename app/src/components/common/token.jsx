import React from 'react';
import Chip from '@material-ui/core/Chip';

export const TokenComponent = ({ title }) => {
  return (
    <Chip variant="outlined" size="medium" label={title} color="primary" />
  );
};
