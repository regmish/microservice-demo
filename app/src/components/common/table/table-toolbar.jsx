import React, { useState } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';
import PublishIcon from '@material-ui/icons/Publish';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import { FileUploader } from '../file-uploader';

const useStyles = makeStyles((theme) => ({
  highlight: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
  },
  title: {
    flex: '1 1 100%',
  },
}));

const Title = ({ title }) => (
  <Typography variant="h5" id="tableTitle" component="div">
    {title}
  </Typography>
);

const SelectedCount = ({ selectedCount }) => (
  <Typography color="inherit" variant="subtitle1" component="div">
    {selectedCount} selected
  </Typography>
);

export const TableToolbar = ({
  title,
  selectedCount,
  addNew,
  onSearch,
  onFileUpload,
  accept,
  searchTerm,
  enabledActions,
}) => {
  const classes = useStyles();
  const [searchVal, setSearchVal] = useState(searchTerm);
  const [showSearch, toggleSearch] = useState(false);
  const [file, setFile] = useState(null);

  const clearSearch = () => {
    setSearchVal('');
    toggleSearch(false);
    if(searchTerm) onSearch('');
  };

  return (
    <Toolbar className={clsx({ [classes.highlight]: selectedCount > 0 })}>
      <Box display="flex" width="100%" alignItems="center" justifyContent="space-between">
        <Box>
          {selectedCount > 0 ? <SelectedCount selectedCount={selectedCount} /> : <Title title={title} />}
        </Box>
        <Box>
          {selectedCount > 0 ? (
            <Box display="flex">
              &nbsp;
            </Box>
          ) : (
              <Box display="flex" alignItems="center">
                <Slide direction="left" in={showSearch || !!searchTerm} mountOnEnter unmountOnExit>
                  <Box position="relative" display="flex" alignItems="center">
                    <TextField
                      style={{ width: 350 }}
                      placeholder="Search.."
                      fullWidth
                      name="search"
                      type="text"
                      value={searchVal}
                      onChange={(event) => setSearchVal(event.target.value)}
                      onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          onSearch(searchVal);
                        }
                      }}
                    />
                    <Box position="absolute" right={1} style={{ cursor: 'pointer' }}>
                      <IconButton onClick={clearSearch}>
                        <ClearIcon color="action" fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Slide>
                {!showSearch &&
                  <IconButton onClick={() => toggleSearch(!showSearch)}>
                    <SearchIcon />
                  </IconButton>}
                {enabledActions.add && <Tooltip title="Add Entry">
                  <IconButton aria-label="add entry" onClick={() => addNew()}>
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>}
                {
                  enabledActions.upload  &&  <>
                  <FileUploader onChange={(file) => setFile(file)} options={accept} />
                    {file && 
                      <Tooltip title="Upload">
                        <IconButton onClick={()=> onFileUpload(file)}>
                          <PublishIcon color="secondary" />
                        </IconButton>
                      </Tooltip>
                    }
                  </>
                }
              </Box>
            )}

        </Box>
      </Box>
    </Toolbar>
  );
};
