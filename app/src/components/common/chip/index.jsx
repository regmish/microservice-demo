import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';


export const OutlinedChips = ({ label, hasCollide }) => {
  const collisionStyle = { border: '2px solid rgba(220, 0, 78, 0.7)', color: 'rgba(220, 0, 78, 0.7)' };
  const defaultStyle = {};
  return (
    <Tooltip title={hasCollide ? "Warning !!!.. Duplicate Channels Please remove this Production Group or update channels" : ""}>
      <Chip
        size="small"
        avatar={<Avatar>{label.charAt(0)}</Avatar>}
        label={label}
        variant="outlined"
        style={hasCollide ? collisionStyle: defaultStyle}
      />
    </Tooltip>
  );
}
