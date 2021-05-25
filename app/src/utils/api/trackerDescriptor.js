import { GET, POST, PATCH, DELETE } from './';

export const getTrackerDescriptors = () => GET('/tracker-descriptors');
export const addTrackerDescriptor = (data) => POST('/tracker-descriptors', data);
export const updateTrackerDescriptor = (id, data) => PATCH(`/tracker-descriptors/${id}`, data);
export const deleteTrackerDescriptor = (id) => DELETE(`/tracker-descriptors/${id}`);
