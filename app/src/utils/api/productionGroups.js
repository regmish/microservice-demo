import { GET, POST, PATCH, DELETE } from './';

export const getProductionGroups = (params) => GET('/production-groups', params);
export const addProductionGroup = (data) => POST('/production-groups', data);
export const updateProductionGroup = (id, data) => PATCH(`/production-groups/${id}`, data);
export const deleteProductionGroup = (id) => DELETE(`/production-groups/${id}`);
export const selectChannelsProductionGroup = (id, data) => PATCH(`/production-groups/${id}/select-channels`, data);
export const unSelectChannelsProductionGroup = (id, data) => PATCH(`/production-groups/${id}/un-select-channels`, data);
export const onMultiSelectChannelsProductionGroup = (id, data) => PATCH(`/production-groups/${id}/multiple-channels`, data) 
