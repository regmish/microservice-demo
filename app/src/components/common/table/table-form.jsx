import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from '@material-ui/core';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Dropdown } from '../dropdown';
import  { MultiSelect }  from '../multiselect';
import { FileUploader } from '../file-uploader';
import { TokenComponent } from '../token';

const ActionButtons = ({ submit, cancel }) => (
  <TableCell padding="none" align="right">
    <Box pr={3} display="flex" justifyContent="space-evenly">
      <Tooltip title="Save" onClick={submit}>
        <IconButton aria-label="save" size="small">
          <DoneIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Cancel"
        onClick={(ev) => {
          ev.stopPropagation();
          cancel();
        }}
      >
        <IconButton aria-label="cancel" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </TableCell>
);

const useStyles = makeStyles((theme) => ({
  textField: {
    '&.MuiFormControl-root': {
      padding: theme.spacing(0, 1),
      '& .MuiFormLabel-root': {
        fontSize: '10px',
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(1),
      },
      '& .MuiFormHelperText-root.Mui-error': {
        fontSize: '9px',
        marginTop: 1,
      },
    },
  },
}));

export const TableForm = ({
  getSelected = () => {},
  values = {},
  columns = [],
  validations = {},
  submit = () => {},
  cancel = () => {},
}) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={values}
      validationSchema={Yup.object().shape(validations)}
      onSubmit={submit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
      }) => (
        <TableRow>
          <TableCell />
          {columns.map((column) => {
            const { id, type, title } = column;
            const textFieldProps = {
              className: classes.textField,
              error: Boolean(touched[id] && errors[id]),
              fullWidth: true,
              helperText: touched[id] && errors[id],
              label: title,
              margin: 'dense',
              name: id,
              onBlur: handleBlur,
              onChange: handleChange,
              value: values[id] || '',
              size: 'small',
              type,
            };

            return (
              <TableCell key={id} padding="none">
                {type === 'options' ? (
                  <Dropdown
                    options={column.options}
                    value={values[id]}
                    inputProps={textFieldProps}
                    onChange={(value) => {
                      setFieldValue(id, value.id);
                    }}
                  />
                ) : type === 'switch' ? (
                  <Switch
                    name={id}
                    checked={values[id] || false}
                    onChange={handleChange}
                  />
                ) : type === 'file' ? (
                  <FileUploader fileName={values[id]} options={column.options} onChange={(file) => setFieldValue(id, file)} />
                ) : type === 'other' ? (
                  <Typography variant="caption">{values[id]}</Typography>
                ) : type === 'popper' ? (
                  <div/>
                ) : type === 'multiselect' ? (
                  <MultiSelect
                    edit={true}
                    value={values[id]}
                    options={column.options}
                    selected={getSelected(column.options, values[id])}
                    onChange={(value) => {
                      setFieldValue(id, value)
                    }} 
                    _id={id} />
                ) : type === 'token' ? (
                  <TokenComponent  title="N/A" />
                ) :
                (
                  <TextField {...textFieldProps} />
                )}
              </TableCell>
            );
          })}
          <ActionButtons submit={handleSubmit} cancel={cancel} />
        </TableRow>
      )}
    </Formik>
  );
};
