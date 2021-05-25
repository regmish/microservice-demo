import React, { forwardRef } from 'react';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    overflow: 'hidden',
    height: '100%',
    width: (props) => props.width,
  },
}));

export const PopperPaper = forwardRef(
  ({ width, children, className, ...props }, ref) => {
    const classes = useStyles({ width });

    return (
      <Paper ref={ref} className={clsx(classes.root, className)} {...props}>
        {children}
      </Paper>
    );
  },
);
