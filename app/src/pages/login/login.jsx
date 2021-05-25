import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { LoginForm } from '../../components/form';
import { AuthContext } from '../../providers';
import { useAPI } from '../../hooks';

export const Login = () => {
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const { login } = useAPI();

  const form = {
    values: {
      email: '',
      password: '',
    },
    rules: Yup.object().shape({
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup.string().max(255).required('password is required'),
    }),
  };

  const submit = async (data, { setStatus }) => {
    const response = await login(data);
    if (!response) {
      setStatus('Error Login. Please check data and try again.');
    } else {
      authContext.setUserData(response);
      history.push('/');
    }
  };

  return (
    <Formik
      initialValues={form.values}
      validationSchema={form.rules}
      onSubmit={submit}
    >
      {(formProps) => <LoginForm {...formProps} />}
    </Formik>
  );
};
