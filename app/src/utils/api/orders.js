import { GET, POST, PATCH } from './';

export const getOrders = (params) => GET('/orders', params);
export const createOrder = (order) => POST('/orders', order);
export const getOrderItems = (orderId) => GET(`/orders/${orderId}/items`);
export const manualBatch = (orderId, data) => PATCH(`/orders/${orderId}/manual-batch`, data);
