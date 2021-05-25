import { GET, POST, PATCH, DELETE } from './';

export const getChannels = (params) => GET('/channels', params);
export const addChannel = (data) => POST('/channels', data);
export const updateChannel = (id, data) => PATCH(`/channels/${id}`, data);
export const deleteChannel = (id) => DELETE(`/channels/${id}`);
