import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Checkbox,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableHead,
  TableRow,
  TablePagination,
} from '@material-ui/core';
import { pickBy, identity } from 'lodash';
import Loading from '../../components/common/loading';
import { ScrollContainer } from '../../components/layout';
import {
  BatchesSearchFilter,
  BatchRow,
  BatchListHeader,
} from '../../components/batches';
import { getDepartments, getBatches } from '../../utils/api';

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

export const Batches = () => {
  const params = new URLSearchParams(window.location.search);
  const savedFilters = JSON.parse(
    window.localStorage.getItem('QUALTRY:FILTERS_BATCHES')
  ) || {
    department: params.get('department'),
    term: '',
    status: [],
    processingOption: [],
    createdAt: null,
    orderDate: null,
  } ;
  const classes = useStyles();
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [filters, setFilters] = useState(savedFilters);
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!departments.length) {
      setLoading(true);
      const fetchDepartments = async () => {
        const response = await getDepartments({
          sort: { key: 'name', direction: 'desc' },
        });
        if (response.data && response.data.length) {
          setDepartments(response.data);
          if (!filters.department) {
            applyFilter({ ...filters, department: 'all' });
            history.push('/batches?department=all');
          } else {
            history.push(`/batches?department=${filters.department}`);
          }
        }
        setLoading(false);
      };
      fetchDepartments();
    }
  }, [departments, history, filters]);

  useEffect(() => {
    if (filters.department) {
      setLoading(true);
      const fetchBatches = async () => {
        const response = await getBatches({
          ...pickBy(filters, identity),
          limit: rowsPerPage,
          skip: page * rowsPerPage,
          sort: { key: sortKey, direction: sortDirection },
        });
        if (response.data) {
          const { count = 0, data = [] } = response.data;
          setBatches(data);
          setCount(count);
        }
        setLoading(false);
      };
      fetchBatches();
    }
  }, [page, rowsPerPage, sortKey, sortDirection, filters]);

  const changeSorting = (field) => {
    const isAsc = sortKey === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortKey(field);
  };

  const changeDepartment = (department) => {
    history.push(`/batches?department=${department}`);
    applyFilter({ ...filters, department });
  };

  const applyFilter = (changedFilters = {}) => {
    setFilters(changedFilters);
    localStorage.setItem(
      'QUALTRY:FILTERS_BATCHES',
      JSON.stringify(changedFilters)
    );
  };

  const handleRowChecked = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const selectAll = (event) => {
    if (event.target.checked) {
      const newSelecteds = batches.map((row) => row._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const headings = [
    { field: 'department', label: 'Department' },
    { field: 'processingOption', label: 'Processing Option' },
    { field: 'status', label: 'Status' },
    { field: 'averageAge', label: 'Average Age' },
    { field: 'createdAt', label: 'Created On' },
    { field: 'counts.quantity', label: 'Item Qty' },
  ];

  if (isLoading) return <Loading size={50} />;

  return (
    <ScrollContainer
      header={
        selected.length ? (
          <BatchListHeader selected={selected} />
        ) : (
          <BatchesSearchFilter
            departments={departments}
            setDepartment={changeDepartment}
            filters={filters}
            setFilters={applyFilter}
          />
        )
      }
      body={
        <Paper>
          <Table stickyHeader>
            <TableHead>
              <TableRow className={classes.heading}>
                <TableCell padding="checkbox" />
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < batches.length
                    }
                    checked={
                      batches.length > 0 && selected.length === batches.length
                    }
                    onChange={selectAll} // select all
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>
                <TableCell align="left">Batch Name</TableCell>
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
              {batches.map((batch) => (
                <BatchRow
                  key={batch._id}
                  departments={departments}
                  batch={batch}
                  handleRowChecked={handleRowChecked}
                  selected={selected}
                  checked={selected.indexOf(batch._id) > -1}
                />
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
