import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { Card, MenuItem, IconButton, Stack, CardHeader, CardContent, Button, Divider, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SocketContext } from 'src/contexts/socket';
import useLocales from 'src/hooks2/useLocales';
import { getBotList } from 'src/redux/dashboard/account/action';
import { API_BOT } from 'src/apis';
import Label from 'src/component/Label';
import Iconify from 'src/component/Iconify';
import DonateDialog from './DonateDialog';
import AlertDialog from 'src/component/AlertDialog';
import InfoDialog from './InfoDialog';
import MenuPopover from 'src/component/MenuPopover';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';


// import { getExchange, getBotList } from '../../redux/dashboard/account/action';

// import Iconify from '../../components/Iconify';
// import MenuPopover from '../../components/MenuPopover';
// import Label from '../../components/Label';

// import useLocales from '../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../routes/paths';
// import { API_BOT } from '../../apis';
// import { SocketContext } from '../../contexts/socket';
// import InfoDialog from './InfoDialog';
// import DonateDialog from './DonateDialog';
// import AlertDialog from '../../components/AlertDialog';

// routes
function ConfigurationList() {
  const { translate } = useLocales();
  const socket = useContext(SocketContext);

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);

  const botList = useSelector((state) => state.botList);

  const getBots = async () => {
    dispatch(await getBotList());
  };

  const handleDeleteConfiguration = async (_id) => {
    const next = async () => {
      try {
        const response = await API_BOT.deleteBot(_id);
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

  const socketHandleActionBot = async (data) => {
    if (data.ok) {
      await getBots();
      enqueueSnackbar(translate(data.d.err_code), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate(data.d.err_code), { variant: 'error' });
  };

  const handleActionBot = async (_id, actionType) => {
    try {
      // socket.current.emit('action-bot', {
      //   _id,
      //   actionType,
      // });
      const response = await API_BOT.actionBot(_id, actionType);
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
    setRows(botList);
  }, [botList]);

  const handleChangeLinkAccount = async (e, _id) => {
    try {
      const linkAccountId = e.target.value;

      const response = await API_BOT.updateBot(_id, {
        linkAccountId,
      });

      if (response.data.ok) {
        await getBots();
        enqueueSnackbar(translate('update_successful'), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate(response.data.m), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeAccountType = async (e, _id) => {
    try {
      const accountType = e.target.value;

      const response = await API_BOT.updateBot(_id, {
        account_type: accountType,
      });

      if (response.data.ok) {
        await getBots();
        enqueueSnackbar(translate('update_successful'), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate(response.data.m), { variant: 'error' });
    } catch (e) {
      console.log();
    }
  };

  const handleUpdateBot = async (data) => {
    try {
      const _id = data.botId;
      const response = await API_BOT.getBotInfo(_id);
      if (response.data.ok) {
        setRows((rowss) => {
          const newState = rowss.map((obj) => {
            if (obj._id === _id) {
              return response.data.d;
            }

            return obj;
          });

          return newState;
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateBotV2 = async (data) => {
    try {
      const _id = data.botId;
      setRows((rowss) => {
        const newState = rowss.map((obj) => {
          if (obj._id === _id) {
            return {
              ...obj,
              isRunning: data.botData.botInfo.isRunning,
              day_profit_demo: data.botData.botInfo.day_profit_demo,
              day_profit_live: data.botData.botInfo.day_profit_live,
              linkAccountId: data.botData.linkAccountId,
              name: data.botData.botInfo.name,
              account_type: data.botData.botInfo.account_type,
            };
          }

          return obj;
        });

        return newState;
      });
    } catch (e) {
      console.log(e);
    }
  };

  const listenSocket = () => {
    //   socket.current.on('ACTION_BOT', socketHandleActionBot);
    socket.current?.on('update_bothistory', handleUpdateBotV2);
  };

  const cancelListenSocket = () => {
    // socket.current.off('ACTION_BOT', socketHandleActionBot);
    socket.current?.off('update_bothistory', handleUpdateBotV2);
  };

  useEffect(() => {
    listenSocket();

    return ()=> cancelListenSocket();
  }, [socket]);

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
      field: 'nickName',
      headerName: translate('nickname'),
      minWidth: 180,
      width: 180,
      maxWidth: 200,
      flex: 0.8,
      renderCell: (cellValues) => {
        const findNickname = exchangeAccounts.find((a) => a._id === cellValues.row.linkAccountId);

        return (
          <TextField
            size="small"
            fullWidth
            select
            onChange={(e) => {
              handleChangeLinkAccount(e, cellValues.row._id);
            }}
            value={findNickname ? cellValues.row.linkAccountId : ''}
            name="linkAccountId"
            SelectProps={{
              MenuProps: {
                sx: { '& .MuiPaper-root': { maxHeight: 260 } },
              },
            }}
            sx={{
              maxWidth: { sm: '100%' },
              textTransform: 'capitalize',
            }}
          >
            {exchangeAccounts && exchangeAccounts.length > 0 ? (
              exchangeAccounts.map((option) => (
                <MenuItem
                  key={option._id}
                  checked
                  value={option._id || ''}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <img
                      src={`/client-icons/${option.clientId}.ico`}
                      style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
                      alt="icon "
                    />
                    {option.nickName}
                  </div>
                </MenuItem>
              ))
            ) : (
              <></>
            )}
          </TextField>
        );
      },
    },
    {
      field: 'account_type',
      headerName: translate('account_type'),
      minWidth: 120,
      width: 120,
      maxWidth: 150,
      flex: 0.8,
      renderCell: (cellValues) => (
        <TextField
          size="small"
          fullWidth
          select
          onChange={(e) => {
            handleChangeAccountType(e, cellValues.row._id);
          }}
          name="account_type"
          value={cellValues.row.account_type}
          SelectProps={{
            MenuProps: {
              sx: { '& .MuiPaper-root': { maxHeight: 260 } },
            },
          }}
          sx={{
            maxWidth: { sm: '100%' },
            textTransform: 'capitalize',
          }}
        >
          <MenuItem
            key="DEMO"
            checked
            value="DEMO"
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            DEMO
          </MenuItem>
          <MenuItem
            key="LIVE"
            checked
            value="LIVE"
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            LIVE
          </MenuItem>
        </TextField>
      ),
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

        return (
          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={current.color}>
            {current.profit > 0 ? `+${parseFloat(current.profit.toFixed(2))}` : parseFloat(current.profit.toFixed(2))} $
          </Label>
        );
      },
    },
  ];

  const [selectedItem, setSelectedItem] = useState([]);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => rows.find((row) => row._id === id));
    setSelectedItem(selectedRowsData);
  };

  const handleStartSelectedItem = async () => {
    const current = { count: 0 };
    await Promise.all(
      selectedItem.map(async (item) => {
        const response = await API_BOT.actionBot(item._id, 'start');
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
  };

  const handleStopSelectedItem = async () => {
    const current = { count: 0 };
    await Promise.all(
      selectedItem.map(async (item) => {
        const response = await API_BOT.actionBot(item._id, 'stop');
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
      const current = { count: 0 };
      await Promise.all(
        selectedItem.map(async (item) => {
          const response = await API_BOT.deleteBot(item._id);
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
    };
    handleOpenAlertDialog(translate('are_u_want_to_del_config'), '', 'info', next);
  };
  const [openDonate, setDonate] = useState(false);

  const getBotIdsDonate = () => {
    const array = [];
    selectedItem.forEach((item) => {
      array.push(item._id);
    });

    return array;
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
      <DonateDialog botIds={getBotIdsDonate()} isOpen={openDonate} setIsOpen={setDonate} />
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
                    onClick={() => {
                      setDonate(true);
                    }}
                    color="info"
                    startIcon={<Iconify icon={'mdi:donate'} />}
                  >
                    {translate('donate')}
                  </Button>
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

  const [isOpenInfo, setOpenInfo] = useState(false);
  const [openDonate, setDonate] = useState(false);

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <InfoDialog data={details} isOpen={isOpenInfo} setIsOpen={setOpenInfo} />

      <DonateDialog botIds={[id]} isOpen={openDonate} setIsOpen={setDonate} />

      <IconButton
        size="small"
        onClick={handleOpen}
        sx={{
          color: details?.isRunning ? 'success.main' : 'warning.main',
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
        {details?.isRunning ? (
          <>
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
            {details.isPause ? (
              <MenuItem
                sx={{ color: 'success.main' }}
                onClick={() => {
                  handleActionBot(id, 'resume');
                  setOpen(null);
                }}
              >
                <Iconify icon={'grommet-icons:resume'} sx={{ ...ICON }} />
                {translate('resume')}
              </MenuItem>
            ) : (
              <MenuItem
                sx={{ color: 'warning.main' }}
                onClick={() => {
                  handleActionBot(id, 'pause');
                  setOpen(null);
                }}
              >
                <Iconify icon={'ic:round-pause-circle'} sx={{ ...ICON }} />
                {translate('pause')}
              </MenuItem>
            )}
          </>
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
            navigate.push(PATH_DASHBOARD.bot.edit(id));
            setOpen(null);
          }}
        >
          <Iconify icon={'fluent-emoji:pencil'} sx={{ ...ICON }} />
          {translate('edit')}
        </MenuItem>
        {details && (
          <MenuItem
            sx={{ color: 'success.main' }}
            onClick={() => {
              setDonate(true);
              setOpen(null);
            }}
          >
            <Iconify icon={'mdi:donate'} sx={{ ...ICON }} />
            {translate('donate')}
          </MenuItem>
        )}

        <MenuItem
          sx={{ color: 'info.main' }}
          onClick={() => {
            navigate.push(PATH_DASHBOARD.bot.history(id));
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
        <Divider />
        <MenuItem
          sx={{ color: 'info.main' }}
          onClick={() => {
            setOpenInfo(true);
            setOpen(null);
          }}
        >
          <Iconify icon={'entypo:info-with-circle'} sx={{ ...ICON }} />
          {translate('info')}
        </MenuItem>
      </MenuPopover>
    </>
  );
}

export default ConfigurationList;
