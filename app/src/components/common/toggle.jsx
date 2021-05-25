import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiSwitch from '@material-ui/core/Switch';

const Switch = withStyles((theme) => ({
  root: {
    width: 45,
    height: 25,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(20px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: theme.palette.status.active,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: theme.palette.status.active,
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 23,
    height: 23,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.common.grey11,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <MuiSwitch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

export const Toggle = React.forwardRef((props, ref) => <div ref={ref}> <Switch {...props} /></div>);
