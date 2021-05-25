import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppRounded';

export const DownloadFilesDialog = ({
  title = 'Choose Files Source',
  notes = [],
  onConfirm,
  onCancel,
}) => {
  const [fileSource, setFileSource] = useState('manual');

  const handleChange = (event) => {
    setFileSource(event.target.value);
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box py={1}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider />

      <Box py={3} display="flex" justifyContent="center">
        <FormControl component="fieldset">
          <RadioGroup
            row
            name="fileSource"
            value={fileSource}
            onChange={handleChange}
          >
            <FormControlLabel
              value="automatic"
              control={<Radio />}
              label="Original From Server"
            />
            <FormControlLabel
              value="manual"
              control={<Radio />}
              label="Production Ready"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Divider />

      <Box display="flex" justifyContent="flex-end" py={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={onCancel}
          color="primary"
          style={{ marginRight: '16px' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(fileSource)}
          color="primary"
        >
          <GetAppOutlinedIcon />
        </Button>
      </Box>
    </Box>
  );
};
