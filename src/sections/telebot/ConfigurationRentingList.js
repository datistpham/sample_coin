import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import {
  Card,
  MenuItem,
  IconButton,
  Stack,
  CardHeader,
  CardContent,
  Button,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useLocales from 'src/hooks2/useLocales';
import { API_TELEBOT } from 'src/apis';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/component/Iconify';
import MenuPopover from 'src/component/MenuPopover';
import RenewBotDialog from './RenewBotDialog';
import AlertDialog from 'src/component/AlertDialog';
import Label from 'src/component/Label';
import { useRouter } from 'next/router';


// routes
function ConfigurationRentingList() {
  const { translate } = useLocales();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  // const botList = useSelector((state) => state.teleBotList);
  const [botList, setBotList] = useState([]);

  const getBots = async () => {
    try {
      const response = await API_TELEBOT.getRentingBots();
      if (response.data.ok) {
        setBotList(response.data.d);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteConfiguration = async (_id) => {
    const next = async () => {
      try {
        const response = await API_TELEBOT.deleteBot(_id);
        if (response.data.ok) {
          await getBots();
          enqueueSnackbar(translate(response.data.d.err_code), { variant: 'success' });

          return;
        }
        enqueueSnackbar(translate('failed'), { variant: 'error' });
      } catch (e) {
        console.log(e);
      }
    };

    handleOpenAlertDialog(translate('are_u_want_to_del_config'), '', 'info', next);
  };

  const handleActionBot = async (_id, actionType) => {
    try {
      const response = await API_TELEBOT.actionBot(_id, actionType);
      if (response.data.ok) {
        await getBots();
        enqueueSnackbar(translate(response.data.d.err_code), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (botList.length === 0) {
      getBots();

      return;
    }
    setRows(botList);
  }, [botList]);

  const [botIdRenew, setBotIdRenew] = useState('');
  const [isOpenRenew, setOpenRenew] = useState(false);

  useEffect(() => {
    if (botIdRenew !== '') {
      setOpenRenew(true);
    }
  }, [botIdRenew]);

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'actions',
      headerName: translate('actions'),
      minWidth: 80,
      width: 80,
      maxWidth: 100,
      flex: 1,
      renderCell: (cellValues) => (
        <MoreMenuButton
          handleActionBot={handleActionBot}
          handleDelete={handleDeleteConfiguration}
          details={cellValues.row}
          id={cellValues.row._id}
          colorBtn={cellValues.row.isRunning ? 'success.main' : 'warning.main'}
        />
      ),
    },
    {
      field: 'name',
      headerName: translate('name'),
      minWidth: 120,
      width: 150,
      maxWidth: 200,
      flex: 0.8,
    },
    {
      field: 'status',
      headerName: translate('status'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={cellValues.row.isRunning ? 'success' : 'error'}
        >
          {cellValues.row.isRunning ? translate('is_on') : translate('is_off')}
        </Label>
      ),
    },
    {
      field: 'day_profit',
      headerName: translate('profit_day_sort'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => {
        const current = { color: 'success', profit: 0 };
        if (cellValues.row.account_type === 'DEMO') {
          if (cellValues.row.day_profit_demo < 0) current.color = 'error';

          if (cellValues.row.day_profit_demo === 0) {
            current.color = 'info';
          }
          current.profit = cellValues.row.day_profit_demo;
        }

        if (cellValues.row.account_type === 'LIVE') {
          if (cellValues.row.day_profit_live < 0) current.color = 'error';

          if (cellValues.row.day_profit_live === 0) {
            current.color = 'info';
          }
          current.profit = cellValues.row.day_profit_live;
        }

        return
        (

          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={current.color}>
            {current.profit > 0 ? `+${parseFloat(current.profit.toFixed(2))}` : parseFloat(current.profit.toFixed(2))} $
          </Label>
        );
      },
    },
    {
      field: 'exp',
      headerName: translate('Hạn sử dụng'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'warning'}>
          {format(cellValues.row.exp, 'HH:mm dd/MM')}
        </Label>
      ),
    },
    {
      field: 'action',
      headerName: translate('actions'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <Button
          size="small"
          onClick={() => {
            setBotIdRenew(cellValues.row._id);
          }}
          variant="contained"
        >
          {translate('Gia hạn')}
        </Button>
      ),
    },
  ];

  const [selectedItem, setSelectedItem] = useState([]);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row._id === id));
    setSelectedItem(selectedRowsData);
  };

  const handleStartSelectedItem = async () => {
    try {
      const current = { count: 0 };
      await Promise.all(
        selectedItem.map(async (item) => {
          const response = await API_TELEBOT.actionBot(item._id, 'start');
          if (response.data.ok) {
            current.count += 1;

            return;
          }
          enqueueSnackbar(translate('failed'), { variant: 'error' });
        })
      );
      enqueueSnackbar(`${translate('bot_start')} ${current.count} ${translate('configuration')}`, {
        variant: 'success',
      });
      getBots();
    } catch (e) {
      console.log(e);
    }
  };

  const handleStopSelectedItem = async () => {
    const current = { count: 0 };
    await Promise.all(
      selectedItem.map(async (item) => {
        const response = await API_TELEBOT.actionBot(item._id, 'stop');
        if (response.data.ok) {
          current.count += 1;

          return;
        }
        enqueueSnackbar(translate('failed'), { variant: 'error' });
      })
    );
    enqueueSnackbar(`${translate('bot_stop')} ${current.count} ${translate('configuration')}`, {
      variant: 'success',
    });
    getBots();
  };

  const handleDeleteSelectedItem = async () => {
    const next = async () => {
      try {
        const current = { count: 0 };
        await Promise.all(
          selectedItem.map(async (item) => {
            const response = await API_TELEBOT.deleteBot(item._id);
            if (response.data.ok) {
              current.count += 1;

              return;
            }
            enqueueSnackbar(translate('failed'), { variant: 'error' });
          })
        );
        enqueueSnackbar(`${translate('successful_delete')} ${current.count} ${translate('configuration')}`, {
          variant: 'success',
        });
        getBots();
      } catch (e) {
        console.log(e);
      }
    };
    handleOpenAlertDialog(translate('are_u_want_to_del_config'), '', 'info', next);
  };

  const [alertData, setAlertData] = useState({
    title: '',
    content: '',
    type: 'info',
    callback: () => {},
  });
  const [isOpenAlertDialog, setOpenAlertDialog] = useState(false);

  const handleOpenAlertDialog = (title, content, type, callback) => {
    try {
      setAlertData({
        title,
        content,
        type,
        callback,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (alertData.title !== '') setOpenAlertDialog(true);
  }, [alertData]);

  return (
    <>
      <RenewBotDialog botId={botIdRenew} isOpen={isOpenRenew} setIsOpen={setOpenRenew} callback={getBots} />
      <AlertDialog isOpen={isOpenAlertDialog} setOpen={setOpenAlertDialog} data={alertData} />
      <Card>
        <CardHeader
          title={translate('bot_configuration_list')}
          action={
            <Stack spacing={1} direction="row">
              {' '}
              {selectedItem.length > 0 ? (
                <>
                  {' '}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleDeleteSelectedItem}
                    color="error"
                    startIcon={<Iconify icon={'ep:delete-filled'} />}
                  >
                    {translate('delete')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleStopSelectedItem}
                    color="warning"
                    startIcon={<Iconify icon={'bi:stop-circle-fill'} />}
                  >
                    {translate('stop')}
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleStartSelectedItem}
                    color="success"
                    startIcon={<Iconify icon={'bi:skip-start-circle-fill'} />}
                  >
                    {translate('start')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={getBots}
                  color="info"
                  startIcon={<Iconify icon={'icon-park-solid:refresh-one'} />}
                >
                  {translate('refresh')}
                </Button>
              )}
            </Stack>
          }
        />
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
            onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
          />
        </CardContent>
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton({ handleDelete, handleActionBot, details, id, colorBtn = 'warning.main' }) {
  const { translate } = useLocales();
  const navigate = useRouter();

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

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          color: details.isRunning ? 'success.main' : 'warning.main',
        }}
      >
        <Iconify icon={'ant-design:setting-filled'} width={25} height={25} />
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
        {details.isRunning ? (
          <MenuItem
            sx={{ color: 'warning.main' }}
            onClick={() => {
              handleActionBot(id, 'stop');
              setOpen(null);
            }}
          >
            <Iconify icon={'bi:stop-circle-fill'} sx={{ ...ICON }} />
            {translate('stop')}
          </MenuItem>
        ) : (
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => {
              handleActionBot(id, 'start');
              setOpen(null);
            }}
          >
            <Iconify icon={'flat-color-icons:start'} sx={{ ...ICON }} />
            {translate('start')}
          </MenuItem>
        )}

        <MenuItem
          sx={{ color: 'warning.main' }}
          onClick={() => {
            navigate.push(PATH_DASHBOARD.telebot.edit(id));
            setOpen(null);
          }}
        >
          <Iconify icon={'fluent-emoji:pencil'} sx={{ ...ICON }} />
          {translate('edit')}
        </MenuItem>
        <MenuItem
          sx={{ color: 'info.main' }}
          onClick={() => {
            navigate.push(PATH_DASHBOARD.telebot.history(id));
            setOpen(null);
          }}
        >
          <Iconify icon={'ic:baseline-work-history'} sx={{ ...ICON }} />
          {translate('view_history')}
        </MenuItem>
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
      </MenuPopover>
    </>
  );
}

export default ConfigurationRentingList;
