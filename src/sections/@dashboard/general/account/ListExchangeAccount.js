import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { Card, MenuItem, IconButton, Stack, CardHeader, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useLocales from 'src/hooks2/useLocales';
import { getExchange } from 'src/redux/dashboard/account/action';
import { API_EXCHANGE } from 'src/apis';
import TextIconLabel from 'src/component/TextIconLabel';
import Label from 'src/component/Label';
import WalletDialog from './WalletDialog';
import Iconify from 'src/component/Iconify';
import MenuPopover from 'src/component/MenuPopover';


// routes
function ListExchangeAccount() {
  const { translate } = useLocales();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };
  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);

  const handleDeleteExchangeAccount = async (id) => {
    try {
      const response = await API_EXCHANGE.deleteLinkAccount(id);

      if (response.data.ok) {
        enqueueSnackbar(translate('delete_successfully'), { variant: 'success' });
        await getExchangeAccount();

        return;
      }
      enqueueSnackbar(translate('delete_failed'), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = async (id) => {
    try {
      const response = await API_EXCHANGE.logOutLinkAccount(id);

      if (response.data.ok) {
        getExchangeAccount();
        enqueueSnackbar(translate('sign_out_successfully'), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate('logout_failed'), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!exchangeAccounts.length) getExchangeAccount();
  }, []);

  useEffect(() => {
    setRows(exchangeAccounts);
  }, [exchangeAccounts]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'nickName',
      headerName: translate('nickname'),
      minWidth: 100,
      width: 150,
      maxWidth: 250,
      flex: 0.8,
      renderCell: (cellValues) => (
        <TextIconLabel
          style={{
            fontSize: '1em',
          }}
          icon={
            <img
              src={`/client-icons/${cellValues.row.clientId}.ico`}
              style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
              alt="icon "
            />
          }
          value={cellValues.row.nickName}
          sx={{ typography: 'caption' }}
        />
      ),
    },
    {
      field: 'email',
      headerName: translate('email'),
      minWidth: 100,
      width: 200,
      maxWidth: 300,
      flex: 0.8,
    },
    {
      field: 'referrerCode',
      headerName: translate('referer_code'),
      minWidth: 100,
      width: 120,
      maxWidth: 200,
      flex: 0.8,
    },
    {
      field: 'isLogin',
      headerName: translate('status'),
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={cellValues.row.isLogin ? 'success' : 'error'}
        >
          {cellValues.row.isLogin ? translate('logged') : translate('not_logged_in')}
        </Label>
      ),
    },

    {
      field: 'actions',
      headerName: translate('actions'),
      minWidth: 60,
      width: 80,
      maxWidth: 100,
      flex: 1,
      renderCell: (cellValues) => (
        <MoreMenuButton
          handleDelete={handleDeleteExchangeAccount}
          handleLogout={handleLogout}
          id={cellValues.row._id}
        />
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader title={translate('list_exchange_account')} />
        <CardContent>
          <DataGrid
            disableColumnSelector
            disableColumnMenu
            disableColumnFilter
            autoHeight
            rows={rows}
            columns={columns}
            components={{
              LoadingOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {translate('data_loading')}
                </Stack>
              ),
              NoRowsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {translate('no_data_to_display')}
                </Stack>
              ),
              NoResultsOverlay: () => (
                <Stack height="100%" alignItems="center" justifyContent="center">
                  {translate('no_data_to_display')}
                </Stack>
              ),
            }}
            getRowId={(row) => row._id}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
          />
        </CardContent>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton({ handleDelete, handleLogout, id }) {
  const { translate } = useLocales();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };
  const [openWallet, setOpenWallet] = useState(false);
  const [linkAccountIdWallet, setLinkAccountIdWallet] = useState(0);

  const handleOpenWallet = (id) => {
    setLinkAccountIdWallet(id);
    setOpen(null);
  };

  const handleCloseWallet = () => {
    setLinkAccountIdWallet(0);
    setOpen(null);
  };

  useEffect(() => {
    if (linkAccountIdWallet !== 0) {

      setOpenWallet(true);

      return;

    }
    if (linkAccountIdWallet === 0) {
      setOpenWallet(false);
    }
  }, [linkAccountIdWallet]);

  return (
    <>
      <WalletDialog isOpen={openWallet} linkAccountId={linkAccountIdWallet} handleClose={handleCloseWallet} />
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'file-icons:actionscript'} width={20} color={'orange'} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem
          sx={{ color: 'success.main' }}
          onClick={() => {
            handleOpenWallet(id);
          }}
        >
          <Iconify icon={'clarity:wallet-solid'} sx={{ ...ICON }} />
          {translate('wallet')}
        </MenuItem>

        <Divider />
        <MenuItem
          sx={{ color: 'error.main' }}
          onClick={() => {
            handleDelete(id);
            setOpen(null);
          }}
        >
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          {translate('delete')}
        </MenuItem>
        <MenuItem
          sx={{ color: 'warning.main' }}
          onClick={() => {
            handleLogout(id);
            setOpen(null);
          }}
        >
          <Iconify icon={'carbon:logout'} sx={{ ...ICON }} />
          {translate('logout')}
        </MenuItem>
      </MenuPopover>
    </>
  );
}

export default ListExchangeAccount;
