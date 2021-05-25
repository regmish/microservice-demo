import React from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ReplayIcon from '@material-ui/icons/Replay';

export const TableActions = ({
  onEdit = () => {},
  onDelete = () => {},
  onRefresh = () => {},
  enabledActions = {}
}) => {
  return (
    <Box pr={3} display="flex" justifyContent="space-evenly">
      {enabledActions.refresh && <Tooltip 
        title="Refresh" 
        onClick={(ev) =>  {
          ev.stopPropagation();
          onRefresh();
        }}>
          <IconButton size="small">
                  <ReplayIcon />
                </IconButton>
        </Tooltip>}
      {enabledActions.edit && <Tooltip
        title="Edit"
        onClick={(ev) => {
          ev.stopPropagation();
          onEdit()
        }}
      >
        <IconButton aria-label="edit" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>}
      {enabledActions.delete && <Tooltip
        title="Delete"
        onClick={(ev) => {
          ev.stopPropagation();
          onDelete()
        }}
      >
        <IconButton aria-label="delete" size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>}
    </Box>
  )
}
