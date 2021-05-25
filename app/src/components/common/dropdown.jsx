import React from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  optionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    maxHeight: '300px',
    overflowY: 'auto'
  },
  arrow: {
    position: 'absolute',
    right: 8,
    top: '60%',
    transform: 'translate(0px, -50%)',
    '& .MuiSvgIcon-root': {
      fontSize: '1rem'
    }
  }
}));

export const Dropdown = ({
  options = [],
  value,
  onChange = (value) => { },
  inputProps = {}
}) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [filteredList, setFilteredList] = React.useState(options);

  const initialValue = (options.find(opt => opt.id === value) || {}).label || '';
  const [inputValue, updateInputValue] = React.useState(initialValue);

  const updateInput = (item) => {
    updateInputValue(item.label);
    setMenuOpen(false);
    onChange(item);
  };

  const searchMenuOptions = (event) => {
    const value = event.target.value || '';
    updateInputValue(value);
    const newFilteredList = [...options].filter(({ label }) => label.match(new RegExp(`(${value})`, 'gi')));
    setFilteredList(newFilteredList);
  };

  const handleChange = (event) => {
    searchMenuOptions(event);
    inputProps.onChange && inputProps.onChange(event);
  };

  const textFieldProps = {
    ...inputProps,
    onFocus: () => setMenuOpen(true),
    value: inputValue || '',
    onChange: handleChange
  };

  return (
    <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
      <Box position="relative" width="100%">
        <TextField {...textFieldProps} />
        <span className={classes.arrow} onClick={() => setMenuOpen(true)}>
          <ExpandMoreIcon />
        </span>
        {!!menuOpen && (
          <Box>
            <Paper className={classes.optionsContainer}>
              <List>
                {filteredList.map((item) => (
                  <ListItem key={item.id} onClick={() => { updateInput(item) }} button>
                    <Typography variant="body1">{item.label}</Typography>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  )
};
