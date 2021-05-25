import { GET, POST, DELETE } from './';

export const getHooks = () => GET('/hooks');
export const addHook = (data) => POST('/hooks/create-token', data);
export const refreshToken = (id) => POST(`/hooks/refresh-token/${id}`);
export const deleteHook = (id) => DELETE(`/hooks/${id}`);
