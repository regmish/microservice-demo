import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { DataTable } from '../common/table/data-table';

import {
  getTrackerDescriptors,
  addTrackerDescriptor,
  updateTrackerDescriptor,
  deleteTrackerDescriptor
 } from '../../utils/api';

export const TrackerDescriptor = () => {
  const [isLoading, setLoading] = useState(false);
  const [trackerDescriptors, setTrackerDescriptors] = useState([]);

  useEffect(() => {
    if (!trackerDescriptors.length) {
      setLoading(true);
      const fetchDepartments = async () => {
        const response = await getTrackerDescriptors();
        if (response.data && response.data.length) {
          setTrackerDescriptors(response.data);
        }
        setLoading(false);
      };
      fetchDepartments();
    }
  }, [trackerDescriptors])

  const dataTableOptions = {
    title: 'Tracker Descriptors',
    isLoading,
    columns: [{
      id: 'name',
      type: 'text',
      title: 'Name',
    }, {
      id: 'descriptor',
      type: 'text',
      title: 'Descriptor'
    }],
    validations: {
      name: Yup.string().max(255).required('Name is required'),
      descriptor: Yup.string().max(255).required('Descriptor is required'),
    },
    onAddNew: async (rowData) => {
      setLoading(true);
      const response = await addTrackerDescriptor(rowData);
      if (response.data) {
        setTrackerDescriptors([...trackerDescriptors, response.data]);
        setLoading(false);
        return true;
      }
    },
    onEditRow: async (rowData) => {
      setLoading(true);
      const response = await updateTrackerDescriptor(rowData._id, rowData);
      if (response.data) {
        const index = trackerDescriptors.findIndex(p => p._id === rowData._id);
        const newDepartments = [...trackerDescriptors].splice(index, 0, rowData);
        setTrackerDescriptors(newDepartments);
        setLoading(false);
        return true;
      }
    },
    onDeleteRow: async (rowData) => {
      setLoading(true);
      const response = await deleteTrackerDescriptor(rowData._id);
      if (response.data) {
        const newDepartments = [...trackerDescriptors]
          .filter(p => p._id !== rowData._id);
        setTrackerDescriptors(newDepartments);
        setLoading(false);
        return true;
      }
    }
  };

  return (
    <DataTable data={trackerDescriptors} options={dataTableOptions} />
  );
}
