import { GET, POST, PATCH, DELETE } from './';

export const getVirtualSkus = (params) => GET('/virtual-skus', params);
export const addVirtualSku = (data) => POST('/virtual-skus', data);
export const updateVirtualSku = (id, data) => PATCH(`/virtual-skus/${id}`, data);
export const deleteVirtualSku = (id) => DELETE(`/virtual-skus/${id}`);
export const uploadVirtualSKUs = (data) => POST(`/virtual-skus/csv`, data);
