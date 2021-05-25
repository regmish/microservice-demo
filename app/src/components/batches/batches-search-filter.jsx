import React, { useState } from 'react';
import { Box, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { BatchFilter } from './batch-filter';
import { DepartmentSelect } from './department-select';

export const BatchesSearchFilter = ({ departments = [], filters = {}, setFilters, setDepartment }) => {
  const [term, setTerm] = useState(filters.term);

  return (
    <Box display="flex" alignItems="center" px={1}>
      <Box position="relative" display="flex" flex="1" alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search batches by batch name or order number"
          inputProps={{
            style: { padding: 12 },
          }}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              setFilters({ ...filters, term });
            }
          }}
        />
        <Box position="absolute" right="15px" bottom="5px">
          <SearchIcon />
        </Box>
      </Box>
      <Box px={2}>
        <DepartmentSelect departments={departments} setDepartment={setDepartment} />
      </Box>
      <Box>
        <BatchFilter filters={filters} setFilters={setFilters} />
      </Box>
    </Box>
  );
};
