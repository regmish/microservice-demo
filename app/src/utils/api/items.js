import { PATCH, POST } from './';

export const addItemNotes = (data) => POST('/items/note', data);
export const flagItem = (itemId, status) => PATCH(`/items/${itemId}/flag`, { status });
