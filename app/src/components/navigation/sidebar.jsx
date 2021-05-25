import React, { useState } from 'react';
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeIcon from '@material-ui/icons/HomeRounded';
import OrderIcon from '@material-ui/icons/ShoppingCartRounded';
import BatchIcon from '@material-ui/icons/StorageRounded';
import BinIcon from '@material-ui/icons/DeleteSweepRounded';
import UsersIcon from '@material-ui/icons/PeopleOutlineRounded';
import SettingIcon from '@material-ui/icons/TuneRounded';
import BatchSettingIcon from '@material-ui/icons/PermDataSettingRounded';
import MiscSettingIcon from '@material-ui/icons/BuildRounded';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';


const MenuItems = [{
  id: 'dashboard',
  title: 'Dashboard',
  icon: <HomeIcon />,
}, {
  id: 'orders',
  title: 'Orders',
  icon: <OrderIcon />
},{
  id: 'batches',
  title: 'Batches',
  icon: <BatchIcon />,
},{
  id: 'bins',
  title: 'Bins',
  icon: <BinIcon />,
},{
  id: 'users',
  title: 'Users',
  icon: <UsersIcon />
}, {
  id: 'settings',
  title: 'Settings',
  icon: <SettingIcon />,
  items: [
    {
      id: 'settings/batch',
      title: 'Batch Configuration',
      icon: <BatchSettingIcon />
    },
    {
      id: 'settings/misc',
      title: 'Misc',
      icon: <MiscSettingIcon />
    },
    {
      id: 'settings/hook',
      title: 'WebHook',
      icon: <DeviceHubIcon />
    }
  ]
}];

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: 260,
  },
  nestedListItem: {
    paddingLeft: '40px !important',
  },
  activeList: {
    backgroundColor: theme.palette.primary.main,
    '& .MuiTypography-root,.MuiListItemIcon-root': {
      color: theme.palette.text.contrastText,
    }
  },
}));

const StyledListItem = withStyles(theme => ({
  root: {
    padding: theme.spacing(1.5, 2.5, 1.5, 3),
    '& .MuiTypography-root': {
      fontWeight: 600,
    },
    '& .MuiListItemIcon-root': {
      minWidth: '45px',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiTypography-root,.MuiListItemIcon-root': {
        color: theme.palette.text.contrastText,
      }
    },
  },
}))(ListItem);
const stripSlash = str => str.replace(/^\//, '');

export const Sidebar = ({ isOpen }) => {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const strippedUrl = stripSlash(url);
  const strippedPathName = stripSlash(location.pathname) || 'dashboard';
  const [menuExpand, setMenuExpand] = useState({ [strippedUrl]: true });
  const toggleMenus = (id) => {
    setMenuExpand({
      [id]: !menuExpand[id]
    })
  };

  const changeRoute = (path) => {
    if (path === 'dashboard') return history.push('/');
    history.push(`/${path}`);
  };

  return (
    <nav>
      <Drawer
        variant={isOpen ? "persistent" : "temporary"}
        anchor="left"
        open={isOpen}
        classes={{
          root: classes.sidebar,
          paper: classes.sidebar
        }}
      >
        <Box px={1.5}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Qualtry App" style={{ width: 150 }} />
        </Box>
        <Divider />
        <Box mt={3}>
          <List
            component="nav"
          >
            {MenuItems.map(menu => (
              !!menu.items ?
                (
                  <Box key={menu.id}>
                    <StyledListItem button onClick={() => toggleMenus(menu.id)}>
                      <ListItemIcon>
                        {menu.icon}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography variant="body1">{menu.title}</Typography>
                      </ListItemText>
                      {menuExpand[menu.id] ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                    </StyledListItem>
                    <Collapse in={menuExpand[menu.id]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {menu.items.map(item => (
                          <StyledListItem
                            button
                            key={item.id}
                            onClick={() => changeRoute(item.id)}
                            className={clsx(
                              classes.nestedListItem,
                              { [classes.activeList]: strippedPathName === item.id }
                            )}>
                            <ListItemIcon>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText>
                              <Typography variant="body1">{item.title}</Typography>
                            </ListItemText>
                          </StyledListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                ) :
                (
                  <StyledListItem
                    button
                    key={menu.id}
                    onClick={() => changeRoute(menu.id)}
                    className={clsx({ [classes.activeList]: strippedPathName === menu.id })}>
                    <ListItemIcon>
                      {menu.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="body1">{menu.title}</Typography>
                    </ListItemText>
                  </StyledListItem>
                )
            ))}
          </List>
        </Box>
      </Drawer>
    </nav>
  );
}
