import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ReplayIcon from '@material-ui/icons/Replay';
import moment from 'moment';
import Loading from '../common/loading';
import { Toggle } from '../common/toggle';
import { useAPI } from '../../hooks/api';

export const Jobs = (props) => {
  const [job, setJob] = useState(props.job);
  const [loading, setLoading] = useState(false);
  const { enableJob, disableJob, scheduleNow } = useAPI();

  const jobsNames = {
    AUTOMATIC_BINNING: 'Binning',
    AUTOMATIC_BATCHING: 'Batching',
    GET_ORDERS_FROM_SHIPSTATION_MANUAL: 'Orders Fetching (Manual)',
    GET_ORDERS_FROM_SHIPSTATION_EVERY_HOUR: 'Orders Fetching (Automatic)',
    UPDATE_CUSTOM_FIELD_3_SHIPSTATION_EVERY_HOUR: 'Update CF3 Shipstation',
    AUTOMATIC_ARCHIVE_SHIPPED_BATCHES: 'Archive Batches',
    CHECK_PRODUCTION_FILES_FOR_AUTOMATIC_PENDING_BATCHES: 'Dynamic File Generation',
    DAILY_BATCH_CHECKINS: 'Daily Batch Checkins'
  }

  const scheduleNowClick = async () => {
    setLoading(true);
    const response = await scheduleNow(job._id);
    response && setJob(response);
    setLoading(false);
  };

  const toggleEnableDisable = async (status) => {
    const response = !!status ? await enableJob(job._id) : await disableJob(job._id)
    response && setJob(response);
  }

  return (
    <TableRow hover>
      <TableCell>{props.index + 1}</TableCell>
      <TableCell>{jobsNames[job.name]}</TableCell>
      <TableCell>{job.repeatInterval}</TableCell>
      <TableCell>{moment(job.lastRunAt).fromNow()}</TableCell>
      <TableCell>{moment(job.nextRunAt).format('YYYY-MM-DD hh:mm:ss')}</TableCell>
      <TableCell>
        <Box display="flex" justifyContent="space-evenly" alignItems="center">
        {!loading ?
              <Tooltip title="Run Now" onClick={() => scheduleNowClick(job._id)}>
                <IconButton size="small">
                  <ReplayIcon />
                </IconButton>
              </Tooltip> : <Loading contained size={25} />}

            <Tooltip title={job.disabled ? 'Job Disabled' : 'Job Active'}>
              <Toggle checked={!job.disabled} onChange={(event) => toggleEnableDisable(event.target.checked)} />
            </Tooltip>
        </Box>
      </TableCell>
      <TableCell />
    </TableRow>
  );
}
