import React from 'react';
import ReactDOM from 'react-dom';
import DialogContent from '@material-ui/core/DialogContent';
import { ModalContainer } from './modal-container';
import { withModal } from '../../../providers';

const Modal = ({
  isOpen,
  closeModal = () => {},
  modalProps = {},
  modalContentProps = {},
  modalContent: ModalContent = null,
}) => {
  return !ModalContent
    ? null
    : ReactDOM.createPortal(
      <ModalContainer open={isOpen} onClose={closeModal} {...modalProps}>
        <DialogContent>
          <ModalContent {...modalContentProps} />
        </DialogContent>
      </ModalContainer>,
      document.body,
    );
};

const enhanced = withModal(Modal);

export { enhanced as Modal };
