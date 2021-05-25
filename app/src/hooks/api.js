import { useContext } from 'react';
import { APIContext } from '../providers'

export const useAPI = () => useContext(APIContext);
