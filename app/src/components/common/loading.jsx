import React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import clsx from 'clsx';

const styles = theme => ({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  progressContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  contained: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  progress: {
    margin: theme.spacing(2),
  },
});

const LoadingComponent = ({ classes = undefined, size = 55, backgroundColor = 'rgba(255,255,255,0.7)', color = undefined, timeout = 300, className = undefined, contained = false }) => {
  const spinner = (
    <Fade in timeout={timeout}>
      <div className={clsx(classes.loadingContainer, className && className)} style={{ backgroundColor }}>
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} color={color} size={size} disableShrink />
        </div>
      </div>
    </Fade>
  );
  return contained ? (
    <div className={classes.contained}>{spinner}</div>
  ) : spinner;
};

 export const Loading = withTheme(withStyles(styles)(LoadingComponent));
