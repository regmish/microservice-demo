import { useContext } from 'react';
import { AuthContext } from '../providers'

export const useAuthData = () => useContext(AuthContext);
