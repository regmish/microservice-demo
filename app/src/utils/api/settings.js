import { GET, PATCH, POST } from './';

export const getSettings = () => GET('/settings');
export const getJobs = () => GET('/scheduler');
export const scheduleNow = (id) => PATCH(`/scheduler/${id}/schedule-now`, {});
export const enableJob = (id) => PATCH(`/scheduler/${id}/enable`, {});
export const disableJob = (id) => PATCH(`/scheduler/${id}/disable`, {});
export const searchOrders = (orderNumber) => GET(`/shipstation/search?orderNumber=${orderNumber}`);
export const updateSettings = (data) => POST('/settings', data);
