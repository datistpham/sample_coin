import { useSnackbar } from 'notistack';

import {
  Stack,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Grid,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Typography,
} from '@mui/material';

import { makeStyles } from '@material-ui/core/styles';

import { useTheme } from '@mui/material/styles';

import { format } from 'date-fns';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useLocales from 'src/hooks2/useLocales';
import { API_JACKPOT } from 'src/apis';
import Claim2FA from './Claim2FA';
import Label from 'src/component/Label';



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

function JackpotData(props) {
  const { translate } = useLocales();
  const dispatch = useDispatch();
  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);
  const theme = useTheme();

  const [linkAccountId, setLinkAccountId] = useState('');
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const getHistoryWinning = async () => {

    try {
      const response = await API_JACKPOT.userWinningHistory(linkAccountId, page);
      if (response.data.ok) {
        setData(response.data.d.c);
        const current = { page: 0 };
        current.page = Math.round(response.data.t / 10);
        if (parseFloat(response.data.t / 10) > current.page) {
          current.page += 1;
        }
        setTotalPage(current.page);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(()=> {
    getHistoryWinning()
  }, [page]);

  const [openClaim, setOpenClaim] = useState(false);
  const [requestCode, setRequestCode] = useState('');

  const handleClaimWinning = async () => {
    const response = await API_JACKPOT.getCodeClaim2FA(linkAccountId);
    const rc = response.data;
    if (rc.ok) {
      setRequestCode(rc.d.data);
      setOpenClaim(true);
    }
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeAccount = async (e) => {
    setLinkAccountId(e.target.value);
  };

  useEffect(() => {
    getHistoryWinning();
    
  }, [linkAccountId]);

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  useEffect(() => {
    if (!exchangeAccounts) {
      getExchangeAccount();
    }
  }, []);

  const classes = useStyles();

  return (
    <Card>
      <CardHeader title={'Jackpot'} />
      <CardContent>
        <Claim2FA
          open={openClaim}
          setOpen={setOpenClaim}
          linkAccountId={linkAccountId}
          requestCode={requestCode}
          getHistoryWinning={getHistoryWinning}
        />
        <Grid container spacing={1}>
          <Grid item xs={12} md={12}>
            <TextField
              size="small"
              fullWidth
              select
              name="linkAccountId"
              value={linkAccountId}
              onChange={handleChangeAccount}
              label={translate('exchange_account')}
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
              {exchangeAccounts ? (
                exchangeAccounts
                  .filter((a) => a.access_type !== 1)
                  .map(
                    (option) =>
                      option.isLogin && (
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
                          <div style={{ display: 'flex' }}>
                            <img
                              src={`/client-icons/${option.clientId}.ico`}
                              style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
                              alt="icon "
                            />
                            {option.nickName}
                          </div>
                        </MenuItem>
                      )
                  )
              ) : (
                <></>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} md={12} className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead
                className={classes.thead}
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
              >
                <TableRow>
                  <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                    {translate('time')}
                  </TableCell>
                  <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                    {translate('Streak')}
                  </TableCell>
                  <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                    {translate('prize')}
                  </TableCell>
                  <TableCell style={{ color: theme.palette.mode === 'light' && 'black' }}>
                    {translate('status')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    hover
                    sx={{
                      borderBottom: (theme) => index !== data.length - 1 && `solid 1px ${theme.palette.divider}`,
                    }}
                    key={row._id}
                  >
                    <TableCell>{format(new Date(row.time), 'HH:mm dd/MM')}</TableCell>
                    <TableCell>
                      <Typography sx={{ color: row.type === 'WIN' ? 'success.main' : 'error.main' }}>
                        {row.streakname}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ color: 'info.main' }}>{parseFloat(row.prize.toFixed(2))} $</Typography>
                    </TableCell>
                    <TableCell>
                      {row.is_claimed ? (
                        <Label
                          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                          color={row.status === 'PENDING' ? 'warning' : 'primary'}
                        >
                          {translate(row.status)}
                        </Label>
                      ) : (
                        <Button size="small" variant="contained" onClick={handleClaimWinning}>
                          {translate('take')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </CardContent>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        {linkAccountId !== '' && (
          <Pagination
            siblingCount={0}
            size="medium"
            count={totalPage}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            color="secondary"
          />
        )}
      </Stack>
    </Card>
  );
}

export default JackpotData;
