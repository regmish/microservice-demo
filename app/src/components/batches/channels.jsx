import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { DataTable } from '../common/table/data-table';
import { useToast } from '../common/toast';

import {
  getChannels,
  addChannel,
  updateChannel,
  deleteChannel
 } from '../../utils/api';

export const Channels = () => {
  const [isLoading, setLoading] = useState(false);
  const [channels, setChannels] = useState([]);
  const { openToast } = useToast();

  useEffect(() => {
    if (!channels.length) {
      setLoading(true);
      const fetchChannels = async () => {
        const response = await getChannels();
        if (response.data && response.data.length) {
          setChannels(response.data);
        }
        setLoading(false);
      };
      fetchChannels();
    }
  }, [channels])

  const dataTableOptions = {
    title: 'Channels',
    isLoading,
    columns: [
      {
        id: 'channelId',
        type: 'text',
        title: 'Channel ID',
      },
      {
      id: 'name',
      type: 'text',
      title: 'Name',
    },
    // TODO add toggle button in future for making active and inactive
    // {
    //   id: 'active',
    //   type: 'toggle',
    //   title: 'Active'
    // },
  ],
    validations: {
      name: Yup.string().max(255).required('Name is required'),
      channelId: Yup.string().max(10).required('Channel ID is required'),
    },
    onAddNew: async (rowData) => {
      setLoading(true);
      const response = await addChannel(rowData);
      if (response.data) {
        setChannels([...channels, response.data]);
        setLoading(false);
        return true;
      }
      if (response.error) {
        setLoading(false);
        openToast({ message: response.error.message, status: 'error' });

      }
    },
    onEditRow: async (rowData) => {
      setLoading(true);
      const response = await updateChannel(rowData._id, rowData);
      if (response.data) {
        const data = [...channels];
        const index = channels.findIndex(p => p._id === rowData._id);
        data.splice(index, 1, rowData)
        setChannels(data);
        setLoading(false);
        return true;
      }
      if (response.error) {
        setLoading(false);
        openToast({ message: response.error.message, status: 'error' });

      }
    },
    onDeleteRow: async (rowData) => {
      setLoading(true);
      const response = await deleteChannel(rowData._id);
      if (response.data) {
        const newChannels = [...channels]
          .filter(p => p._id !== rowData._id);
        setChannels(newChannels);
        setLoading(false);
        return true;
      }
      if (response.error) {
        setLoading(false);
        openToast({ message: response.error.message, status: 'error' });

      }
    }
  };

  return (
    <DataTable data={channels} options={dataTableOptions} />
  );
}