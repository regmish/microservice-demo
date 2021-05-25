import React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Header } from '../../components';

const PageTitle = {
};

const useStyles = makeStyles((theme) => ({
  main: {
    flexGrow: 1,
    overflowY: 'auto',
  },
  container: {
    flex: '1 1 auto',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
}));

export const Layout = ({ children }) => {
  const classes = useStyles();
  const location = useLocation();
  const pathname = location.pathname.replace(/^\//, '');

  return (
    <Box display="flex" height="100vh">
      <main className={classes.main}>
        <Box display="flex" flexDirection="column" width="100%" height="100%">
          <Header pageTitle={PageTitle[pathname] || 'Dashboard'} />
          <Box className={classes.container}>{children}</Box>
        </Box>
      </main>
    </Box>
  );
};
