import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { DataTable } from '../common/table/data-table';

import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment
 } from '../../utils/api';

export const Departments = () => {
  const [isLoading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (!departments.length) {
      setLoading(true);
      const fetchDepartments = async () => {
        const response = await getDepartments();
        if (response.data && response.data.length) {
          setDepartments(response.data);
        }
        setLoading(false);
      };
      fetchDepartments();
    }
  }, [departments])

  const dataTableOptions = {
    title: 'Departments',
    isLoading,
    columns: [{
      id: 'name',
      type: 'text',
      title: 'Name',
    }],
    validations: {
      name: Yup.string().max(255).required('Name is required'),
    },
    onAddNew: async (rowData) => {
      setLoading(true);
      const response = await addDepartment(rowData);
      if (response.data) {
        setDepartments([...departments, response.data]);
        setLoading(false);
        return true;
      }
    },
    onEditRow: async (rowData) => {
      setLoading(true);
      const response = await updateDepartment(rowData._id, rowData);
      if (response.data) {
        const data = [...departments];
        const index = departments.findIndex(p => p._id === rowData._id);
        data.splice(index, 1, rowData)
        setDepartments(data);
        setLoading(false);
        return true;
      }
    },
    onDeleteRow: async (rowData) => {
      setLoading(true);
      const response = await deleteDepartment(rowData._id);
      if (response.data) {
        const newDepartments = [...departments]
          .filter(p => p._id !== rowData._id);
        setDepartments(newDepartments);
        setLoading(false);
        return true;
      }
    }
  };

  return (
    <DataTable data={departments} options={dataTableOptions} />
  );
}
