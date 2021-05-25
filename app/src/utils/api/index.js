import axios from 'axios';

import { isLoggedIn, getUserToken } from '../auth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3030';

const axiosConfig = () => {
  let config = {
    headers: {}
  };
  if (isLoggedIn()) {
    config.headers.Authorization = getUserToken();
  }
  return config;
}

export const GET = async (endpoint, params = {}) => {
  try {
    const { data } = await axios.get(API_BASE_URL + endpoint, { headers: axiosConfig().headers, params });
    return data;
  } catch (error) {
    return (error.response && error.response.data) || { error };
  }
};

export const DOWNLOAD = (endpoint, params = {}) => {
  return axios.get(API_BASE_URL + endpoint, {
    headers: axiosConfig().headers,
    params,
    responseType: 'blob'
  }).then((response) => {
    let fileName = '';
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      fileName = match.length === 2 ? match[1] : 'file';
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  });
};

export const POST = (endpoint, data) => {
  return axios.post(API_BASE_URL + endpoint, data, axiosConfig()).then(response => {
    if (response.status === 200) {
      return response.data;
    }
  }).catch(error => {
    return (error.response && error.response.data) || { error };
  });
};

export const PATCH = (endpoint, data) => {
  return axios.patch(API_BASE_URL + endpoint, data, axiosConfig()).then(response => {
    if (response.status === 200) {
      return response.data;
    }
  }).catch(error => {
    return (error.response && error.response.data) || { error };
  });
};

export const DELETE = (endpoint) => {
  return axios.delete(API_BASE_URL + endpoint, axiosConfig()).then(response => {
    if (response.status === 200) {
      return response.data;
    }
  }).catch(error => {
    return (error.response && error.response.data) || { error };
  });
};

export * from './users';
