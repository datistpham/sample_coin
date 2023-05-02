import { useSnackbar } from 'notistack';

import {
  Stack,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Backdrop,
} from '@mui/material';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { useTheme } from '@mui/material/styles';

import { useEffect, useState, useContext } from 'react';
import { SocketContext as SocketContextWeb } from 'src/contexts/socketWeb';
import useLocales from 'src/hooks2/useLocales';
import { API_TELEBOT } from 'src/apis';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Iconify from 'src/component/Iconify';
import Label from 'src/component/Label';
import {useRouter } from "next/router"


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

function SignalList(props) {
  const router = useRouter();

  // const socket = useContext(SocketContext);
  const socketWeb = useContext(SocketContextWeb);

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();

  const [rows, setRows] = useState([]);

  const [data, setData] = useState([]);

  useEffect(() => {
    getHistory();
    
  }, []);

  const [isLoading, setLoading] = useState(false);

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await API_TELEBOT.getTopList();
      if (response.status === 200) {
        setData(response.data.d);

        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const newData =
        search !== '' ? data.filter((a) => a.name.toLowerCase().indexOf(search.target.value.toLowerCase()) > -1) : data;
      setRows(newData);
    } catch (e) {
      console.log(e);
    }

  }, [data]);

  // const [waitingStatus, setStatusWait] = useState(translate('wait'));
  // const [countDown, setCountdown] = useState('00');

  const current = { oldSession: 0, newSession: 0 };

  const handleStatus = (data) => {
    try {
      if (data.isBetSession) {
        //  const countDown = 30 + data.order;
        // setCountdown(countDown < 10 ? `0${countDown}` : countDown);
        // setStatusWait(`${translate('wait')} (${countDown}s)`);
        return;
      }

      current.newSession = data.session;

      if (current.newSession !== current.oldSession) {
        current.oldSession = current.newSession;
        setTimeout(getHistory, 5000);
      }

      //  setCountdown(data.order < 10 ? `0${data.order}` : data.order);

      // setStatusWait(`${translate('wait')} (${data.order}s)`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleViewHistory = (_id) => {
    try {
      router.push(PATH_DASHBOARD.telebot.history_customer(_id));
    } catch (e) {
      console.log(e);
    }
  };

  const listenSocket = () => {
    socketWeb.current?.on('BO_PRICE', handleStatus);
  };

  const cancelListenSocket = () => {
    socketWeb.current?.off('BO_PRICE', handleStatus);
  };

  useEffect(() => {
    listenSocket();


  }, [socketWeb]);

  const classes = useStyles();

  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    try {
      setSearch(e.target.value);
      const newData = data.filter((a) => a.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);
      setRows(newData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {' '}
      <Card sx={props.sx}>
        {/* <CardHeader title={translate('list_signal')} /> */}
        <CardContent className={classes.root}>
          <Stack direction="row" spacing={1}>
            <TextField
              value={search}
              onChange={handleSearch}
              size="small"
              label={translate('type_name_want_to_search')}
              fullWidth
            />
          </Stack>
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
                  {translate('Lịch sử')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>{translate('name')}</TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('win_streak')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('loss_streak')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('victor_streak')}
                </TableCell>
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>Win / Lose</TableCell>
                {/* <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('profit')}
                </TableCell> */}
                <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                  {translate('volume')}
                </TableCell>
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
                    <IconButton
                      onClick={() => {
                        handleViewHistory(row._id);
                      }}
                      sx={{ bgcolor: 'primary.main', color: 'white' }}
                      size="small"
                      variant="contained"
                    >
                      <Iconify icon={'material-symbols:work-history'} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'secondary'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.name}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'success'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.winStreak}/{row.bestWinStreak}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'error'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.loseStreak}/{row.bestLoseStreak}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'warning'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.victorStreak}/{row.bestVictorStreak}
                    </Label>
                  </TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'info'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.winTotal}/{row.loseTotal}
                    </Label>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'default'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {row.winTotal - row.loseTotal}
                    </Label>
                  </TableCell>
                  {/* <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'default'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {parseFloat(parseFloat(row.profit.toFixed(2)))} $
                    </Label>
                  </TableCell> */}
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={'primary'}
                      sx={{ fontSize: '0.8em' }}
                    >
                      {parseFloat(parseFloat(row.volume.toFixed(2)))} $
                    </Label>
                  </TableCell>
                </TableRow>
              ))}
            </StyledTableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export default SignalList;
