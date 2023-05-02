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
import { useRouter } from 'next/router';
import { SocketContext as SocketContextWeb } from 'src/contexts/socketWeb';
import { SocketContext } from 'src/contexts/socket';
import useLocales from 'src/hooks2/useLocales';
import { API_TELEBOT } from 'src/apis';
import Iconify from 'src/component/Iconify';
import Label from 'src/component/Label';
import { PATH_DASHBOARD } from 'src/routes/paths';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto',
    '& .MuiTableCell-head': {
      color: 'white',
      backgroundColor: 'transparent',
    },
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

function HistoryCustomer(props) {
  const navigate = useRouter();

  const { _id = '' } = navigate.query;

  const socket = useContext(SocketContext);
  const socketWeb = useContext(SocketContextWeb);

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

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
      const response = await API_TELEBOT.getBotHistory(_id, page);
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
    if (_id === '') {
      getHistory();

      return;
    }
    if (data.botId.toString() === _id) {
      getHistory();
    }
  };

  const [waitingStatus, setStatusWait] = useState(translate('wait'));
  const [countDown, setCountdown] = useState('00');

  const handleStatus = (data) => {
    try {
      if (data.isBetSession) {
        const countDown = 30 + data.order;
        setCountdown(countDown < 10 ? `0${countDown}` : countDown);
        setStatusWait(`${translate('wait')} (${countDown}s)`);

        return;

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
    socket.current.emit('telehistory-room', { type: 'join', _id });
  };

  const cancelListenSocket = () => {
    socketWeb.current.off('BO_PRICE', handleStatus);
    socket.current.off('update_telebothistory', handleUpdateBotHistory);
    socket.current.emit('telehistory-room', { type: 'leave', _id });
  };

  useEffect(() => {
    listenSocket();

    return ()=> cancelListenSocket();
  }, [socketWeb, socket, page, _id]);

  useEffect(() => {
    getHistory();
  }, [_id]);

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

  return (
    <>
      {' '}
      <Card sx={props.sx}>
        <CardHeader
          title={translate('history_signal')}
          action={
            <Button
              onClick={() => {
                navigate.push(PATH_DASHBOARD.telebot.signal_list);
              }}
              size="small"
              startIcon={<Iconify icon="ic:outline-arrow-back" />}
              variant="contained"
              color="info"
            >
              {translate('back')}
            </Button>
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
                <TableRow
                  hover
                  sx={{
                    borderBottom: (theme) => index !== rows.length - 1 && `solid 1px ${theme.palette.divider}`,
                  }}
                  key={row._id}
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
                </TableRow>
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

export default HistoryCustomer;
