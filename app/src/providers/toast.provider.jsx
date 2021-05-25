import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

export const ToastProviderContext = React.createContext({});
const ToastProviderConsumer = ToastProviderContext.Consumer;

const ToastProvider = ({ children }) => {
  const initialToastState = {
    isOpen: false,
    toastProps: {},
  };

  const [toastState, setToastState] = useState(initialToastState);

  const showToast = payload => setToastState(prevState => ({ ...prevState, ...payload, isOpen: true }));
  const hideToast = () => setToastState(prevState => ({ ...prevState, isOpen: false }));

  const contextValue = {
    showToast,
    hideToast,
    ...toastState,
  };

  return (
    <ToastProviderContext.Provider value={contextValue}>
      <Fragment>{children}</Fragment>
    </ToastProviderContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const withToast = Component => props => (
  <ToastProviderConsumer>{toastProps => <Component {...toastProps} {...props} />}</ToastProviderConsumer>
);

export { ToastProvider };
