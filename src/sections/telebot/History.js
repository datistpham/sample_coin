import { useSnackbar } from 'notistack';

import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Typography,
  Backdrop,
  Divider,
} from '@mui/material';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { useTheme } from '@mui/material/styles';

import { format } from 'date-fns';

import { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useLocales from 'src/hooks2/useLocales';
import { useRouter } from 'next/router';
import { SocketContext as SocketContextWeb } from 'src/contexts/socketWeb';
import { SocketContext } from 'src/contexts/socket';
import { getTeleBotList } from 'src/redux/dashboard/account/action';
import { API_TELEBOT } from 'src/apis';
import { PATH_DASHBOARD } from 'src/routes/paths';
import AlertDialog from 'src/component/AlertDialog';
import Iconify from 'src/component/Iconify';
import Label from 'src/component/Label';
import InfoDialog from '../bot/InfoDialog';
import MenuPopover from 'src/component/MenuPopover';

// import MenuPopover from '../../components/MenuPopover';
// import { useParams, useNavigate } from 'react-router-dom';
// import Iconify from '../../components/Iconify';
// import Label from '../../components/Label';
// import TextIconLabel from '../../components/TextIconLabel';
// import { getTeleBotList } from '../../redux/dashboard/account/action';
// import useLocales from '../../hooks/useLocales';
// import { SocketContext } from '../../contexts/socket';
// import { SocketContext as SocketContextWeb } from '../../contexts/socketWeb';
// import { PATH_DASHBOARD } from '../../routes/paths';
// import { API_TELEBOT } from '../../apis';
// import InfoDialog from '../bot/InfoDialog';
// import AlertDialog from '../../components/AlertDialog';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: 'transparent',
    },
    cursor: 'pointer',
  },

  thead: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
});

const StyledTableBody = withStyles({
  root: {
    position: 'relative',
  },
})(TableBody);

const LimitedBackdrop = withStyles({
  root: {
    position: 'absolute',
    zIndex: 1,
  },
})(Backdrop);

