import React from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles(theme => ({
  root: {
    flex: '1 0 0px',
    boxShadow: `0px 0px 4px ${theme.palette.shadow.cardBorder}`,
    borderRadius: 6,
    border: `1px solid ${theme.palette.border.card}`,
    margin: theme.spacing(0, 2)
  },
  header: {
    padding: theme.spacing(1.5, 2.5),
    borderBottom: `1px solid ${theme.palette.border.input}`,
  },
  arrow: {
    padding: theme.spacing(1),
    color: theme.palette.secondary.main
  },
  body: {
    padding: theme.spacing(1.5, 2.5),
  },
}));

export const OverviewCard = ({ title, link, children }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" color="secondary">{title}</Typography>
          <IconButton className={classes.arrow} onClick={() => history.push(link)}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
      <Box className={classes.body}>
        {children}
      </Box>
    </Box>
  );
};
