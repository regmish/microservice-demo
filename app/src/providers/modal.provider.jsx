import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';

export const ModalProviderContext = React.createContext({});
const ModalProviderConsumer = ModalProviderContext.Consumer;

export const ModalProvider = ({ children }) => {
  const initialModalState = {
    isOpen: false,
    modalProps: {},
    modalContentProps: {},
    modalContent: null,
  };

  const [modalState, setModalState] = useState(initialModalState);

  const openModal = (payload) => setModalState(prevState => ({ ...prevState, ...payload, isOpen: true }));

  const updateModal = (payload) => {
    setModalState(prevState => ({
      ...prevState,
      modalContentProps: {
        ...prevState.modalContentProps,
        ...payload,
      },
    }));
  };
  const closeModal = () => setModalState(initialModalState);

  const contextValue = {
    openModal,
    updateModal,
    closeModal,
    ...modalState,
  };

  return (
    <ModalProviderContext.Provider value={contextValue}>
      <Fragment>{children}</Fragment>
    </ModalProviderContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const withModal = Component => props => (
  <ModalProviderConsumer>{modalProps => <Component {...modalProps} {...props} />}</ModalProviderConsumer>
);
