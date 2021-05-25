import { GET, POST, PATCH, DELETE } from './';

export const getSkus = (params) => GET('/skus', params);
export const addSku = (data) => POST('/skus', data);
export const updateSku = (id, data) => PATCH(`/skus/${id}`, data);
export const deleteSku = (id) => DELETE(`/skus/${id}`);
export const uploadSKUs = (data) => POST('/skus/csv', data);
