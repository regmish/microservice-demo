import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';

export const TableHeader = ({
  columns = [],
  count,
  selectedCount = 0,
  selectAll,
  enabledActions
}) => {

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selectedCount > 0 && selectedCount < count}
            checked={count > 0 && selectedCount === count}
            onChange={selectAll}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={column.id}
          >
            {column.title}
          </TableCell>
        ))}
        {(enabledActions.edit || enabledActions.delete) && <TableCell/>}
      </TableRow>
    </TableHead>
  );
}
