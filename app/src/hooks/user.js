import { useContext } from 'react';
import { userDataContext } from '../providers'

export const useUserData = () => useContext(userDataContext);
