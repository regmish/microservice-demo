import { useContext } from 'react';
import { ModalProviderContext } from '../providers';

export const useModal = () => {
  const { openModal, updateModal, closeModal } = useContext(ModalProviderContext);

  return { openModal, updateModal, closeModal };
};
