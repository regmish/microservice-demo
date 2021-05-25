import { GET, DOWNLOAD, PATCH } from './';

export const getBatches = (params) => GET('/batches', params);
export const getBatchItems = (batchId) => GET(`/batches/${batchId}/items`);
export const downloadLineItems = (batchId) => DOWNLOAD(`/batches/${batchId}/line-items`);
export const printProductionSlip = (batchId) => DOWNLOAD(`/batches/${batchId}/production-slip`);
export const downloadProductionFiles = (batchId, params) => DOWNLOAD(`/batches/${batchId}/production-files`, params);
export const uploadProductionFilePath = (batchId, data) => PATCH(`/batches/${batchId}/production-files`, data);
export const addBatchNotes = (batchId, data) => PATCH(`/batches/${batchId}/note`, data);
export const transitionBatch = (batchId, data) => PATCH(`/batches/${batchId}/transition`, data);
export const bulkBatches = (action, ids) => DOWNLOAD(`/batches/bulk`, { action, ids });
export const refreshBatchOrders = (batchId) => GET(`/batches/${batchId}/refresh-orders`);
