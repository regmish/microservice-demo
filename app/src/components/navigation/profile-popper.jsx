import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import MuiAvatar from '@material-ui/core/Avatar';

import { Popper } from '../common';
import { logout } from '../../utils/auth';

const StyledList = withStyles(theme => ({
  root: {
    width: theme.spacing(20),
    padding: theme.spacing(1, 0, 1, 0),
  },
}))(List);

const StyledListItem = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    '& .MuiTypography-root': {
      fontWeight: 600,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiTypography-root': {
        color: theme.palette.text.contrastText,
      }
    },
  },
}))(ListItem);

const Avatar = withStyles(theme => ({
  root: {
    width: '30px',
    height: '30px',
    fontSize: '15px',
    letterSpacing: '1px',
    backgroundColor: theme.palette.secondary.main
  },
}))(MuiAvatar);

export const ProfilePopper = ({ initials }) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popper
      isOpen={isOpen}
      placement="bottom-end"
      onClickAway={() => setIsOpen(false)}
      popperContent={() => (
      <StyledList>
        <StyledListItem onClick={() => setIsOpen(false) || history.push('/users')} button>
          <Typography variant="body1">My Account</Typography>
        </StyledListItem>
        <StyledListItem onClick={() => setIsOpen(false) || logout()} button>
          <Typography variant="body1">Logout</Typography>
        </StyledListItem>
      </StyledList>
    )}
      modifiers={{
        offset: '0, 8px'
      }}
      noPadding
      disablePortal={false}
    >
      <IconButton onClick={() => setIsOpen(true)} size="small">
        <Avatar>{initials}</Avatar>
      </IconButton>
    </Popper>
  )
};
