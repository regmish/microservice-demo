import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import each from 'lodash/each';

import { DataTable } from '../common/table/data-table';

import {
  getDepartments,
  getChannels,
  getProductionGroups,
  addProductionGroup,
  deleteProductionGroup,
  updateProductionGroup,
  onMultiSelectChannelsProductionGroup,
} from '../../utils/api';

export const ProductionGroups = () => {
  const [isLoading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([])
  const [channels, setChannels] = useState([]);
  const [productionGroups, setProductionGroups] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchDepartments = async () => {
      const response = await getDepartments();
      if (response.data && response.data.length) {
        setDepartments(response.data);
      }
      setLoading(false);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchProductionGroups = async () => {
      const response = await getProductionGroups({});
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setProductionGroups(data);
        setCount(count);
      }
      setLoading(false);
    };
    fetchProductionGroups();
  }, [])

  useEffect(() => {
    setLoading(true);
    const fetchChannels = async () => {
      const response = await getChannels();
      if (response.data && response.data.length) {
        setChannels(response.data);
      }
      setLoading(false);
    };
    fetchChannels();
  }, []);

  const productionMethods = [{
    id: 'STANDARD',
    label: 'Standard'
  },
  {
    id: 'MANUAL',
    label: 'Manual'
  }
];

const onMultiSelectChannels =  async (id, data) => {
  const response = await onMultiSelectChannelsProductionGroup(id, data);
  if (response.data) {
    return response.data;
  }
}

  const dataTableOptions = {
    title: 'Production Groups (List)',
    isLoading,
    columns: [{
      id: 'name',
      title: 'Group Name',
    }, {
      id: 'department',
      type: 'options',
      title: 'Departments',
      options: departments.map(department => ({ id: department._id, label: department.name }))
    }, {
      id: 'channels',
      type: 'popper',
      title: 'Channels',
      options: {
        channels,
        onMultiSelectChannels,
      }
    },{
      id: 'productionMethod',
      title: 'Production Method',
      type: 'options',
      options: productionMethods
    }, {
      id: 'trackerLayout',
      title: 'Tracker Layout'
    }, {
      id: 'pdfToolboxProfile',
      title: 'PDF Toolbox Profile',
      type: 'file',
      options: {
        accept: '.kfpx'
      }
    }],
    validations: {
      name: Yup.string().max(255).required('Name is required'),
      department: Yup.string().max(30).required('Department is required'),
    },
    onSearch: async (name) => {
      setSearchTerm(name);
      setLoading(true);
      const params = name ? { name } : {};
      const response = await getProductionGroups(params);
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setProductionGroups(data);
        setCount(count);
      }
      setLoading(false);
    },
    onPaginate: async ({ page, rowsPerPage }) => {
      setLoading(true);
      const params = searchTerm ? { name: searchTerm } : {};
      const response = await getProductionGroups({ ...params, limit: rowsPerPage, skip: page * rowsPerPage });
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setProductionGroups(data);
        setCount(count);
      }
      setLoading(false);
    },
    onAddNew: async (rowData) => {
      const formData = new FormData();
      if (rowData.pdfToolboxProfile instanceof File) {
        formData.append('pdfToolboxProfile', rowData.pdfToolboxProfile);
      }

      each(rowData, (value, key) => {
        if(key !== 'pdfToolboxProfile') {
          formData.append(key, value);
        }
      });
      if(!formData.has('pdfToolboxProfile')) formData.append('pdfToolboxProfile', '');
      setLoading(true);
      const response = await addProductionGroup(formData);
      if (response.data) {
        setProductionGroups([...productionGroups, response.data]);
        setLoading(false);
        return true;
      }
    },
    onEditRow: async (rowData) => {
      const formData = new FormData();

      if (rowData.pdfToolboxProfile instanceof File) {
        formData.append('pdfToolboxProfile', rowData.pdfToolboxProfile);
      }

      each(rowData, (value, key) => {
        if(key !== 'pdfToolboxProfile') {
          formData.append(key, value);
        }
      });

      if(!formData.has('pdfToolboxProfile')) formData.append('pdfToolboxProfile', '');
      setLoading(true);
      const response = await updateProductionGroup(rowData._id, formData);
      if (response.data) {
        const newProductionGroups = [...productionGroups];
        const index = productionGroups.findIndex(p => p._id === rowData._id);
        newProductionGroups.splice(index, 1, response.data);
        setProductionGroups(newProductionGroups);
      }
      setLoading(false);
      return true;
    },
    onDeleteRow: async (rowData) => {
      setLoading(true);
      const response = await deleteProductionGroup(rowData._id);
      if (response.data) {
        const newProductionGroups = [...productionGroups]
          .filter(p => p._id !== rowData._id);
        setProductionGroups(newProductionGroups);
        setLoading(false);
        return true;
      }
    }
  };
  return (
    <DataTable data={productionGroups} count={count} options={dataTableOptions} />
  );
}
