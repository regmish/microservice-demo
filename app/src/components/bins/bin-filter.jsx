import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  ArrowForward,
  FilterList,
  SettingsBackupRestore,
} from '@material-ui/icons';
import { keys, pickBy, identity } from 'lodash';
import { Popper } from '../common/popper/popper';
import { BinStatus } from './bin-status';
import { DateRangePickerComponent } from '../common/dateRangePicker/dateRange';

const PopperContent = ({ filters = {}, setFilters, onClose }) => {
  const [status, setStatus] = useState({
    HOLD: filters.status.includes('HOLD'),
    FLAGGED: filters.status.includes('FLAGGED'),
    PARTIAL: filters.status.includes('PARTIAL'),
    COMPLETE: filters.status.includes('COMPLETE')
  });
  const [createdAt, setCreatedAt] = useState(
    filters.createdAt
  );
  const [orderDate, setOrderDate] = useState(
    filters.orderDate
  );


  const handleConfirm = () => {
    setFilters({
      ...filters,
      status: keys(pickBy(status, identity)),
      orderDate: orderDate,
      createdAt: createdAt
     });
    onClose();
  };

  const handleReset = () => {
    setFilters({...filters, status: [], orderDate: null, createdAt: null });
    onClose();
  };

  return (
    <Box pt={1} px={1} display="flex" flexDirection="column" minWidth="350px">
      <Box>
        <Typography variant="subtitle2">FILTERS</Typography>
      </Box>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between">
        {['HOLD', 'FLAGGED', 'PARTIAL', 'COMPLETE'].map((state) => (
          <BinStatus
            key={state}
            status={state}
            selected={status[state]}
            setSelected={(selected) => {
              setStatus({ ...status, [state]: selected });
            }}
          />
        ))}
      </Box>
      <Box display="flex" flexDirection="column" >
        <DateRangePickerComponent 
          date={filters.orderDate} 
          setDate={setOrderDate}
          label="Order Date" 
          key="order_date" 
          />
        <DateRangePickerComponent
          date={filters.createdAt}
          setDate={setCreatedAt}
          label="Created Date" 
          key="created_date"
        />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Tooltip title="Reset Filter">
          <IconButton onClick={handleReset}>
            <SettingsBackupRestore />
          </IconButton>
        </Tooltip>
        <Tooltip title="Apply Filter">
          <IconButton onClick={handleConfirm}>
            <ArrowForward color="secondary" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export const BinFilters = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popper
      isOpen={isOpen}
      placement="bottom-end"
      onClickAway={() => setIsOpen(false)}
      popperContent={PopperContent}
      popperContentProps={{
        onClose: () => setIsOpen(false),
        filters,
        setFilters,
      }}
      modifiers={{}}
      noPadding
      disablePortal={false}
    >
      <IconButton onClick={() => setIsOpen(true)}>
        <FilterList
          color={filters.status.length ? 'primary' : 'inherit'}
        />
      </IconButton>
    </Popper>
  );
};
