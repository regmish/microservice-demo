import { useContext } from 'react';
import { ToastProviderContext } from '../providers'

export const useToast = () => {
  const context = useContext(ToastProviderContext);

  const openToast = payload => context.showToast(payload);
  const closeToast = () => context.hideToast();

  return { openToast, closeToast };
};
