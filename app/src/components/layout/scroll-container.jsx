import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  bodyContainer: {
    height: '100%',
    flex: '1 1 auto',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  footerContainer: {
    flex: '0 0 auto',
  },
}));

export const ScrollContainer = ({ header, body, footer }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} >
      {/** Header Container */}
      {header && header}

      {/** Body Container */}
      <div className={classes.bodyContainer}>{body}</div>

      {/** Footer Container */}
      {footer && <div className={classes.footerContainer}>{footer}</div>}
    </div>
  );
};
