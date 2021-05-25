import React from 'react';
import { useToast } from '../components/common/toast';
import * as apis from '../utils/api';

export const APIContext = React.createContext({});

export const APIProvider = ({ children }) => {
  const { openToast } = useToast();
  const wrappedApis = {};

  const wrapper = (functionName) => async (...args) => {
    try {
      const response = await apis[functionName].apply(apis, args);
      if (response && response.data) return response.data;
      if (response && response.error) throw response.error;
    } catch (error) {
      openToast({ status: 'error', message: error.message });
    }
  };

  for (const api in apis) {
    if (apis[api] && typeof apis[api] === 'function') {
      wrappedApis[api] = wrapper(api);
    }
  }

  return (
    <APIContext.Provider value={{ ...wrappedApis }}>
      {children}
    </APIContext.Provider>
  );
};

