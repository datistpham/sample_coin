import { useSnackbar } from 'notistack';

import { Card, MenuItem, IconButton, CardHeader, CardContent, Switch, Stack, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

// import { useNavigate } from 'react-router-dom';

import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import useLocales from 'src/hooks2/useLocales';
import { API_COPYTRADE } from 'src/apis';
import TextIconLabel from 'src/component/TextIconLabel';
import Label from 'src/component/Label';
import Iconify from 'src/component/Iconify';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import MenuPopover from 'src/component/MenuPopover';

// import Iconify from '../../../../components/Iconify';
// import MenuPopover from '../../../../components/MenuPopover';
// import Label from '../../../../components/Label';
// import TextIconLabel from '../../../../components/TextIconLabel';

// import useLocales from '../../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// import { API_COPYTRADE } from '../../../../apis';

// routes
function ListExchangeAccount() {
  const isMountedRef = useIsMountedRef();
  const { translate } = useLocales();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const [listSetting, setListSetting] = useState([]);

  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);

  const getListSetting = useCallback(async () => {
    try {
      const response = await API_COPYTRADE.getList();
      if (isMountedRef.current)
        if (response.status === 200 && response.data.ok) {
          setListSetting(response.data.d);
        }
    } catch (e) {
      console.log(e);
    }
  }, [isMountedRef]);

  const updateStatus = async (_id, isActive, e) => {
    try {
      const response = await API_COPYTRADE.updateStatus(_id, isActive);

      if (response.status === 200 && response.data.ok) {
        enqueueSnackbar(translate('success'), { variant: 'success' });
        getListSetting();

        return;
      }

      if (response.status === 200 && response.data.ok) {
        enqueueSnackbar(translate('failed'), { variant: 'error' });

        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteSetting = async (_id) => {
    try {
      const response = await API_COPYTRADE.deleteSetting(_id);

      if (response.status === 200 && response.data.ok) {
        enqueueSnackbar(translate('success'), { variant: 'success' });
        getListSetting();

        return;
      }

      if (response.status === 200 && response.data.ok) {
        enqueueSnackbar(translate('failed'), { variant: 'error' });

        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getListSetting();

  }, [exchangeAccounts]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'nickName',
      headerName: translate('nickname'),
      minWidth: 100,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <TextIconLabel
          style={{
            fontSize: '1em',
          }}
          icon={
            <img
              src={cellValues.row.iconClient}
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
      field: 'brokerUserName',
      headerName: translate('expert'),
      minWidth: 100,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
    },
    {
      field: 'profitVolume',
      headerName: translate('profit/volume'),
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 1,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'warning'}>
          {parseFloat(cellValues.row.profitDay.toFixed(2))}/{parseFloat(cellValues.row.volumeDay.toFixed(2))}
        </Label>
      ),
    },
    {
      field: 'targetStop',
      headerName: `${translate('take_profit')}/${translate('stop_loss')}`,
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 1,
      renderCell: (cellValues) => (
        <>
          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'success'}>
            {cellValues.row.takeProfitTarget}
          </Label>
          /
          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'error'}>
            {cellValues.row.stopLossTarget}
          </Label>
        </>
      ),
    },

    {
      field: 'isActive',
      headerName: translate('status'),
      minWidth: 100,
      width: 100,
      maxWidth: 150,
      flex: 1,
      renderCell: (cellValues) => (
        <>
          <Switch
            checked={cellValues.row.isActive}
            onChange={() => {
              updateStatus(cellValues.row._id, !cellValues.row.isActive);
            }}
            name="isActive"
          />
          <MoreMenuButton handleDelete={handleDeleteSetting} id={cellValues.row._id} />
        </>
      ),
    },
  ];

  useEffect(() => {
    try {
      const currentRows = [];
      listSetting.forEach((setting, index) => {
        const foundLinkAccount = exchangeAccounts.find((a) => a._id === setting.linkAccountId);
        if (foundLinkAccount) {
          const obj = {
            iconClient: `/client-icons/${foundLinkAccount.clientId}.ico`,
            linkAccountId: setting.linkAccountId,
            _id: setting._id,
            id: index,
            nickName: foundLinkAccount.nickName,
            brokerUserName: setting.brokerUserName,
            stopLossTarget: setting.stopLossTarget,
            takeProfitTarget: setting.takeProfitTarget,
            profitDay: setting.profitDay,
            volumeDay: setting.volumeDay,
            isActive: setting.isActive,
          };
          currentRows.push(obj);
        }
      });
      setRows(currentRows);
    } catch (e) {
      console.log(e);
    }
  }, [listSetting, exchangeAccounts]);

  const [selectedItem, setSelectedItem] = useState([]);

  const onRowsSelectionHandler = (ids) => {
    try {
      const selectedRowsData = ids.map((id) => rows.find((row) => row.id === id));
      setSelectedItem(selectedRowsData);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteList = () => {
    try {
      if (selectedItem.length) {
        selectedItem.forEach((item) => {
          handleDeleteSetting(item._id);
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Card>
        <CardHeader
          title={translate('list_setting_copy_trade')}
          action={
            selectedItem.length > 0 ? (
              <Button
                startIcon={<Iconify icon={'ep:delete-filled'} />}
                size="small"
                sx={{ width: '100%' }}
                color="error"
                onClick={handleDeleteList}
                variant="contained"
              >
                {translate('delete')}
              </Button>
            ) : (
              <></>
            )
          }
        />

        <CardContent>
          <DataGrid
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
            getRowId={rows._id}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
          />
        </CardContent>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton({ handleDelete, id }) {
  const navigate = useRouter();

  const { translate } = useLocales();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleEdit = (_id) => {
    navigate.push(PATH_DASHBOARD.copytrade_setting.edit(_id), { replace: true });
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
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
            handleEdit(id);
            setOpen(null);
          }}
        >
          <Iconify icon={'entypo:edit'} sx={{ ...ICON }} />
          {translate('edit')}
        </MenuItem>
      </MenuPopover>
    </>
  );
}

export default ListExchangeAccount;
