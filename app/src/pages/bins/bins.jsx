import React, { useState, useEffect } from 'react';
import {
  Checkbox,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
} from '@material-ui/core';
import { pickBy, identity } from 'lodash';
import { BinSearchFilter, BinRow } from '../../components/bins';
import { ScrollContainer } from '../../components/layout';
import Loading from '../../components/common/loading';
import { getBins } from '../../utils/api';

const useStyles = makeStyles((theme) => ({
  heading: {
    '& .MuiTableCell-root': {
      padding: theme.spacing(0, 1),
    },
  },
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
}));

export const Bins = () => {
  const savedFilters = JSON.parse(
    window.localStorage.getItem('QUALTRY:FILTERS_BINS')
  ) || {
    term: '',
    status: [],
    createdAt: null,
    orderDate: null
  }
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [bins, setBins] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filters, setFilters] = useState(savedFilters);

  const changeSorting = (field) => {
    const isAsc = sortKey === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortKey(field);
  };

  useEffect(() => {
    setLoading(true);
    const fetchBins = async () => {
      const response = await getBins({
        ...pickBy(filters, identity),
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        sort: { key: sortKey, direction: sortDirection },
      });
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setBins(data);
        setCount(count);
      }
      setLoading(false);
    };
    fetchBins();
  }, [page, rowsPerPage, sortKey, sortDirection, filters]);

  const applyFilter = (changedFilters = {}) => {
    setFilters(changedFilters);
    localStorage.setItem(
      'QUALTRY:FILTERS_BINS',
      JSON.stringify(changedFilters)
    );
  };

  const selectedCount = 0;
  const headings = [
    { field: 'name', label: 'Bin Name' },
    { field: 'orderNumber', label: 'Order #' },
    { field: 'status', label: 'Status' },
    { field: 'orderDate', label: 'Order Date' },
    { field: 'lastAttachedOn', label: 'Created On' },
  ];

  if (isLoading) return <Loading size={50} />;

  return (
    <ScrollContainer
      header={<BinSearchFilter filters={filters} setFilters={applyFilter} />}
      body={
        <Paper>
          <Table stickyHeader>
            <TableHead>
              <TableRow className={classes.heading}>
                <TableCell padding="checkbox" />
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedCount > 0 && selectedCount < count}
                    checked={count > 0 && selectedCount === count}
                    onChange={() => {}} // select all
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>
                {headings.map((heading) => (
                  <TableCell key={heading.field}>
                    <TableSortLabel
                      active={sortKey === heading.field}
                      direction={
                        sortKey === heading.field ? sortDirection : 'asc'
                      }
                      onClick={() => changeSorting(heading.field)}
                    >
                      {heading.label}
                      {sortKey === heading.field ? (
                        <span className={classes.visuallyHidden}>
                          {sortDirection === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bins.map((bin) => (
                <BinRow key={bin._id} bin={bin} />
              ))}
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
          onChangeRowsPerPage={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
          }}
        />
      }
    />
  );
};
