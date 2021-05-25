import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import { Divider, Input } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import { useToast } from '../common/toast';

import {
  getSettings,
  updateSettings
} from '../../utils/api';
import { ScrollContainer } from '../layout';
import { Box, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}));

export const SchedulerSettings = () => {
  const classes = useStyles();
  const [value, setValue] = useState(10);
  const [unit, setUnit] = useState('minute');

  const [batchSize, setBatchSize] = useState(50);

  const [isLoading, setLoading] = useState(false);
  
  const { openToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const fetchSettings = async () => {
      const response = await getSettings();
      if (response.data) {
        const { batchSize, batchingJobTime } = response.data;
        const [batchIntervalTime, batchIntervalUnit] = batchingJobTime.split(' ');
        setBatchSize(batchSize);
        setValue(batchIntervalTime);
        setUnit(batchIntervalUnit);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

 const handleRadioChange = (event) => {
    setUnit(event.target.value);
  };

  const handleBatchSizeChange = (event) => {
    setBatchSize(event.target.value);
  }

  const handleTimeChange = (event) => {
    setValue(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await updateSettings(
      { 
        "batchingJobTime": `${value} ${unit}`,
        "batchSize": `${batchSize}`
      });
    
    if (response.data) {
      openToast({ message: "Updated Settings", status: 'success' });
    }
  };

  return (
    <ScrollContainer
        body={
            <Paper>
                <Box p={2}>
                <Typography variant="h5">Batch Scheduler Settings</Typography>
                 <form onSubmit={handleSubmit}>
                 <FormControl component="fieldset">
                  <RadioGroup row aria-label="position" name="scheduler" defaultValue="minute" value={unit} onChange={handleRadioChange}>
                    <Box style={{ marginRight: 20 }}>
                    <Input 
                      type='number' 
                      name="batchingJobTime"
                      value={value || 10}
                      required={true} 
                      onChange={handleTimeChange}
                      placeholder="Enter interval in digits starting from 1" />
                    </Box>
                    <FormControlLabel
                      value="minute"
                      control={<Radio color="primary" />}
                      label="Minute"
                    />
                    <FormControlLabel
                      value="hour"
                      control={<Radio color="primary" />}
                      label="Hour"
                    />
                    <FormControlLabel
                      value="day"
                      control={<Radio color="primary" />}
                      label="Day"
                    />
                  </RadioGroup>
                  
                </FormControl>
                </form>
                </Box>
                <Divider />
                <Box p={2}>
                <Typography variant="h5">Batch Size Limit</Typography>
                 <form onSubmit={handleSubmit}>
                 <FormControl component="fieldset">
                    <Box>
                      <Input
                        name="batchSize"
                        style={{ marginRight: 20 }} 
                        type='number'
                        value={batchSize || 50} 
                        required={true}
                        onChange={handleBatchSizeChange}
                        placeholder="Enter Batch Threshold" />
                    </Box>
                    <Button 
                      style={{ width: 100 , marginTop: 10}} 
                      type="submit" 
                      variant="contained"
                      color="primary"
                      className={classes.button}>
                      Save
                    </Button>
                </FormControl>
                </form>
                </Box>
            </Paper>
        }
     />
  );
}
