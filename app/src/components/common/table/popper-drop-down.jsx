import React, { useEffect, useState } from 'react';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Button,
  Divider,
} from '@material-ui/core';
import { Popper } from '../popper/popper';
import { useToast } from '../../common/toast';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 0),
    width: 60,
    height: 25,
  }
}));

  const ChannelSelectComponent = ({ channels=[], state={}, error='', errorMessage='', handleState, options=[], handleSubmit }) => {
    const classes = useStyles();
    const [allChecked, setAllChecked] = useState(false);
    const [checked, setChecked] = useState([]);

    useEffect(()=> {
      let checked = Object.keys(state).filter((checked) => state[checked]===true);
      setChecked(checked)
    }, [state]);

    const selectAll = () => {
      let newState = {};
      options.forEach((channel) => {
        newState[`${channel.channelId}`] = true
      });
      handleState(newState);
    }

    const unselectAll = () => {
      let newState = {};
      options.forEach((channel) => {
        newState[`${channel.channelId}`] = false
      });
      handleState(newState);
    }

    const handleSelectAll = (event) => {
      if (event.target.checked) {
        setAllChecked(!allChecked);
        selectAll();
      }
      else {
        setAllChecked(!allChecked);
        unselectAll();
      }
    }

    const handleChange = (event) => {
      handleState({ ...state, [event.target.name]: event.target.checked } );
    };

    return (
      <Box py={2} px={1} display="flex" flexDirection="column" >
        <Box display="flex" flexDirection="row" justifyContent="space-around" >
        <FormControl component="fieldset" className={classes.formControl}>
          <FormControlLabel
                  control={<Checkbox checked={allChecked} onChange={handleSelectAll} name="selectAll" />}
                  label={"Select All"}
                />
          </FormControl>
                <Button
                    className={classes.submit}
                    color="primary"
                    fullWidth
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!checked.length}
                  >
                    save
                  </Button>
          
        </Box>
        <Divider />
       <FormControl required error={error} component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Select Channels</FormLabel>
        
        <FormGroup>
          {
            channels.map((channel) => (
              <FormControlLabel
                control={<Checkbox checked={state[channel.channelId] || false} onChange={handleChange} name={channel.channelId } />}
                label={channel.name}
                key={channel.channelId}
              />
            ))
          }
        </FormGroup>
        { error && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
      </Box>
    )
  }

export const PopperDropDown = ({ options = [], selected = [], _id, onMultiSelectChannels }) => {
  const [state, setState] = useState({});
  const { openToast } = useToast();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let newState = {};
    options.forEach((channel) => {
      newState[`${channel.channelId}`] = selected.includes(channel.channelId)
    });
    setState(newState); 
  }, [options]);

  const handleSubmit = async () => {
    const selectedChannels = Object.keys(state).filter((channel) => state[channel]===true);
    let result = '';
    try{
      result = await onMultiSelectChannels(_id, {channelIds: selectedChannels });
      openToast({ message: 'channel saved successfully', status: 'success' });

    } catch (error) {
      console.log('error',error);
    }
    
    if (result.error) {
      setError(true);
      openToast({ message: result.error, status: 'error' });
      setErrorMessage(result.error);
    }
  }

  const handleState = (newState) => {
    setState(newState);
  }

  return (
    <Popper
      key={_id}
      isOpen={isOpen}
      placement="right-start"
      onClickAway={() => setIsOpen(false)}
      popperContent={ChannelSelectComponent}
      popperContentProps={{
        onClose: () => setIsOpen(false),
        handleSubmit,
        handleState,
        channels: options,
        state,
        error,
        errorMessage,
        options,
      }}
      modifiers={{
        flip: true,
        preventOverflow: true,
      }}
      noPadding
      disablePortal={false}
    >
      <IconButton onClick={() => setIsOpen(true)}>
        <ViewModuleIcon />
      </IconButton>
      </Popper>
  )
}
