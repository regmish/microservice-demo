import React from 'react';
import { Box, lighten, makeStyles } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import clsx from 'clsx';
import { capitalize, toLower } from 'lodash';

const useStyles = makeStyles((theme) => ({
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: theme.spacing(12),
    maxWidth: theme.spacing(12),
    textAlign: 'center',
    padding: theme.spacing(0.4, 2),
    margin: theme.spacing(1),
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
  },
  empty: {
    background: theme.palette.status.inactive,
    color: 'inherit',
  },
  hold: {
    background: theme.palette.warning.main,
  },
  flagged: {
    background: theme.palette.error.light,
  },
  partial: {
    background: lighten(theme.palette.status.pending, 0.5),
  },
  complete: {
    background: theme.palette.status.active,
  },
}));

export const BinStatus = ({ status = 'EMPTY', selected = false, setSelected = () => {} }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.status, classes[toLower(status)])} onClick={() => setSelected(!selected)}>
      {capitalize(status)}
      <Box position="absolute" right="4px">
        {selected && <Done fontSize="small" />}
      </Box>
    </Box>
  );
};
