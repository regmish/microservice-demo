import React, { useEffect, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import { OrderRow } from './order-row';
import Loading from '../common/loading';
import { OrderFilter } from './order-fliter';
import { getOrders } from '../../utils/api';
import { ScrollContainer } from '../layout';

const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

export const OrdersTable = ({ department = {} }) => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState({
    orderNumber: ''
  });

  const changeSorting = (field) => {
    const isAsc = sortKey === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortKey(field);
  };

  const applyFilter = (changedFilters = {}) => {
    setFilters(changedFilters);
  }


  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      const params = filters.orderNumber ? { orderNumber: filters.orderNumber } : {};
      const response = await getOrders({
        ...params,
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        sort: { key: sortKey, direction: sortDirection }
      });
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setOrders(data);
        setCount(count);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [page, rowsPerPage, sortKey, sortDirection, filters]);

  if (isLoading) return <Loading />;

  const headings = [
    { field: 'orderNumber', label: 'Order #', align: 'left' },
    { field: 'orderDate', label: 'Order Date' },
    { field: 'store.id', label: 'Store' },
    { field: 'batched', label: 'Batched' },
    { field: 'quantity', label: 'Item Qty', align: 'left' },
  ];

  return (
    <ScrollContainer
      header={
        <Box position="relative" width="100%" display="flex" alignItems="flex-end">
          <Box position="absolute" top="6px" left="6px" zIndex="99999">
            <OrderFilter filters={filters} onConfirm={applyFilter} />
          </Box>
        </Box>
      }
      body={
        <Paper>
          <Table stickyHeader style={{ tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell />
                {headings.map(heading => (
                  <TableCell key={heading.field} align={heading.align || 'center'}>
                    <TableSortLabel
                      active={sortKey === heading.field}
                      direction={sortKey === heading.field ? sortDirection : 'asc'}
                      onClick={() => changeSorting(heading.field)}
                    >
                      {heading.label}
                      {sortKey === heading.field ? (
                        <span className={classes.visuallyHidden}>
                          {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => <OrderRow key={order._id} order={order} />)}
            </TableBody>
          </Table>
        </Paper>
      }
      footer={
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={(event, newPage) => setPage(newPage)}
          onChangeRowsPerPage={(event) => { setRowsPerPage(parseInt(event.target.value, 10)) }}
        />
      }
    />
  );
}
