import { GET, POST } from './';

export const connectToDropbox = (accessCode) => POST('/dropbox/connect', { accessCode });
export const checkFolderExistsDropbox = (path) => GET(`/dropbox/exists?path=${path}`);
