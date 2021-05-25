import React from 'react';
import Typography from '@material-ui/core/Typography';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export const EmptyTable = () => {
  return (
    <TableRow style={{ height: 5 * 53 }}>
      <TableCell colSpan={6}>
        <Typography variant="caption" component="div" align="center">There is nothing to display.</Typography>
      </TableCell>
    </TableRow>
  );
}
