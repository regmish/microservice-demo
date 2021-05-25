import React, { useState, useEffect, useCallback } from 'react';
import { isLoggedIn, setUserToken, clearUserToken } from '../utils/auth';
import { useAPI } from '../hooks/api';

export const userDataContext = React.createContext({});

const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState();
  const { me } = useAPI();

  const setUserData = useCallback((user) => {
    setUser(user);
    setUserToken(user.token);
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      const fetchUser = async () => {
        const response = await me();
        if(response) {
          setUser(response);
        } else {
          clearUserToken();
          window.location.replace('/login');
        }

      }
      fetchUser();
    }
  }, [me]);

  return (
    <userDataContext.Provider
      value={{
        user,
        setUserData
      }}
    >
      {children}
    </userDataContext.Provider>
  );
};

export { UserDataProvider };
