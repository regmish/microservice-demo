import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import {
  Box,
  Paper,
  ClickAwayListener,
  makeStyles,
  Popper as MuiPopper,
} from '@material-ui/core';

const ARROW_SIZE = 6;
const arrowGenerator = (theme) => ({
  '&[x-placement*="bottom"] $arrow': {
    top: 0,
    left: 0,
    marginTop: '-1em',
    width: '4em',
    height: '1em',
    '&::before': {
      borderWidth: '0 1em 1em 1em',
      borderColor: `transparent transparent ${theme.palette.common.white} transparent`,
    },
  },
  '&[x-placement*="top"] $arrow': {
    bottom: 0,
    left: 0,
    marginBottom: '-1em',
    width: '4em',
    height: '1em',
    '&::before': {
      borderWidth: '1em 1em 0 1em',
      borderColor: `${theme.palette.common.white} transparent transparent transparent`,
    },
  },
  '&[x-placement*="right"] $arrow': {
    left: 0,
    marginLeft: '-1em',
    height: '4em',
    width: '1em',
    '&::before': {
      borderWidth: '1em 1em 1em 0',
      borderColor: `transparent ${theme.palette.common.white} transparent transparent`,
    },
  },
  '&[x-placement*="left"] $arrow': {
    right: 0,
    marginRight: '-1em',
    height: '4em',
    width: '1em',
    '&::before': {
      borderWidth: '1em 0 1em 1em',
      borderColor: `transparent transparent transparent ${theme.palette.common.white}`,
    },
  },
});

const popperStyles = makeStyles((theme) => ({
  popper: {
    ...arrowGenerator(theme),
    backgroundColor: theme.palette.common.white,
    filter: `drop-shadow(0px 2px 4px ${theme.palette.shadow.popper})`,
    zIndex: theme.zIndex.tooltip,
    borderRadius: '6px',
  },
  popperTop: {
    margin: theme.spacing(0.5, 0),
  },
  popperBottom: {
    margin: theme.spacing(0),
    padding: theme.spacing(1.25, 0),
  },
  popperLeft: {
    margin: theme.spacing(0.5),
  },
  popperRight: {
    margin: theme.spacing(0.5),
  },
  arrow: {
    position: 'absolute',
    fontSize: ARROW_SIZE,
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  noPadding: {
    padding: `${theme.spacing(0)} !important`,
  },
}));

const paperStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    overflow: 'hidden',
    height: '100%',
    width: (props) => props.width,
  },
}));

const PopperPaper = forwardRef(
  ({ width, children, className, ...props }, ref) => {
    const classes = paperStyles({ width });

    return (
      <Paper ref={ref} className={clsx(classes.root, className)} {...props}>
        {children}
      </Paper>
    );
  }
);

export const Popper = ({
  isOpen,
  placement,
  paperProps = {},
  popperContent: PopperContent,
  popperContentProps = {},
  onClickAway = () => {},
  modifiers = {},
  noPadding = false,
  className,
  disablePortal = true,
  children,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const classes = popperStyles({});

  const formattedModifiers = {
    preventOverflow: modifiers.preventOverflow === true,
    hide: modifiers.hide === true,
    flip: modifiers.flip === true,
    arrow: modifiers.arrow !== false,
    offset: modifiers.offset || 0,
  };

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box ref={setAnchorEl} cursor="pointer">
        {children}
      </Box>
      {anchorEl && isOpen && (
        <MuiPopper
          anchorEl={anchorEl}
          className={clsx(
            classes.popper,
            {
              [classes.popperTop]:
                placement.indexOf('top') > -1 && formattedModifiers.arrow,
              [classes.popperBottom]:
                placement.indexOf('bottom') > -1 && formattedModifiers.arrow,
              [classes.popperLeft]:
                placement.indexOf('left') > -1 && formattedModifiers.arrow,
              [classes.popperRight]:
                placement.indexOf('right') > -1 && formattedModifiers.arrow,
            },
            className
          )}
          open={isOpen}
          placement={placement}
          disablePortal={disablePortal}
          modifiers={{
            preventOverflow: {
              enabled: formattedModifiers.preventOverflow,
            },
            hide: {
              enabled: formattedModifiers.hide,
            },
            flip: {
              enabled: formattedModifiers.flip,
            },
            arrow: {
              enabled: formattedModifiers.arrow && arrowRef,
              element: arrowRef,
            },
            offset: {
              offset: formattedModifiers.offset,
            },
          }}
          {...props}
        >
          <span
            className={clsx({ [classes.arrow]: !!formattedModifiers.arrow })}
            ref={setArrowRef}
          />
          <ClickAwayListener onClickAway={onClickAway}>
            <PopperPaper
              className={clsx({ [classes.noPadding]: noPadding })}
              {...paperProps}
            >
              <PopperContent {...popperContentProps} />
            </PopperPaper>
          </ClickAwayListener>
        </MuiPopper>
      )}
    </Box>
  );
};
