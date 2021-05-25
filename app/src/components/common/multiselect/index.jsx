import React, {useEffect, useState} from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from './Autocomplete';
import { OutlinedChips } from '../chip';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { makeStyles } from '@material-ui/core/styles';
import { map } from 'lodash';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme) => ({
    root: {
      width: 400,
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
    chips: {
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
  }));
  

const Chips = ({data, collisionId}) => {
  const classes = useStyles();
  return <div className={classes.chips}>{data.map((option) => {
    const hasCollide = data.length > 1 ? collisionId.includes(option.id): false;
    return <OutlinedChips key={option.id} label={option.label} hasCollide={hasCollide}/>
  })}</div>
}

export const  MultiSelect = ({
  options = [], 
  selected = [],
  _id,
  edit,
  onChange = (value) => { },
  }) => {
    const classes = useStyles();
    const [availableOptions, setAvailableOptions] = useState(options);
    const [collisionId, setCollisionId] = useState([]);
    const [value, setValue] = useState(selected);

  useEffect(() => {
    updateAvailableOptions(value);
    updateCollisionId(selected);
  }, [value]);

    const updateAvailableOptions = (values) => {
      let selectedChannels = [];
      values.forEach((value) => {
        if(value.channels) selectedChannels.push(...value.channels);
      });
      // check if options has same channel id with selected channel id
      let _availableOptions = [];
      options.forEach((option) => {
        let _channel = option.channels || [];
        let _contains = _channel.some( ai => selectedChannels.includes(ai));
        if (!_contains) {
          _availableOptions.push(option);
        }
      });
      setAvailableOptions(_availableOptions);
    }

    const updateCollisionId = (values) => {
      let _collisionId = [];
      if (values.length > 1) {
        for (let i = 0; i < values.length; i++) {
          for (let j =i + 1; j< values.length; ++j) {
            if(values[i].channels && values[j].channels) {
              if(values[i].channels.some( ai => values[j].channels.includes(ai))) {
                _collisionId.push(values[i].id);
                _collisionId.push(values[j].id);
              }
            }
          }
        }
      }
      setCollisionId(_collisionId);
    }

    const handleOnChange = (event, newValue) => {
      setValue(newValue);
      onChange(map(newValue, 'id'));
    }

  return (
    <div className={classes.root}>
    {
      edit ? (
      <Autocomplete
        size="small"
        multiple
        id={_id}
        options={availableOptions}
        disableCloseOnSelect
        onChange={handleOnChange}
        defaultValue={selected}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.label}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 2 }}
              checked={selected}
            />
            {option.label}
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" size="small" label="Select Production Groups" />
        )}
    /> )
    : <Chips data={selected} key={_id} collisionId={collisionId} />
    }
    </div>
  );
}