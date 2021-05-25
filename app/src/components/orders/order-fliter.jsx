import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import TextField from '@material-ui/core/TextField';
import { Popper } from '../common/popper/popper';

const PopperContent = ({ filters = {}, onConfirm, onClose }) => {
  const [orderNumber, setOrderNumber] = useState(filters.orderNumber || '');

  const handleConfirm = () => {
    onConfirm({ orderNumber });
    onClose();
  };
  const handleReset = () => {
    onConfirm({ orderNumber: '' });
    onClose();
  }
  return (
    <Box pt={1} px={1} display="flex" flexDirection="column" minWidth="350px">
      <Box>
        <Typography variant="subtitle2">FILTERS</Typography>
      </Box>
      <Box py={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter order #"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleConfirm();
            }
          }}
          name="orderNumber" />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Tooltip title="Reset Filter">
          <IconButton onClick={handleReset}>
            <SettingsBackupRestoreIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Apply Filter">
          <IconButton onClick={handleConfirm}>
            <ArrowForwardIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export const OrderFilter = ({ filters, onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popper
      isOpen={isOpen}
      placement="bottom-start"
      onClickAway={() => setIsOpen(false)}
      popperContent={PopperContent}
      popperContentProps={{
        onClose: () => setIsOpen(false),
        filters,
        onConfirm
      }}
      modifiers={{}}
      noPadding
      disablePortal={false}
    >
      <IconButton onClick={() => setIsOpen(true)}>
        <FilterListIcon color={filters.orderNumber ? 'primary': 'inherit'} />
      </IconButton>
    </Popper>
  )
};
