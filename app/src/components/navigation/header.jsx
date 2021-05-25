import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { ProfilePopper } from './profile-popper';
import { useAuthData } from '../../hooks';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
}));

const NavBar = withStyles((theme) => ({
  root: {
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.border.card}`,
  },
}))(AppBar);

export const Header = ({ pageTitle }) => {
  const classes = useStyles();
  const { user = {} } = useAuthData();
  const initials =
    user.firstName && user.lastName && user.firstName[0] + user.lastName[0];
  return (
    <NavBar position="static" color="transparent">
      <Toolbar>
        <h1 className={classes.title}>{pageTitle}</h1>
        <ProfilePopper initials={initials} />
      </Toolbar>
    </NavBar>
  );
};
