const AUTH_TOKEN = 'AUTH:TOKEN';

export const getUserToken = () => window.localStorage.getItem(AUTH_TOKEN);

export const isLoggedIn = () => !!getUserToken();

export const setUserToken = (token) => window.localStorage.setItem(AUTH_TOKEN, token);

export const clearUserToken = () => window.localStorage.removeItem(AUTH_TOKEN);

export const logout = () => {
  clearUserToken();
  window.location.href = 'login';
};

