import React, { useState } from 'react';
import {
  Box,
  makeStyles,
  Typography,
  IconButton,
  Button,
  Divider,
  Paper,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import {
  CheckCircleOutline,
  CancelOutlined,
  FolderOpen,
} from '@material-ui/icons';
import Loading from '../common/loading';
import { useAPI, useUserData } from '../../hooks';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export const UploadFilesDialog = ({
  title = 'Upload Files',
  dropboxUrl = '',
  onConfirm,
  onCancel,
}) => {
  const classes = useStyles();
  const [folderLink, setFolderLink] = useState(dropboxUrl);
  const [selectedPath, setSelectedPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState([]);
  const { checkFolderExistsDropbox } = useAPI();
  const { user } = useUserData();
  const isEditable = ['ADMIN', 'DESIGNER'].includes(user.role);

  const handleFocus = () => {
    setErrorMessage('');
  };

  const handleBlur = async ({ target: { value = '' } }) => {
    if (value) {
      setLoading(true);
      setResult([]);
      setFolderLink(decodeURI(value));
      try {
        const url = new window.URL(value);
        if (!['www.dropbox.com', 'dropbox.com'].includes(url.host)) {
          throw new Error('Invalid Dropbox URL');
        }
        const path = decodeURI(url.pathname).split('/').pop();
        const searchResult = await checkFolderExistsDropbox(path);
        setLoading(false);

        if (searchResult && searchResult.length) {
          setResult(searchResult);
        } else {
          throw new Error('No results');
        }
      } catch (error) {
        setLoading(false);
        setErrorMessage(error.message);
      }
    }
  };

  const removeProductionFiles = () => {
    onConfirm({ path: '', dropboxUrl: '' }).then(() => {
      onCancel();
    });
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box py={1}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider />
      <Box py={3}>
        <Box pb={1} pl={1}>
          <Typography variant="subtitle2">Link to Folder</Typography>
        </Box>
        <Paper component="div" className={classes.inputContainer}>
          <InputBase
            className={classes.input}
            placeholder="Paste Dropbox link here..."
            disabled={!!dropboxUrl}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={folderLink}
            onChange={(event) => setFolderLink(event.target.value)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleBlur(event);
              }
            }}
          />
          {!!dropboxUrl && isEditable && (
            <Tooltip title="Remove Files">
              <IconButton onClick={removeProductionFiles}>
                <CancelOutlined htmlColor="#E53935" fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Paper>
        <Box>
          {!loading && (
            <List>
              {result.map((r) => (
                <ListItem
                  button
                  key={r.path}
                  onClick={() => setSelectedPath(r.path)}
                >
                  <ListItemIcon>
                    <FolderOpen htmlColor="#3983C5" />
                  </ListItemIcon>
                  <ListItemText primary={r.path.replace(/\//, '')} />
                  <ListItemSecondaryAction>
                    {selectedPath === r.path && (
                      <CheckCircleOutline htmlColor="#52d869" />
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
          <Box pt={2}>
            {loading && <Loading contained size={20} />}
            {errorMessage && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <CancelOutlined htmlColor="#E53935" fontSize="small" />
                <Typography color="error" variant="subtitle2">
                  {errorMessage}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {!dropboxUrl && (
        <Box>
          <Divider />
          <Box display="flex" justifyContent="flex-end" py={1}>
            <Box px={1}>
              <Button variant="outlined" onClick={onCancel} color="primary">
                Cancel
              </Button>
            </Box>
            <Box px={1}>
              <Button
                variant="contained"
                onClick={() => {
                  onConfirm({
                    path: selectedPath,
                    dropboxUrl: folderLink,
                  }).then(() => {
                    onCancel();
                  });
                }}
                disabled={!selectedPath}
                color="primary"
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
