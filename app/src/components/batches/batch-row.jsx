import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Tooltip,
  Typography,
  makeStyles,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from '@material-ui/core';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  CommentRounded,
} from '@material-ui/icons';
import { capitalize, find } from 'lodash';
import { ItemsList } from './item-list';
import Loading from '../common/loading';
import { formatDate, timeAgo } from '../../utils';
import { BatchStatus } from './batch-status';
import { BatchRowActionsPopper } from './batch-row-actions-popper';
import { Notes } from '../common/modal/notes';
import { useAPI } from '../../hooks/api';
import { useToast } from '../common/toast';
import { useModal } from '../common/modal';

const useStyles = makeStyles((theme) => ({
  batchRow: {
    '& > *': {
      borderBottom: 'unset',
    },
    '& .MuiTableCell-root': {
      padding: theme.spacing(1),
    },
  },
}));

export const BatchRow = ({
  departments = [],
  batch,
  selected,
  checked,
  handleRowChecked,
}) => {
  const classes = useStyles();
  const [batchItems, setBatchItems] = useState(batch.items || []);
  const [loading, setLoading] = useState({});
  const [expand, setExpand] = useState(false);
  const { addBatchNotes, getBatchItems, transitionBatch } = useAPI();
  const { openToast } = useToast();
  const { openModal, closeModal } = useModal();
  const department = find(departments, { _id: batch.department })?.name;

  const handleExpand = async () => {
    setExpand(!expand);

    if (!expand && !batchItems.length) {
      setLoading({ ...loading, batchItems: true });
      const items = await getBatchItems(batch._id);
      items && setBatchItems(items);
      setLoading({ ...loading, batchItems: false });
    }
  };

  const showNotes = async () => {
    openModal({
      modalProps: { maxWidth: 'xs' },
      modalContent: Notes,
      modalContentProps: {
        title: `Notes for:  ${batch.name}`,
        notes: batch.notes,
        onConfirm: (note) =>
          addBatchNotes(batch._id, { note }).then((response) => {
            batch.notes = response && response.notes;
            openToast({ message: 'Notes Added.', status: 'success' });
            closeModal();
          }),
        onCancel: () => closeModal(),
      },
    });
  };

  const handleBatchTransition = async (status) => {
    const data = await transitionBatch(batch._id, { status });
    if (data) {
      batch.status = data.status;
      openToast({
        message: `Marked as ${capitalize(data.status)}`,
        status: 'success',
      });
    }
    setLoading({ ...loading, transition: false });
  };

  return (
    <React.Fragment>
      <TableRow
        className={classes.batchRow}
        hover
        role="checkbox"
        aria-checked={checked}
        tabIndex={-1}
        selected={checked || expand}
      >
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleExpand()}
          >
            {expand ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            checked={checked}
            onClick={() => handleRowChecked(batch._id)}
            inputProps={{ 'aria-labelledby': batch._id }}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <Box position="relative">
            {!!batch?.notes?.length && (
              <Box position="absolute" left="-20px" top="-2px" display="inline">
                <Tooltip title="Notes">
                  <IconButton size="small" onClick={showNotes}>
                    <CommentRounded
                      fontSize="small"
                      style={{ fontSize: '1rem' }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            <Typography variant="subtitle2" component="span">
              {batch.name}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{department}</TableCell>
        <TableCell>{capitalize(batch.processingOption)}</TableCell>
        <TableCell>
          <BatchStatus loading={loading.transition} status={batch.status} />
        </TableCell>
        <TableCell>{timeAgo(batch.orderDate)}</TableCell>
        <TableCell>{formatDate(batch.createdAt)}</TableCell>
        <TableCell align="left">
          <Box pl={2}>{batch?.counts?.quantity}</Box>
        </TableCell>
        <TableCell align="right">
          {!selected.length && batch && (
            <BatchRowActionsPopper
              batch={batch}
              batchTransition={(nextStatus) =>
                handleBatchTransition(nextStatus)
              }
              showNotes={showNotes}
              updateBatchData={({ status, productionFiles }) => {
                batch.status = status;
                batch.productionFiles = productionFiles;
              }}
              department={department}
            />
          )}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            {!loading.batchItems ? (
              <ItemsList
                processingOption={batch.processingOption}
                items={batchItems}
              />
            ) : (
              <Loading size={25} />
            )}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
