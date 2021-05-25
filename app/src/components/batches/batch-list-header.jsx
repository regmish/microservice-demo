import React, { useState } from 'react';
import {
  Box,
  Typography,
  Toolbar,
  lighten,
  makeStyles,
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import {
  MoreVertRounded,
  PrintRounded,
  DescriptionRounded,
  GetAppRounded,
} from '@material-ui/icons';
import { Popper } from '../common/popper/popper';
import Loading from '../common/loading';
import { useAPI } from '../../hooks/api';

const StyledListItem = withStyles((theme) => ({
  root: {
    '& .MuiListItemIcon-root': {
      minWidth: '35px',
    },
    '& .MuiTypography-root': {
      fontWeight: 500,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiTypography-root,.MuiListItemIcon-root': {
        color: theme.palette.text.contrastText,
      },
    },
  },
}))(ListItem);

const useStyles = makeStyles((theme) => ({
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    minHeight: '50px',
  },
}));

const PopperContent = ({ onClose, setLoading, menuItems }) => {
  const handleMenuClick = (handler) => {
    setLoading(true);
    handler().then(() => {
      setLoading(false);
    });
    onClose();
  };

  return (
    <List component="nav" disablePadding>
      {menuItems.map((menu) => (
        <StyledListItem
          button
          key={menu.title}
          onClick={() => handleMenuClick(menu.handler)}
        >
          <ListItemIcon>{menu.icon}</ListItemIcon>
          <ListItemText primary={menu.title} />
        </StyledListItem>
      ))}
    </List>
  );
};

export const BatchListHeader = ({ selected }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { bulkBatches } = useAPI();

  return (
    <Toolbar className={classes.highlight}>
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        pl={1}
      >
        <Box flexGrow="1">
          <Typography color="inherit" variant="subtitle1" component="div">
            {selected.length} selected
          </Typography>
        </Box>
        <Box>
          <Popper
            isOpen={menuOpen}
            placement="bottom-end"
            onClickAway={() => setMenuOpen(false)}
            popperContent={PopperContent}
            popperContentProps={{
              onClose: () => setMenuOpen(false),
              setLoading,
              menuItems: [
                {
                  title: 'Production Slip',
                  icon: <PrintRounded />,
                  handler: () => bulkBatches('production-slip', selected),
                },
                {
                  title: 'Line Items',
                  icon: <DescriptionRounded />,
                  handler: () => bulkBatches('line-items', selected),
                },
                {
                  title: 'Production Files',
                  icon: <GetAppRounded />,
                  handler: () => bulkBatches('production-files', selected),
                },
              ],
            }}
            noPadding
            disablePortal={false}
          >
            {!loading ? (
              <IconButton onClick={() => setMenuOpen(true)} size="small">
                <MoreVertRounded color={menuOpen ? 'primary' : 'inherit'} />
              </IconButton>
            ) : (
              <Loading contained size={25} />
            )}
          </Popper>
        </Box>
      </Box>
    </Toolbar>
  );
};
