import React from 'react';
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
} from '@material-ui/core';
import { GetAppRounded, RateReviewRounded } from '@material-ui/icons';
import moment from 'moment';
import { Notes } from '../common/modal/notes';
import { useModal } from '../common/modal';
import { formatDate } from '../../utils';
import { addItemNotes } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
  item: {
    '& > :last-child > *': {
      borderBottom: 'unset',
    },
  },
  itemName: {
    width: '300px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));
export const ItemsList = ({ processingOption, items = [] }) => {
  const classes = useStyles();
  const { openModal, closeModal } = useModal();

  const handleAddNoteClick = (item) => {
    openModal({
      modalProps: { maxWidth: 'xs' },
      modalContent: Notes,
      modalContentProps: {
        title: `Notes for: ${item.name}`,
        notes: item.notes,
        onConfirm: (note) =>
          addItemNotes({ _id: item._id, note }).then((response) => {
            item.notes = response.data && response.data.notes;
            closeModal();
          }),
        onCancel: () => closeModal(),
      },
    });
  };

  const handleDownloadFile = (item) => {
    const serverUrl =
      'https://qualtry-applications.com/static/files/production';
    const url = `${serverUrl}/${moment(item.order.orderDate).format(
      'YYYY/MM/DD'
    )}/${item.order.orderId}-${item.orderItemId}.pdf`;
    window.open(url, '_blank').focus();
  };

  return (
    <Box margin={1}>
      <Typography variant="h5" gutterBottom component="div">
        Items
      </Typography>
      <Table size="small" aria-label="items">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Order #</TableCell>
            <TableCell>Store</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={classes.item}>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell component="th" scope="row">
                <Box className={classes.itemName}>{item.name}</Box>
              </TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.order.orderNumber}</TableCell>
              <TableCell>{item.order.store.name}</TableCell>
              <TableCell>{formatDate(item.order.orderDate)}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell>
                <Box display="flex">
                  <Box>
                    <Tooltip
                      title="Notes"
                      onClick={() => handleAddNoteClick(item)}
                    >
                      <IconButton size="small">
                        <RateReviewRounded
                          fontSize="small"
                          color={item?.notes?.length ? 'primary' : 'action'}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box px={2}>
                    {processingOption === 'AUTOMATIC' && (
                      <Tooltip
                        title="Download"
                        onClick={() => handleDownloadFile(item)}
                      >
                        <IconButton size="small">
                          <GetAppRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