function History(props) {
  const navigate = useRouter();

  const { _id = '' } = navigate.query;

  const socket = useContext(SocketContext);
  const socketWeb = useContext(SocketContextWeb);

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const dispatch = useDispatch();

  const getBots = async () => {
    dispatch(await getTeleBotList());
  };
  const botList = useSelector((state) => state.teleBotList);

  const [botInfo, setBotInfo] = useState(null);

  useEffect(() => {
    const findBot = botList.find((a) => a._id === _id);

    if (findBot) setBotInfo(findBot);
  }, [_id, botList]);

  const handleActionBot = async (_id, actionType) => {
    const response = await API_TELEBOT.actionBot(_id, actionType);
    if (response.data.ok) {
      await getBots();
      enqueueSnackbar(translate(response.data.d.err_code), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
  };

  useEffect(() => {
    if (botList.length === 0) getBots();
  }, [botList]);

  const [currentId, setCurrentId] = useState(_id);

  const handleChangeBotId = (e) => {
    setCurrentId(e.target.value === 0 ? '' : e.target.value);
  };

  useEffect(() => {
    navigate.push(PATH_DASHBOARD.telebot.history(currentId));
  }, [currentId]);

  const [dataHistory, setDataHistory] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    getHistory();

  }, [page]);

  const [isLoading, setLoading] = useState(false);

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await API_TELEBOT.getBotHistory(currentId, page);
      if (response.status === 200) {
        setDataHistory(response.data.d);
        setTotalPage(response.data.totalPage);

        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBotHistory = (data) => {
    if (currentId === '') {
      getHistory();

      return;
    }
    if (data.botId.toString() === currentId) {
      getHistory();
    }
  };

  const [waitingStatus, setStatusWait] = useState(translate('wait'));
  const [countDown, setCountdown] = useState('00');
  const current = { oldSession: 0, newSession: 0 };

  const handleStatus = (data) => {
    try {
      if (data.isBetSession) {
        const countDown = 30 + data.order;
        setCountdown(countDown < 10 ? `0${countDown}` : countDown);
        setStatusWait(`${translate('wait')} (${countDown}s)`);

        return;
      }

      if (currentId === '') {
        current.newSession = data.session;

        if (current.newSession !== current.oldSession) {
          current.oldSession = current.newSession;
          setTimeout(getHistory, 5000);
        }
      }

      setCountdown(data.order < 10 ? `0${data.order}` : data.order);

      setStatusWait(`${translate('wait')} (${data.order}s)`);
    } catch (e) {
      console.log(e);
    }
  };

  const listenSocket = () => {
    socketWeb.current.on('BO_PRICE', handleStatus);
    socket.current.on('update_telebothistory', handleUpdateBotHistory);
    socket.current.emit('telehistory-room', { type: 'join', _id: currentId });
  };

  const cancelListenSocket = () => {
    socketWeb.current.off('BO_PRICE', handleStatus);
    socket.current.off('update_telebothistory', handleUpdateBotHistory);
    socket.current.emit('telehistory-room', { type: 'leave', _id: currentId });
  };

  useEffect(() => {
    listenSocket();

    return ()=> cancelListenSocket();

  }, [socketWeb, socket, page, currentId]);

  const deleteHistory = async () => {
    const next = async () => {
      try {
        const response = await API_TELEBOT.deleteBotHistory(currentId);
        if (response.status === 200) {
          enqueueSnackbar(translate('success'), { variant: 'success' });
          getHistory();

          return;
        }
      } catch (e) {
        console.log(e);
      }
    };
    handleOpenAlertDialog(translate('are_u_want_to_del_history_config'), '', 'warning', next);
  };

  useEffect(() => {
    getHistory();
  }, [currentId]);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    try {
      const tempData = [];
      dataHistory.forEach((history, index) => {
        const obj = {
          id: index,
          _id: history._id,
          time: format(new Date(history.betTime), 'HH:mm:ss dd/MM'),
          accountType: history.account_type,
          result: history.result,
          betType: history.betType,
          betAmount: history.betAmount,
          winAmount: history.winAmount,
          message: history.message,
          session: history.session,
          iconClient: `/client-icons/${history.clientId}.ico`,
          botData: history.botData,
        };
        tempData.push(obj);
      });

      setRows(tempData);
    } catch (e) {
      console.log(e);
    }
  }, [dataHistory]);
  const classes = useStyles();

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
      <AlertDialog isOpen={isOpenAlertDialog} setOpen={setOpenAlertDialog} data={alertData} />

      <Card sx={props.sx}>
        <CardHeader
          title="Lịch sử Bot"
          action={
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                fullWidth
                label={translate('bot_configuration_name')}
                select
                onChange={(e) => {
                  handleChangeBotId(e);
                }}
                value={currentId === '' ? 0 : currentId}
                name="botId"
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
                  key={0}
                  checked
                  value={0}
                  sx={{
                    mx: 1,
                    my: 0.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    textTransform: 'capitalize',
                  }}
                >
                  {translate('all')}
                </MenuItem>
                {botList ? (
                  botList.map((option) => (
                    <MenuItem
                      key={option._id}
                      checked
                      value={option._id}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      }}
                    >
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  <></>
                )}
              </TextField>
              {_id === '' ? (
                <Button
                  variant="contained"
                  startIcon={<Iconify icon={'fluent:delete-12-filled'} />}
                  onClick={deleteHistory}
                  color="error"
                >
                  {translate('delete')}
                </Button>
              ) : (
                <MoreMenuButton
                  id={_id}
                  handleDelete={deleteHistory}
                  handleActionBot={handleActionBot}
                  details={botInfo}
                />
              )}
            </Stack>
          }
        />
        <CardContent className={classes.root}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead
              className={classes.thead}
              sx={{
                borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <TableRow>
                {/* <TableCell padding="checkbox" /> */}
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('session')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('bet_type')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('result')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('bet_amount')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('win_amount')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>{translate('time')}</TableCell>
              </TableRow>
            </TableHead>
            <StyledTableBody>
              {isLoading && (
                <LimitedBackdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                  <CircularProgress color="inherit" />
                </LimitedBackdrop>
              )}

              {rows.map((row, index) => (
                <ExpandableTableRow
                  hover
                  sx={{
                    borderBottom: (theme) => index !== rows.length - 1 && `solid 1px ${theme.palette.divider}`,
                  }}
                  key={row._id}
                  expandComponent={<ExtraComponent row={row} />}
                >
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'secondary'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.session}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <BetType row={row} />
                  </TableCell>
                  <TableCell colSpan={row.result === 4 ? 3 : 1}>
                    {' '}
                    <Result row={row} countDown={countDown} />{' '}
                  </TableCell>

                  {row.result !== 4 ? (
                    <>
                      <TableCell>
                        {
                          <Label
                            variant={theme.palette.mode === 'light' ? 'filled' : 'ghost'}
                            color={'warning'}
                            sx={{ fontSize: '0.8em' }}
                          >
                            {parseFloat(row.betAmount.toFixed(3))}
                          </Label>
                        }
                      </TableCell>
                      <TableCell>
                        <WinAmount row={row} />
                      </TableCell>
                      <TableCell>
                        {
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={'default'}
                            sx={{ fontSize: '0.8em' }}
                          >
                            {row.time}
                          </Label>
                        }
                      </TableCell>
                    </>
                  ) : (
                    <TableCell>
                      {
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={'default'}
                          sx={{ fontSize: '0.8em' }}
                        >
                          {row.time}
                        </Label>
                      }
                    </TableCell>
                  )}
                </ExpandableTableRow>
              ))}
            </StyledTableBody>
          </Table>
        </CardContent>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Pagination
            siblingCount={0}
            size="medium"
            count={totalPage}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            color="secondary"
          />
        </Stack>
      </Card>
    </>
  );
}

