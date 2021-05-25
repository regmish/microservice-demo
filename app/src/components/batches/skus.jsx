import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';

import { DataTable } from '../common/table/data-table';
import { useToast } from '../common/toast';

import {
  getSkus,
  getProductionGroups,
  getTrackerDescriptors,
  addSku,
  deleteSku,
  updateSku,
  uploadSKUs,
} from '../../utils/api';

export const SKUS = () => {
  const [isLoading, setLoading] = useState(false);
  const [productionGroups, setProductionGroups] = useState([]);
  const [trackerDescriptors, setTrackerDescriptors] = useState([]);
  const [skus, setSkus] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { openToast } = useToast();

  useEffect(() => {
    setLoading(true);
    const fetchProductionGroups = async () => {
      const response = await getProductionGroups();
      if (response.data) {
        const { data = [] } = response.data;
        setProductionGroups(data);
      }
      setLoading(false);
    };
    fetchProductionGroups();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchTrackerDescriptors = async () => {
      const response = await getTrackerDescriptors();
      if (response.data) {
        setTrackerDescriptors(response.data);
      }
      setLoading(false);
    };
    fetchTrackerDescriptors();
  }, [])

  useEffect(() => {
    setLoading(true);
    const fetchSkus = async () => {
      const response = await getSkus();
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
      id: 'productionGroup',
      type: 'multiselect',
      title: 'Production Group',
      options: productionGroups.map(pg => ({ id: pg._id, label: pg.name, channels: pg.channels }))
    }, {
      id: 'trackerDescriptor',
      type: 'options',
      title: 'Tracker Descriptor',
      options: trackerDescriptors.map(td => ({ id: td._id, label: td.name }))
    }],
    validations: {
      sku: Yup.string().max(255).required('SKU is required'),
      productionGroup: Yup.array().required('Production group is required'),
      trackerDescriptor: Yup.string().max(30).required('Tracker descriptor is required'),
    },
    onSearch: async (sku) => {
      setSearchTerm(sku);
      setLoading(true);
      const params = sku ? { sku } : {};
      const response = await getSkus(params);
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
      const response = await getSkus({ ...params, limit: rowsPerPage, skip: page * rowsPerPage  });
      if (response.data) {
        const { count = 0, data = [] } = response.data;
        setSkus(data);
        setCount(count);
      }
      setLoading(false);
    },
    onAddNew: async (rowData) => {
      setLoading(true);
      const response = await addSku(rowData);
      if (response.data) {
        setSkus([response.data, ...skus]);
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
      const response = await updateSku(rowData._id, rowData);
      if (response.data) {
        const newSKus = [...skus];
        const index = newSKus.findIndex(p => p._id === rowData._id);
        newSKus.splice(index, 1, rowData);
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
      const response = await deleteSku(rowData._id);
      if (response.data) {
        const newSKus = [...skus]
          .filter(p => p._id !== rowData._id);
        setSkus(newSKus);
        setCount(count - 1);
        setLoading(false);
        return true;
      }
    },
    onFileUpload: async (file) => {
      const formData = new FormData();
      if (file instanceof File) {
        formData.append('skus', file);
      }
      if (!formData.has('skus')) formData.append('skus', '');
      setLoading(true);
      const response = await uploadSKUs(formData);
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
