import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { Box, TextField, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Divider, IconButton, Tooltip } from '@material-ui/core';
import moment from 'moment';
import { ScrollContainer } from '../../components/layout';
import { Jobs } from '../../components/settings';
import { DropboxIcon } from '../../components/icons';
import CheckIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import CrossIcon from '@material-ui/icons/CancelOutlined';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import ContactSupportRoundedIcon from '@material-ui/icons/ContactSupportRounded';
import Loading from '../../components/common/loading';
import { AddDropboxAccessCodeDialog } from '../../components/settings';
import { useModal } from '../../components/common/modal';
import { useAPI } from '../../hooks/api';

export const MiscSettings = () => {
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [settings, setSettings] = useState({});
  const [jobs, setJobs] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersAdded, setOrdersAdded] = useState({});
  const {
    getJobs,
    getSettings,
    connectToDropbox,
    searchOrders,
    createOrder,
  } = useAPI();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await getJobs();
      response && setJobs(response);
    };
    fetchJobs();
  }, [getJobs]);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await getSettings();
      response && setSettings(response);
    };
    fetchSettings();
  }, [getSettings]);

  const handleConnectDropbox = () => {
    const url = new window.URL('https://www.dropbox.com/oauth2/authorize');
    url.searchParams.append('client_id', 'kvyb88smb2c2lb6');
    url.searchParams.append('token_access_type', 'offline');
    url.searchParams.append('response_type', 'code');
    window.open(url, '_blank').focus();
    openModal({
      modalProps: { maxWidth: 'sm', closeOnClickAway: false },
      modalContent: AddDropboxAccessCodeDialog,
      modalContentProps: {
        title: 'Add Dropbox Access Code',
        onConfirm: async (accessCode) => {
          const response = await connectToDropbox(accessCode);
          response && setSettings(response);
          return true;
        },
        onCancel: () => closeModal(),
      },
    });
  };

  const handleSearchOrders = async () => {
    setLoadingOrders(true);
    const response = await searchOrders(orderNumber);
    response && setOrders(response);
    setLoadingOrders(false);
  };

  const handleAddOrders = async (order) => {
    const response = await createOrder(order);
    response && setOrdersAdded({ ...ordersAdded, [order.orderId]: true });
  };

  return (
    <ScrollContainer
      body={
        <Paper>
          <Box p={2}>
            <Typography variant="h5">Scheduler Jobs</Typography>
          </Box>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Last Run</TableCell>
                <TableCell>Next Run</TableCell>
                <TableCell align="center">Actions</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job, index) => (
                <Jobs key={job._id} job={job} index={index} />
              ))}
            </TableBody>
          </Table>
          <Box p={2} display="flex" alignItems="center">
            <Typography variant="h5">Connect Dropbox</Typography>
            <Box px={3} display="flex" alignItems="center" position="relative">
              <Tooltip
                title={
                  !!settings?.dropbox?.connection
                    ? 'Connected'
                    : 'Click to Connect'
                }
              >
                <IconButton onClick={handleConnectDropbox}>
                  <DropboxIcon style={{ fontSize: '2.5rem' }} />
                </IconButton>
              </Tooltip>
              <Box position="absolute" top="10px" right="20px">
                {!!settings?.dropbox?.connection ? (
                  <CheckIcon htmlColor="#52d869" fontSize="small" />
                ) : (
                  <CrossIcon htmlColor="#E53935" fontSize="small" />
                )}
              </Box>
            </Box>
          </Box>
          <Divider />
          <Box
            p={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Box position="relative" display="flex" width="fit-content">
              <Typography variant="h5">Manual Order Fetching</Typography>
              <Box position="absolute" right="-15px">
                <Tooltip title="Search Order from Shipstation and add to System">
                  <ContactSupportRoundedIcon style={{ fontSize: '14px' }} />
                </Tooltip>
              </Box>
            </Box>
            <Box pt={1} display="flex">
              <Box pr={2} width="300px">
                <TextField
                  variant="outlined"
                  placeholder="Enter Order Number"
                  value={orderNumber}
                  inputProps={{
                    style: { padding: 12 },
                  }}
                  onChange={(event) => setOrderNumber(event.target.value)}
                />
              </Box>
              <Box width="100px">
                <Button
                  color="primary"
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={!orderNumber.length || loadingOrders}
                  onClick={handleSearchOrders}
                >
                  {loadingOrders ? <Loading contained size={20} /> : 'Fetch'}
                </Button>
              </Box>
            </Box>
            <Box maxWidth="400px" pl={2} pt={2}>
              {orders.map((order, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{order.orderNumber}</Typography>
                  <Typography>
                    {moment(order.orderDate).format('YYYY-MM-DD')}
                  </Typography>
                  {!ordersAdded[order.orderId] ? (
                    <Tooltip title="Add to System">
                      <IconButton onClick={() => handleAddOrders(order)}>
                        <AddCircleRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Added">
                      <IconButton>
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      }
    />
  );
};
