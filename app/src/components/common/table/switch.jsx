import React from 'react';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import makeStyles from '@material-ui/core/styles/makeStyles';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  switch: {
    width: '15px',
    height: '15px',
    borderRadius: '50%'
  },
  on: {
    backgroundColor: theme.palette.primary.main
  },
  off: {
    backgroundColor: theme.palette.status.inactive
  }
}));
const truthy = [
  true,
  'true',
  'True',
  'TRUE',
  'ON',
  'on',
  'active',
  'enabled'
];
export const Switch = ({ state, activeText = 'Active', deactiveText = 'Deactivated' }) => {
  const classes = useStyles();
  const status = truthy.includes(state);

  return (
    <Tooltip title={status ? activeText: deactiveText }>
      <Box className={clsx(classes.switch, { [classes.on]: status }, { [classes.off]: !status })} />
    </Tooltip>
  )
}
