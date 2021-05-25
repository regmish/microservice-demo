import { GET, POST, PATCH, DELETE } from './';

export const getDepartments = (params) => GET('/departments', params);
export const addDepartment = (data) => POST('/departments', data);
export const updateDepartment = (id, data) => PATCH(`/departments/${id}`, data);
export const deleteDepartment = (id) => DELETE(`/departments/${id}`);
