import React, { useRef, useState } from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import { CancelOutlined, Backup, FileCopy } from '@material-ui/icons';

export const FileUploader = ({ fileName = '', options = {}, onChange }) => {
  const inputRef = useRef(null);
  const [file, setFile] = useState(
    new File([''], fileName || '', { type: 'application/kfpx' })
  );
  const startUpload = () => {
    inputRef.current.click();
  };

  const handleChange = (event) => {
    setFile(event.target.files[0]);
    onChange(event.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    onChange(null);
  };

  return (
    <Box px={2} display="flex" alignItems="center">
      <input
        hidden
        type="file"
        accept={options.accept || '*'}
        ref={inputRef}
        onChange={handleChange}
      />
      {!file?.name && (
        <Tooltip title="Upload">
          <IconButton size="small" onClick={startUpload}>
            <Backup color={file?.name ? 'primary' : 'inherit'} />
          </IconButton>
        </Tooltip>
      )}
      {file?.name && (
        <Box position="relative" display="flex" width="fit-content">
        <Box display="flex" alignItems="center">
          <FileCopy fontSize="small" />
          {file.name}
        </Box>
          <Box position="absolute" right="-25px">
            <Tooltip title="Remove">
              <IconButton size="small" onClick={removeFile}>
                <CancelOutlined
                  htmlColor="#E53935"
                  style={{ fontSize: '1rem' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};
