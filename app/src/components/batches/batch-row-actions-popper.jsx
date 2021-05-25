import React, { useState } from 'react';
import {
  withStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  MoreVertRounded,
  PrintRounded,
  DescriptionRounded,
  GetAppRounded,
  PublishRounded,
  CommentRounded,
  CheckCircleOutlineRounded,
  LocalShippingRounded,
  CancelOutlined,
  AlarmOnRounded,
  RefreshRounded
} from '@material-ui/icons';
import { Popper } from '../common/popper/popper';
import { useModal } from '../common/modal';
import { useToast } from '../common/toast';
import { UploadFilesDialog } from './upload-files-dialog';
import { DownloadFilesDialog } from './download-files-dialog';
import Loading from '../common/loading';
import { useAPI, useUserData } from '../../hooks';

const StyledListItem = withStyles((theme) => ({
  root: {
    '& .MuiListItemIcon-root': {
      minWidth: '35px',
    },
    '& .MuiTypography-root': {
      fontWeight: 500,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiTypography-root,.MuiListItemIcon-root': {
        color: theme.palette.text.contrastText,
      },
    },
  },
}))(ListItem);

const PopperContent = ({ onClose, setLoading, menuItems }) => {
  const handleMenuClick = (handler) => {
    setLoading(true);
    handler().then(() => {
      setLoading(false);
    });
    onClose();
  };

  return (
    <List component="nav" disablePadding>
      {menuItems.map((menu) => (
        <StyledListItem
          button
          key={menu.title}
          onClick={() => handleMenuClick(menu.handler)}
        >
          <ListItemIcon>{menu.icon}</ListItemIcon>
          <ListItemText primary={menu.title} />
        </StyledListItem>
      ))}
    </List>
  );
};

export const BatchRowActionsPopper = ({
  batch,
  batchTransition,
  showNotes,
  updateBatchData,
  department,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openModal, closeModal } = useModal();
  const { openToast } = useToast();
  const { user = {} } = useUserData();
  const {
    downloadLineItems,
    downloadProductionFiles,
    printProductionSlip,
    uploadProductionFilePath,
    refreshBatchOrders,
  } = useAPI();

  const uploadFiles = async () => {
    openModal({
      modalProps: { maxWidth: 'sm' },
      modalContent: UploadFilesDialog,
      modalContentProps: {
        title: `Upload Files for :  ${batch.name}`,
        dropboxUrl: batch?.productionFiles?.dropboxUrl,
        onConfirm: (data) =>
          uploadProductionFilePath(batch._id, data).then((response) => {
            if (response) {
              updateBatchData(response);
              openToast({
                message: `Production files ${
                  data.path ? 'uploaded' : 'removed'
                } successfully`,
                status: 'success',
              });
            }
            return true;
          }),
        onCancel: () => closeModal(),
      },
    });
  };

  const downloadFiles = async () => {
    if (batch?.productionFiles?.path) {
      return openModal({
        modalProps: { maxWidth: 'sm' },
        modalContent: DownloadFilesDialog,
        modalContentProps: {
          title: 'Choose Production Files Source',
          onConfirm: async (source) => {
            openToast({
              message: 'Downloading Production Files',
              status: 'success',
            });
            closeModal();
            setLoading(true);
            await downloadProductionFiles(batch._id, { source });
            setLoading(false);
          },
          onCancel: () => closeModal(),
        },
      });
    }
    return downloadProductionFiles(batch._id);
  };

  const statusTransition = async (nextStatus) => {
    setLoading(true);
    await batchTransition(nextStatus);
    setLoading(false);
  };

  const menuItems = [
    {
      title: 'Line Items',
      icon: <DescriptionRounded />,
      handler: () => downloadLineItems(batch._id),
    },
    {
      title: 'Refresh Batch',
      icon: <RefreshRounded />,
      handler: () => refreshBatchOrders(batch._id),
    },
  ];

  const { status, processingOption } = batch;

  switch (true) {
    case status !== 'PENDING':
      menuItems.push(
        {
          title: 'Production Slip',
          icon: <PrintRounded />,
          handler: () => printProductionSlip(batch._id),
        },
        {
          title: 'Production Files',
          icon: <GetAppRounded />,
          handler: downloadFiles,
        }
      );

      status === 'READY' &&
        ['ADMIN', 'PRODUCTION'].includes(user.role) &&
        menuItems.push({
          title: 'Mark Complete',
          icon: <CheckCircleOutlineRounded />,
          handler: () => statusTransition('COMPLETE'),
        });

      status === 'COMPLETE' &&
        ['ADMIN', 'SHIPPING'].includes(user.role) &&
        menuItems.push({
          title: 'Mark Shipped',
          icon: <LocalShippingRounded />,
          handler: () => statusTransition('SHIPPED'),
        });

      batch?.productionFiles?.path &&
        status === 'READY' &&
        ['ADMIN', 'DESIGNER'].includes(user.role) &&
        menuItems.push({
          title: 'Uploaded Files',
          icon: <CancelOutlined />,
          handler: uploadFiles,
        });
      break;
    case status === 'PENDING' &&
      ['ADMIN', 'DESIGNER'].includes(user.role) &&
      ['MANUAL', 'POSTPROCESSED'].includes(processingOption):
      menuItems.push({
        title: 'Upload Files',
        icon: <PublishRounded />,
        handler: uploadFiles,
      });
      department === 'Embroidery' &&
        menuItems.push({
          title: 'Mark Ready',
          icon: <AlarmOnRounded />,
          handler: () => statusTransition('READY'),
        });
      break;

    default:
      break;
  }

  menuItems.push({
    title: 'Add Notes',
    icon: <CommentRounded />,
    handler: showNotes,
  });

  return (
    <Popper
      isOpen={isOpen}
      placement="bottom-end"
      onClickAway={() => setIsOpen(false)}
      popperContent={PopperContent}
      popperContentProps={{
        onClose: () => setIsOpen(false),
        setLoading,
        menuItems,
      }}
      noPadding
      disablePortal={false}
    >
      {!loading ? (
        <IconButton onClick={() => setIsOpen(true)} size="small">
          <MoreVertRounded color={isOpen ? 'primary' : 'inherit'} />
        </IconButton>
      ) : (
        <Loading contained size={25} />
      )}
    </Popper>
  );
};
