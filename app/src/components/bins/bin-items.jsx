import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Collapse,
} from '@material-ui/core';
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';
import {
  CommentRounded,
  KeyboardArrowDown,
  KeyboardArrowUp,
  FlagRounded,
} from '@material-ui/icons';
import { first, groupBy } from 'lodash';
import { BatchStatus } from '../batches/batch-status';
import { Notes } from '../common/modal/notes';
import { FlagConfirm } from './flag-confirm';
import { useModal } from '../common/modal';
import { useAPI } from '../../hooks/api';

const useStyles = makeStyles((theme) => ({
  batches: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  itemRow: {
    '&:last-child > *': {
      borderBottom: 'unset',
    },
  },
  batchName: {
    fontSize: '12px',
    fontWeight: 700,
    width: '300px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemName: {
    width: '300px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

export const BinItems = ({ updateBinStatus, items = [] }) => {
  const classes = useStyles();
  const { openModal, closeModal } = useModal();
  const [expanded, setExpanded] = useState({});
  const { addItemNotes, flagItem } = useAPI();

  const groupedByBatches = groupBy(items, 'batch._id');

  const handleExpand = (id) => {
    setExpanded({ ...expanded, [id]: !expanded[id] });
  };

  const handleFlagItem = (item) => {
    openModal({
      modalProps: { maxWidth: 'xs' },
      modalContent: FlagConfirm,
      modalContentProps: {
        item,
        onConfirm: () =>
          flagItem(item._id, !item.flagged).then((response) => {
            if (response) {
              item.flagged = !item.flagged;
              updateBinStatus(item.flagged ? 'FLAGGED' : 'PARTIAL');
            }
            closeModal();
          }),
        onCancel: () => closeModal(),
      },
    });
  };

  const handleAddNoteClick = (item) => {
    openModal({
      modalProps: { maxWidth: 'xs' },
      modalContent: Notes,
      modalContentProps: {
        title: `Notes for: ${item.name}`,
        notes: item.notes,
        onConfirm: (note) =>
          addItemNotes({ _id: item._id, note }).then((response) => {
            item.notes = response.notes;
            closeModal();
          }),
        onCancel: () => closeModal(),
      },
    });
  };

  return (
    <Box margin={1}>
      <Typography variant="h5" gutterBottom component="div">
        Items
      </Typography>
      <Table size="small" aria-label="batch-items">
        <TableBody>
          {Object.keys(groupedByBatches).map((batchId) => (
            <TableRow key={batchId}>
              <TableCell
                style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 0 }}
                colSpan={6}
              >
                <Table size="small">
                  <TableBody>
                    <TableRow className={classes.batches}>
                      <TableCell padding="checkbox">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleExpand(batchId)}
                        >
                          {expanded[batchId] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Box display="flex" alignItems="center">
                          <Box className={classes.batchName}>
                            {first(groupedByBatches[batchId])?.batch?.name ??
                              'Non Batched'}
                          </Box>
                          <Box ml={2}>
                            <BatchStatus
                              status={
                                first(groupedByBatches[batchId])?.batch?.status
                              }
                            />
                          </Box>
                          <Box ml={2}>
                            {!!first(groupedByBatches[batchId])?.batch?.notes
                              ?.length && (
                              <Tooltip title="Notes">
                                <IconButton size="small" onClick={() => {}}>
                                  <CommentRounded
                                    fontSize="small"
                                    style={{ fontSize: '1rem' }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={8}
                      >
                        <Collapse
                          in={expanded[batchId]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Table size="small" aria-label="items">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Notes</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {groupedByBatches[batchId].map((item) => (
                                <TableRow
                                  key={item._id}
                                  className={classes.itemRow}
                                >
                                  <TableCell component="th" scope="row">
                                    <Box className={classes.itemName}>
                                      {item.name}
                                    </Box>
                                  </TableCell>
                                  <TableCell>{item.sku}</TableCell>
                                  <TableCell>
                                    <Box display="flex" alignItems="center">
                                      <Box>
                                        <Tooltip title="Notes">
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleAddNoteClick(item)
                                            }
                                          >
                                            <RateReviewOutlinedIcon
                                              fontSize="small"
                                              color={
                                                item?.notes?.length
                                                  ? 'primary'
                                                  : 'action'
                                              }
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                      <Box pl={2}>
                                        <Tooltip title={item?.flagged ? 'Unflag Item': 'Flag Item'}>
                                          <IconButton
                                            size="small"
                                            onClick={() => handleFlagItem(item)}
                                          >
                                            <FlagRounded
                                              fontSize="small"
                                              color={
                                                item?.flagged
                                                  ? 'primary'
                                                  : 'action'
                                              }
                                            />
                                          </IconButton>
                                        </Tooltip>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
