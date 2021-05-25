import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { DataTable } from '../../components/common/table/data-table';
import { useToast } from '../../components/common/toast';

import {
  getHooks,
  addHook,
  refreshToken,
  deleteHook,
} from '../../utils/api';

export const HooksSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [count, setCount] = useState(0);
  const { openToast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const fetchHooks = async () => {
      const response = await getHooks();
      if (response.data) {
        const { count = 0, data = [] } = response;
        console.log('data', data);
        setHooks(data);
        setCount(count);
      }
      setIsLoading(false);
    }
    fetchHooks();
  } ,[]);

  const dataTableOptions = {
    title: 'Web Hooks',
    isLoading,
    columns: [
      {
        id: 'url',
        title: 'Allowed URL / Domain',
        type: 'text',
      },
      {
        id: 'token',
        title: 'Authentication Token',
        type: 'token',
      },
    ],
    validations: {
      url: Yup.string().max(255).required('URL i.e domain is required'),
    },
    onAddNew: async (rowData) => {
      setIsLoading(true);
      const response = await addHook(rowData);
      if (response.data) {
        setHooks([...hooks, response.data]);
        setCount(count + 1);
        setIsLoading(false);
        return true;
      }
      if (response.error) {
        setIsLoading(false);
        openToast({ message: response.error.message, status: 'error' });
      }
    },
    onDeleteRow: async (rowData) => {
      setIsLoading(true);
      const response = await deleteHook(rowData._id);
      if (response.data) {
        const newHooks = [...hooks]
          .filter(p => p._id !== rowData._id);
        setHooks(newHooks);
        setCount(count - 1);
        setIsLoading(false);
        return true;
      }
      if (response.error) {
        setIsLoading(false);
        openToast({ message: response.error.message, status: 'error' });
      }
    },
    onRefreshRow: async (rowData) => {
      setIsLoading(true);
      const response = await refreshToken(rowData['_id']);
      if (response.data) {
        const newHooks = [...hooks];
        const index = newHooks.findIndex( p => p._id === rowData._id);
        newHooks.splice(index, 1, response.data);
        setHooks(newHooks);
        setIsLoading(false);
        return true;
      }
      if (response.error) {
        setIsLoading(false);
        openToast({ message: response.error.message, status: 'error'});
      }
    }
  };
  return (
    <DataTable data={hooks} count={count} options={dataTableOptions} />
  );
}