const WinAmount = ({ row }) => {
  const theme = useTheme();
  if (row.winAmount === 0)
    return (
      <Label variant={theme.palette.mode === 'light' ? 'filled' : 'ghost'} color={'error'} sx={{ fontSize: '0.8em' }}>
        {parseFloat(row.winAmount.toFixed(3))}
      </Label>
    );
  if (row.winAmount === row.betAmount)
    return (
      <Label variant={theme.palette.mode === 'light' ? 'filled' : 'ghost'} color={'default'} sx={{ fontSize: '0.8em' }}>
        +{parseFloat(row.winAmount.toFixed(3))}
      </Label>
    );
  if (row.winAmount > row.betAmount)
    return (
      <Label variant={theme.palette.mode === 'light' ? 'filled' : 'ghost'} color={'success'} sx={{ fontSize: '0.8em' }}>
        +{parseFloat(row.winAmount.toFixed(3))}
      </Label>
    );
};

const Result = ({ row, countDown }) => {
  const theme = useTheme();
  const { translate } = useLocales();
  if (row.result === 0)
    return (
      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'error'} sx={{ fontSize: '0.8em' }}>
        LOSE
      </Label>
    );
  if (row.result === 1)
    return (
      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'success'} sx={{ fontSize: '0.8em' }}>
        WIN
      </Label>
    );
  if (row.result === 2)
    return (
      <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'default'} sx={{ fontSize: '0.8em' }}>
        TIE-BREAK
      </Label>
    );
  if (row.result === 3)
    return (
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', top: '5px', left: '7px', fontSize: 10 }}>{countDown}</span>
        <CircularProgress color="warning" percentage={12} size={25} />
      </div>
    );
  if (row.result === 4) return <>{translate(row.message)}</>;
};

