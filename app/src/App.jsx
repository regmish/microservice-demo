import React from 'react';
import { Router } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import {
  APIProvider,
  ModalProvider,
  AuthProvider,
  ToastProvider,
} from './providers';
import { theme } from './theme';
import Routes from './Routes';
import { Modal } from './components/common/modal/modal';
import { Toast } from './components/common/toast/toast';

export const AppHistory = createBrowserHistory();

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <ModalProvider>
          <APIProvider>
            <AuthProvider>
              <Router history={AppHistory}>
                <Routes />
              </Router>
              <Modal />
              <Toast />
            </AuthProvider>
          </APIProvider>
        </ModalProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
