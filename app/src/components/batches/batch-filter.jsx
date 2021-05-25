import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
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
import { BatchStatus } from './batch-status';
import { DateRangePickerComponent } from '../common/dateRangePicker/dateRange';

const batchStatus = [
  'PENDING',
  'READY',
  'COMPLETE',
  'HOLD',
  'SHIPPED',
  'ARCHIVED',
];

const PopperContent = ({ filters = {}, setFilters, onClose }) => {
  const [processingOption, setProcessingOption] = useState({
    AUTOMATIC: filters.processingOption.includes('AUTOMATIC'),
    MANUAL: filters.processingOption.includes('MANUAL'),
    POSTPROCESSED: filters.processingOption.includes('POSTPROCESSED'),
  });
  const [status, setStatus] = useState({
    PENDING: filters.status.includes('PENDING'),
    READY: filters.status.includes('READY'),
    COMPLETE: filters.status.includes('COMPLETE'),
    HOLD: filters.status.includes('HOLD'),
    SHIPPED: filters.status.includes('SHIPPED'),
    ARCHIVED: filters.status.includes('ARCHIVED'),
  });
  const [orderDate, setOrderDate] =  useState(
    filters.orderDate
  );
  const [createdAt, setCreatedAt] = useState(
    filters.createdAt
  )

  const handleProcessingOptionsChange = (event) => {
    setProcessingOption({
      ...processingOption,
      [event.target.name]: event.target.checked,
    });
  };

  const handleConfirm = () => {
    setFilters({
      ...filters,
      status: keys(pickBy(status, identity)),
      processingOption: keys(pickBy(processingOption, identity)),
      orderDate: orderDate,
      createdAt: createdAt
    });
    onClose();
  };

  const handleReset = () => {
    setFilters({ ...filters, status: [], processingOption: [], orderDate: null, createdAt: null });
    onClose();
  };

  return (
    <Box py={2} px={1} display="flex" flexDirection="column" minWidth="350px">
      <Box>
        <Typography variant="subtitle2">FILTERS</Typography>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Box display="flex">
          {batchStatus.slice(0, 3).map((state) => (
            <BatchStatus
              key={state}
              status={state}
              selected={status[state]}
              setSelected={(selected) => {
                setStatus({ ...status, [state]: selected });
              }}
            />
          ))}
        </Box>
        <Box display="flex">
          {batchStatus.slice(3).map((state) => (
            <BatchStatus
              key={state}
              status={state}
              selected={status[state]}
              setSelected={(selected) => {
                setStatus({ ...status, [state]: selected });
              }}
            />
          ))}
        </Box>
      </Box>
      <Divider />
      <Box py={1} display="flex" justifyContent="center">
        <FormControlLabel
          control={
            <Checkbox
              checked={processingOption['AUTOMATIC']}
              onChange={handleProcessingOptionsChange}
              name="AUTOMATIC"
              color="primary"
            />
          }
          label="Automatic"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={processingOption['MANUAL']}
              onChange={handleProcessingOptionsChange}
              name="MANUAL"
              color="primary"
            />
          }
          label="Manual"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={processingOption['POSTPROCESSED']}
              onChange={handleProcessingOptionsChange}
              name="POSTPROCESSED"
              color="primary"
            />
          }
          label="Post-Processed"
        />
      </Box>
      <Divider />
      <Box display="flex" flexDirection="column">
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
      <Divider />
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

export const BatchFilter = ({ filters, setFilters }) => {
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
          color={(filters.status || filters?.processingOption?.length) ? 'primary' : 'inherit'}
        />
      </IconButton>
    </Popper>
  );
};
