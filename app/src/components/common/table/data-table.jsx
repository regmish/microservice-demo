import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import toString from 'lodash/toString';
import { ScrollContainer } from '../../layout';
import { useModal } from '../modal';
import Loading from '../loading';
import { TableToolbar } from './table-toolbar';
import { TableHeader } from './table-header';
import { EmptyTable } from './empty-table';
import { TableForm } from './table-form';
import { TableActions } from './table-actions';
import { Switch } from './switch';
import { File } from './file';
import { PopperDropDown } from './popper-drop-down';
import { DeleteConfirmDialog } from './delete-confirm-dialog';
import { MultiSelect } from '../multiselect';
import { TokenComponent } from '../token';

const getColumns = (row = {}, idField) => {
  return Object.keys(row)
    .map((key) => ({
      id: key,
      type: typeof row[key] === 'string' ? 'text' : 'other',
      title: key.charAt(0).toUpperCase() + key.slice(1),
    }))
    .filter((col) => col.id !== idField);
};
const getDefaultOptions = (data = []) => {
  return {
    title: 'Table',
    isLoading: false,
    searchTerm: '',
    idField: '_id',
    columns: (data.length && getColumns(data[0], '_id')) || [],
    validations: {},
    onAddNew: async () => {},
    onEditRow: async () => {},
    onDeleteRow: async () => {},
    onSearch: async () => {},
    onPaginate: async () => {},
    onFileUpload: async () => {},
    onRefreshRow: async () => {},
  };
};

export const DataTable = ({ data = [], count = 0, options = {} }) => {
  const { openModal, closeModal } = useModal();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState([]);
  const [addNewFlag, setAddNewFlag] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState(null);

  const tableOptions = { ...getDefaultOptions(data), ...options };
  const idField = tableOptions.idField;
  const columns = tableOptions.columns;
  const validationsSchema = tableOptions.validations;
  const enabledActions = {
    add: typeof options.onAddNew === 'function',
    edit: typeof options.onEditRow === 'function',
    delete: typeof options.onDeleteRow === 'function',
    upload: typeof options.onFileUpload === 'function',
    refresh: typeof options.onRefreshRow === 'function',
  };

  const editAction = (row) => {
    setAddNewFlag(false);
    setCurrentlyEditing(row[idField]);
    options.onFormOpen && options.onFormOpen('edit');
  };

  const deleteAction = (row) => {
    deleteItem(row);
  };

  const refreshAction = (row) => {
    refreshItem(row);
  }

  const submitFormAction = (formvalues) => {
    if (currentlyEditing) {
      return tableOptions
        .onEditRow(formvalues)
        .then((status) => status && cancelFormAction());
    } else {
      return tableOptions
        .onAddNew(formvalues)
        .then((status) => status && cancelFormAction());
    }
  };

  const deleteItem = (item) => {
    openModal({
      modalProps: { maxWidth: 'xs' },
      modalContent: DeleteConfirmDialog,
      modalContentProps: {
        content: `Are you sure you want to delete:  ${item[columns[0].id]}`,
        onConfirm: () =>
          tableOptions.onDeleteRow(item).then(() => closeModal()),
        onCancel: () => closeModal(),
      },
    });
  };

  const cancelFormAction = () => {
    setAddNewFlag(false);
    setCurrentlyEditing(null);
  };

  const toggleAddNew = () => {
    setAddNewFlag(!addNewFlag);
    setCurrentlyEditing(null);
  };

  const refreshItem = (item) => {
    tableOptions.onRefreshRow(item);
  }

  const handleRowClick = (id) => {
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
      const newSelecteds = data.map((row) => row[idField]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    tableOptions
      .onPaginate({ page: newPage, rowsPerPage })
      .then(() => setPage(newPage));
  };

  const handleChangeRowsPerPage = (event) => {
    const nweRowsPerPage = parseInt(event.target.value, 10);
    tableOptions.onPaginate({ page, rowsPerPage: nweRowsPerPage }).then(() => {
      setRowsPerPage(nweRowsPerPage);
      setPage(0);
    });
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const getLabel = (options, id) =>
    (options.find((opt) => opt.id === id) || {}).label || '';
  
  // get selected options i.e default options on multidropdown
  const getSelected = (options, selected) => {
    if (!Array.isArray(selected)) {
      selected = [selected];
    }
  let selectedOptions = options.filter((o) => selected.includes(o.id));
  return selectedOptions
  }
  if (options.isLoading) return <Loading size={50} />;

  return (
    <ScrollContainer
      header={
        <TableToolbar
          title={options.title}
          selectedCount={selected.length}
          addNew={toggleAddNew}
          onSearch={tableOptions.onSearch}
          searchTerm={tableOptions.searchTerm}
          onFileUpload={tableOptions.onFileUpload}
          accept={tableOptions.options}
          enabledActions={enabledActions}
        />
      }
      body={
        <Table stickyHeader>
          <TableHeader
            columns={columns}
            count={data.length}
            selectedCount={selected.length}
            selectAll={selectAll}
            enabledActions={enabledActions}
          />
          <TableBody>
            {addNewFlag && (
              <TableForm
                columns={columns}
                validations={validationsSchema}
                submit={submitFormAction}
                cancel={cancelFormAction}
              />
            )}
            {data.length ? (
              data.map((row, index) => {
                const isItemSelected = isSelected(row[idField]);
                const labelId = `data-table-checkbox-${index}`;
                const isEditing = currentlyEditing === row[idField];
                return !!isEditing ? (
                  <TableForm
                    key={row[idField]}
                    values={row}
                    columns={columns}
                    validations={validationsSchema}
                    submit={submitFormAction}
                    cancel={cancelFormAction}
                    getSelected={getSelected}
                  />
                ) : (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row[idField]}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onClick={() => handleRowClick(row[idField])}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    {columns.map(({ id, type, options: _options = []  }) => (
                      <TableCell key={id}>
                        {type === 'options' ? (
                          getLabel(_options, row[id])
                        ) : type === 'switch' ? (
                          <Switch state={row[id]} />
                        ) : type === 'file' ? (
                          <File name={row[id]} />
                        ) : type === 'popper' ?(
                          <PopperDropDown 
                              _id={row[idField]}
                              onMultiSelectChannels={_options.onMultiSelectChannels}
                              selected={row[id]} 
                              options={_options.channels} />
                        ) : type === 'multiselect' ? (
                          <MultiSelect
                            edit={false}
                            options={_options} 
                            _id={row[idField]} 
                            selected={getSelected(_options, row[id])}
                             />
                        ) : type === 'token' ? (
                          <TokenComponent title={row['token']} />
                        ):
                        (
                            toString(row[id] || 'N/A')
                        )}
                      </TableCell>
                    ))}
                    {(enabledActions.edit || enabledActions.delete || enabledActions.refresh) && (
                      <TableCell padding="none" align="right">
                        <TableActions
                          onEdit={() => editAction(row)}
                          onDelete={() => deleteAction(row)}
                          onRefresh={() => refreshAction(row)}
                          enabledActions={enabledActions}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <EmptyTable />
            )}
            {!!data.length && data.length < 10 && (
              <TableRow style={{ height: (10 - data.length) * 53 }}>
                <TableCell colSpan={columns.length + 2} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      }
      footer={
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      }
    />
  );
};
