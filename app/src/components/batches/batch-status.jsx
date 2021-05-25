import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import clsx from 'clsx';
import { capitalize, toLower } from 'lodash';
import Loading from '../common/loading';

const useStyles = makeStyles((theme) => ({
  status: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: theme.spacing(12),
    maxWidth: theme.spacing(12),
    textAlign: 'center',
    padding: theme.spacing(0.4, 2.5),
    margin: theme.spacing(1),
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 600,
  },
  disabled: {
    cursor: 'not-allowed',
  },
  processing: {
    background: theme.palette.status.inactive,
    color: 'inherit',
  },
  hold: {
    background: theme.palette.warning.main,
  },
  pending: {
    background: theme.palette.status.pending,
  },
  ready: {
    background: theme.palette.status.ready,
  },
  complete: {
    background: theme.palette.status.active,
  },
  shipped: {
    background: theme.palette.error.light,
  },
  archived: {
    background: theme.palette.status.archived,
  },
}));

export const BatchStatus = ({ loading, status, selected = false, setSelected = () => {} }) => {
  const classes = useStyles();

  return (
    <Box>
      {!loading ? (
        <Box className={clsx(classes.status, classes[toLower(status)])} onClick={() => setSelected(!selected)}>
          {capitalize(status)}
          <Box position="absolute" right="4px">
            {selected && <Done fontSize="small" />}
          </Box>
        </Box>
      ) : (
        <Loading contained size={20} />
      )}
    </Box>
  );
};
