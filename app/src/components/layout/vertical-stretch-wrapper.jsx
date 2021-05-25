import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
});

export const VerticalStretchWrapper = ({ children, ...props }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root} {...props}>
      {children}
    </Box>
  );
};
