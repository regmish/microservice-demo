import { GET, PATCH } from './';

export const getBins = (params) => GET('/bins', params);
export const getBinnedItems = (binId) => GET(`/bins/${binId}/items`);
export const clearBin = (binId) => PATCH(`/bins/${binId}/clear`);
