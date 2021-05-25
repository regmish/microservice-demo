import { withStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';

export const VerticalStretchContent = withStyles(() => ({
  root: {
    width: '100%',
    flex: '1 1 auto',
    overflowY: 'auto',
    '& > *': {
      width: '100%',
    },
  },
}))(Box);