const BetType = ({ row }) => {
  if (row.betType === 'NONE') {
    if (row.message === 'bot_start')
      return (
        <IconButton sx={{ bgcolor: 'warning.main' }} size={'small'}>
          <Iconify icon={'cryptocurrency:start'} color="black" width={15} height={15} />
        </IconButton>
      );
    if (row.message === 'bot_stop')
      return (
        <IconButton sx={{ bgcolor: 'warning.main' }} size={'small'}>
          <Iconify icon={'fa:stop-circle'} color="black" width={15} height={15} />
        </IconButton>
      );
    if (row.message === 'bot_take_target')
      return (
        <IconButton sx={{ bgcolor: 'warning.main' }} size={'small'}>
          <Iconify icon={'fluent:target-arrow-24-filled'} color="black" width={15} height={15} />
        </IconButton>
      );
  }

  return (
    <IconButton sx={{ bgcolor: row.betType === 'UP' ? 'success.main' : 'error.main' }} size={'small'}>
      <Iconify
        icon={row.betType === 'UP' ? 'fa6-solid:arrow-trend-up' : 'fa6-solid:arrow-trend-down'}
        width={15}
        height={15}
        sx={{
          color: 'white',
        }}
      />
    </IconButton>
  );

};

const ExtraComponent = ({ row }) => {
  const { translate } = useLocales();

  return (
    <TableCell colSpan={6}>
      <Typography>
        {translate('bot_configuration_name')} : {row.botData.botInfo.name}
      </Typography>
      <Typography>
        {translate('account_type')} : {row.botData.botInfo.account_type}
      </Typography>
      <Typography>
        {translate('profit')} : {parseFloat(parseFloat(row.botData.runningData.profit).toFixed(2))} $
      </Typography>
      <Typography>
        {translate('volume')} : {parseFloat(parseFloat(row.botData.runningData.volume).toFixed(2))} $
      </Typography>
      <Typography>
        {translate('capital_management')} {row.botData.botInfo.capital_management_type === 0 && translate('martingale')}{' '}
        {row.botData.botInfo.capital_management_type === 1 && translate('fibo1step')}{' '}
        {row.botData.botInfo.capital_management_type === 2 && translate('fibo2step')}{' '}
        {row.botData.botInfo.capital_management_type === 3 && translate('victor1')}{' '}
        {row.botData.botInfo.capital_management_type === 4 && translate('victor2')}{' '}
        {row.botData.botInfo.capital_management_type === 5 && translate('victor3')} :{' '}
        {row.botData.botInfo.capital_management.split('\n').map((capital, key) => (

          <Typography key={key}>{capital}</Typography>
        ))}
      </Typography>
    </TableCell>
  );
};

const ExpandableTableRow = ({ children, expandComponent, ...otherProps }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        {...otherProps}
      >
        {children}
      </TableRow>
      {isExpanded && (
        <TableRow
          sx={{
            borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          {expandComponent}
        </TableRow>
      )}
    </>
  );
};

export default History;

// ----------------------------------------------------------------------

function MoreMenuButton({ handleDelete, handleActionBot, details, id, colorBtn = 'warning.main' }) {
  const { translate } = useLocales();
  const navigate = useNavigate();

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
  const [isOpenInfo, setOpenInfo] = useState(false);

  return (
    <>
      <InfoDialog data={details} isOpen={isOpenInfo} setIsOpen={setOpenInfo} />

      <Button
        style={{ whiteSpace: 'nowrap' }}
        size="small"
        onClick={handleOpen}

        // sx={{
        //   color: details && details.isRunning ? 'success.main' : 'warning.main',
        // }}
        color={details && details.isRunning ? 'success' : 'warning'}
        variant="contained"
      >
        <span style={{ paddingLeft: 10, marginTop: 5 }}>
          <Iconify
            style={{
              width: 15,
              height: 15,
              marginRight: 3,
              justifyContent: 'center',
              alignItems: 'center',
              textCenter: 'center',
            }}
            icon={'ant-design:setting-filled'}
          />
        </span>
        <span style={{ paddingLeft: 1, paddingRight: 10 }}>{translate('actions')}</span>
      </Button>

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
        {details && details.isRunning ? (
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
            setOpenInfo(true);
            setOpen(null);
          }}
        >
          <Iconify icon={'entypo:info-with-circle'} sx={{ ...ICON }} />
          {translate('info')}
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
          {translate('delete_history')}
        </MenuItem>
      </MenuPopover>
    </>
  );
}
