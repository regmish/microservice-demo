import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import RateReviewOutlinedIcon from '@material-ui/icons/RateReviewOutlined';
import { Notes } from '../common/modal/notes';
import { useModal } from '../common/modal';
import { addItemNotes } from '../../utils/api';

const useStyles = makeStyles(theme => ({
  item: {
    '& > :last-child > *': {
      borderBottom: 'unset',
    }
  },
  itemName: {
    width: '300px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}))
export const ItemsList = ({ items = [] }) => {
  const classes = useStyles();
  const { openModal, closeModal } = useModal();

  const handleAddNoteClick = item => {
    openModal({
      modalProps: { maxWidth: 'xs' },
      modalContent: Notes,
      modalContentProps: {
        title: `Notes for: ${item.name}`,
        notes: item.notes,
        onConfirm: (note) => addItemNotes({ _id: item._id, note })
          .then((response) => {
            item.notes = response.data && response.data.notes;
            closeModal();
          }),
        onCancel: () => closeModal()
      }
    });
  };

  return (
    <Box margin={1}>
      <Typography variant="h5" gutterBottom component="div">Items</Typography>
      <Table size="small" aria-label="items">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Batch</TableCell>
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
              <TableCell>{item.batch ? item.batch.name : 'Not Batched'}</TableCell>
              <TableCell align="center">{item.quantity}</TableCell>
              <TableCell>
                <Tooltip title="Notes" onClick={() => handleAddNoteClick(item)}>
                  <IconButton size="small">
                    <RateReviewOutlinedIcon fontSize="small" color={item?.notes?.length ? 'primary' : 'action'} />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
