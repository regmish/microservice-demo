import React, { useState } from 'react';
import { Box, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { BinFilters } from './bin-filter';

export const BinSearchFilter = ({ filters = {}, setFilters }) => {
  const [term, setTerm] = useState(filters.term);

  return (
    <Box display="flex" alignItems="center" px={1}>
      <Box position="relative" width="100%" display="flex" alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search bins by batch name or order number"
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
      <Box pl={2}>
        <BinFilters filters={filters} setFilters={setFilters} />
      </Box>
    </Box>
  );
};
