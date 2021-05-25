import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

export const Notes = ({
  title = 'Notes',
  notes = [],
  onConfirm,
  onCancel
}) => {
  const [note, setNote] = useState('');

  return (
    <Box display="flex" flexDirection="column">
      <Box py={1}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Divider />

      <Box py={3}>
        <Box pb={2}>
          {notes.map(noteObj => {
            const { note = '', createdBy = {} } = noteObj;
            return (
              <Box key={note + createdBy._id} position="relative" py={1}>
                <Box>
                  <Typography variant="body2">{note}</Typography>
                </Box>
                <Box pl={2} position="absolute" right="0" bottom="0">
                  <Typography variant="caption" style={{ fontStyle: 'italic' }}> - {createdBy.firstName}</Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          onChange={(event) => setNote(event.target.value)}
          value={note}
          multiline
          placeholder="Add notes"
          variant="outlined"
        />
      </Box>
      <Divider />

      <Box display="flex" justifyContent="flex-end" py={1}>
        <Box px={1}>
          <Button variant="outlined" onClick={onCancel} color="primary">Cancel</Button>
        </Box>
        <Box px={1}>
          <Button variant="contained" onClick={() => onConfirm(note)} color="primary">Confirm</Button>
        </Box>
      </Box>

    </Box>
  );
};
