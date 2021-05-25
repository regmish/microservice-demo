import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import moment from 'moment';
import { useAPI } from '../../hooks/api';
import { DataTable } from '../../components/common/table/data-table';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { getUsers, addUser, updateUser, deleteUser } = useAPI();

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      const response = await getUsers();
      response && setUsers(response);
      setLoading(false);
    };
    fetchUsers();
  }, [getUsers]);

  const userRoles = [{
    id: 'USER',
    label: 'Basic User'
  }, {
    id: 'ADMIN', label: 'Admin'
  }, {
    id: 'DESIGNER', label: 'Designer'
  }, {
    id: 'PRODUCTION', label: 'Production'
  }, {
    id: 'SHIPPING', label: 'Shipping'
  }];

  const dataTableOptions = {
    title: 'Users',
    isLoading,
    columns: [
      {
        id: 'firstName',
        type: 'text',
        title: 'First Name',
      },
      {
        id: 'lastName',
        type: 'text',
        title: 'Last Name',
      },
      {
        id: 'email',
        type: 'text',
        title: 'Email',
      },
      {
        id: 'password',
        type: 'password',
        title: 'Password',
      },
      {
        id: 'role',
        type: 'options',
        title: 'Role',
        options: userRoles
      },
      {
        id: 'verified',
        type: 'switch',
        title: 'Status',
      },
      {
        id: 'lastActive',
        type: 'other',
        title: 'Last Active',
      },
    ],
    validations: {
      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      email: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: !isEditing
        ? Yup.string()
          .max(50)
          .min(8, 'Minimum 8 characters')
          .required('Password is required')
        : Yup.string().max(50).min(8, 'Minimum 8 characters'),
    },
    onAddNew: async (rowData) => {
      setLoading(true);
      const response = await addUser(rowData);
      if (response) {
        setUsers([...users, response]);
      }
      setLoading(false);
      return true;
    },
    onEditRow: async (rowData) => {
      setLoading(true);
      const response = await updateUser(rowData._id, rowData);
      if (response) {
        const newUsers = [...users]
        const index = newUsers.findIndex(p => p._id === rowData._id);
        newUsers.splice(index, 1, response);
        setUsers(newUsers);
      }
      setLoading(false);
      return true;
    },
    onDeleteRow: async (rowData) => {
      setLoading(true);
      const response = await deleteUser(rowData._id);
      if (response) {
        const newUsers = [...users].filter((p) => p._id !== rowData._id);
        setUsers(newUsers);
      }
      setLoading(false);
      return true;
    },
    onFormOpen: (mode) => {
      setIsEditing(mode === 'edit');
    },
  };

  return <DataTable data={users.map(user => ({ ...user, lastActive: user?.loginActivity?.at ? moment(user?.loginActivity?.at).fromNow() : 'Never' }))} options={dataTableOptions} />;
};
