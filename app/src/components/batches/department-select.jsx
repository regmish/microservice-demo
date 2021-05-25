import React, { useState } from 'react';
import {
  List,
  ListItem,
  Typography,
  Box,
  withStyles,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import find from 'lodash/find';
import { Popper } from '../common/popper/popper';

const useStyles = makeStyles((theme) => ({
  departmentSelect: {
    padding: '18px',
    width: '150px',
    height: '30px',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '6px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.shadow.pane,
    },
  },
}));

const StyledList = withStyles((theme) => ({
  root: {
    width: theme.spacing(20),
  },
}))(List);

const StyledListItem = withStyles((theme) => ({
  root: {
    '& .MuiTypography-root': {
      fontWeight: 600,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiTypography-root': {
        color: theme.palette.text.contrastText,
      },
    },
  },
}))(ListItem);

export const DepartmentSelect = ({ departments = [], setDepartment }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);

  return (
    <Popper
      isOpen={isOpen}
      placement="bottom-end"
      onClickAway={() => setIsOpen(false)}
      popperContent={() => (
        <StyledList>
          {[{ _id: 'all', name: 'All' }].concat(departments).map((department) => (
            <StyledListItem
              key={department._id}
              onClick={() => setIsOpen(false) || setDepartment(department._id)}
              button
            >
              <Typography variant="body1">{department.name}</Typography>
            </StyledListItem>
          ))}
        </StyledList>
      )}
      modifiers={{
        offset: '0, 8px',
      }}
      noPadding
      disablePortal={false}
    >
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        className={classes.departmentSelect}
        onClick={() => setIsOpen(true)}
      >
        <Typography variant="subtitle2">
          {' '}
          {find(departments, { _id: params.get('department') })?.name ?? 'All'}{' '}
        </Typography>
        <Box position="absolute" right="7px" bottom="3px">
          <ExpandMoreIcon fontSize="small" />
        </Box>
      </Box>
    </Popper>
  );
};
