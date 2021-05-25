import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ReplayIcon from '@material-ui/icons/Replay';
import { Switch } from '../common/table/switch';
import { ItemsList } from './item-list';
import Loading from '../common/loading';
import { getOrderItems, manualBatch } from '../../utils/api';
import { formatDate } from '../../utils';

const useStyles = makeStyles(theme => ({
  batchRow: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
}));

export const OrderRow = ({ order }) => {
  const classes = useStyles();
  const [orderItems, setOrderItems] = useState(order.items);
  const [expand, setExpand] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExpand = async() => {
    setExpand(!expand);

    if(!expand) {
      const { data: items = {} } = await getOrderItems(order._id);
      setOrderItems(items);
    }
  };

  const handleRerunBatchClick = async (orderId) => {
    setLoading(true);
    const response = await manualBatch(orderId, { batched: true });
    if(response.data) {
      order.batched = response.data;
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.orderRow} hover selected={expand}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => handleExpand()}>
            {expand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.orderNumber}</TableCell>
        <TableCell align="center">{formatDate(order.orderDate)}</TableCell>
        <TableCell align="center">{order.store.name}</TableCell>
        <TableCell align="right">
          <Box display="flex" width="100%" justifyContent="center"> <Switch state={order.batched} activeText="Batched" deactiveText="Not Batched" /> </Box>
        </TableCell>
        <TableCell align="left">
          <Box pl={2}>{order.quantity}</Box>
        </TableCell>
        <TableCell align="right">
          <Box display="flex" justifyContent="space-evenly" alignItems="center">
            {!loading ?
              <Tooltip title="Re-run Batch" onClick={() => handleRerunBatchClick(order._id)}>
                <IconButton size="small">
                  <ReplayIcon />
                </IconButton>
              </Tooltip> : <Loading contained size={25} />}
          </Box>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={expand} timeout="auto" unmountOnExit>
            <ItemsList items={orderItems} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
