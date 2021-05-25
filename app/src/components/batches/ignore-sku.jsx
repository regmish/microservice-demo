import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { DataTable } from '../common/table/data-table';
import { useToast } from '../common/toast';

import {
  getVirtualSkus,
  addVirtualSku,
  updateVirtualSku,
  deleteVirtualSku,
  uploadVirtualSKUs
} from '../../utils/api';

export const VirtualSKU = () => {
  const [isLoading, setLoading] = useState(false);
  const [skus, setSkus] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { openToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const fetchSkus = async () => {
      const response = await getVirtualSkus();
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setSkus(data);
        setCount(count);
      }
      setLoading(false);
    };
    fetchSkus();
  }, []);

  const dataTableOptions = {
    title: 'SKUs',
    isLoading,
    searchTerm,
    options: {
      accept: '.csv'
    },
    columns: [{
      id: 'sku',
      title: 'SKU',
    }, {
      id: 'name',
      type: 'text',
      title: 'Name',
    },{
      id: 'display',
      type: 'switch',
      title: 'Show on Slip',
    }],
    validations: {
      sku: Yup.string().max(255).required('SKU is required'),
    },
    onSearch: async (sku) => {
      setSearchTerm(sku);
      setLoading(true);
      const params = sku ? { sku } : {};
      const response = await getVirtualSkus(params);
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setSkus(data);
        setCount(count);
      }
      setLoading(false);
    },
    onPaginate: async ({ page, rowsPerPage }) => {
      setLoading(true);
      const params = searchTerm ? { sku: searchTerm } : {};
      const response = await getVirtualSkus({ ...params, limit: rowsPerPage, skip: page * rowsPerPage  });
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setSkus(data);
        setCount(count);
      }
      setLoading(false);
    },
    onAddNew: async (rowData) => {
      setLoading(true);
      const response = await addVirtualSku(rowData);
      if (response.data) {
        setSkus([...skus, response.data]);
        setCount(count + 1);
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
      const response = await updateVirtualSku(rowData._id, rowData);
      if (response.data) {
        const newSKus = [...skus];
        const index = newSKus.findIndex(p => p._id === rowData._id);
        newSKus.splice(index, 1, response.data);
        setSkus(newSKus);
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
      const response = await deleteVirtualSku(rowData._id);
      if (response.data) {
        const newSKus = [...skus]
          .filter(p => p._id !== rowData._id);
        setSkus(newSKus);
        setCount(count - 1);
        setLoading(false);
        return true;
      }
      if (response.error) {
        setLoading(false);
        openToast({ message: response.error.message, status: 'error' });

      }
    },
    onFileUpload: async (file) => {
      const formData = new FormData();
      if (file instanceof File) {
        formData.append('virtualSKUs', file);
      }
      if (!formData.has('virtualSKUs')) formData.append('virtualSKUs', '');
      setLoading(true);
      const response = await uploadVirtualSKUs(formData);
      if (response.data) {
        setSkus(response.data);
        setCount(response.data.length);
        setLoading(false);
      }
      if (response.error) {
        setLoading(false);
        openToast({ message: response.error.message, status: 'error' });
      }
      return true;
    }
  };
  return (
    <DataTable data={skus} count={count} options={dataTableOptions} />
  );
}
