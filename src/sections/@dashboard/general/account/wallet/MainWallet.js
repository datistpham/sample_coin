import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  CardHeader,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

import { format } from 'date-fns';
import DepositMoney from './DepositMoney';
import WithdrawMoney from './WithdrawMoney';
import Iconify from 'src/component/Iconify';
import { API_WALLET } from 'src/apis';
import useLocales from 'src/hooks2/useLocales';


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

function MainWallet({ balance, handleReloadBalance, linkAccountId, setMaxWidth }) {
  const [deposit, setDeposit] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [typeWalletWithdraw, setTypeWalletWithdraw] = useState('USDT');

  const handleBack = () => {
    setDeposit(false);
    setWithdraw(false);
    setMaxWidth('md');
  };

  const handleShowDeposit = () => {
    setDeposit(true);
  };

  const handleShowWithdraw = (typeWallet) => {
    setTypeWalletWithdraw(typeWallet);
    setWithdraw(true);
  };

  useEffect(() => {
    setMaxWidth('md');
    setDeposit(false);
    setWithdraw(false);
  }, []);

  if (deposit) {
    return <DepositMoney linkAccountId={linkAccountId} setMaxWidth={setMaxWidth} handleBack={handleBack} />;
  }
  if (withdraw) {
    return (
      <WithdrawMoney
        linkAccountId={linkAccountId}
        typeWallet={typeWalletWithdraw}
        handleReloadBalance={handleReloadBalance}
        setMaxWidth={setMaxWidth}
        handleBack={handleBack}
      />
    );
  }

  return (

    <Main
      linkAccountId={linkAccountId}
      balance={balance}
      handleShowDeposit={handleShowDeposit}
      handleShowWithdraw={handleShowWithdraw}
    />
  );
}

const Main = ({ linkAccountId, balance, handleShowDeposit, handleShowWithdraw }) => {
  const { translate } = useLocales();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={8} md={8}>
                <ItemLeftIcon title={'USDT'} content={'Tether'} icon={'usdt'} />
              </Grid>
              <Grid item xs={4} md={4}>
                <ItemRight
                  total={parseFloat(balance.usdtAvailableBalance.toFixed(2))}
                  usd={balance.usdtAvailableBalance}
                />
              </Grid>
              {balance.aliPrice > 0 && (
                <>
                  {' '}
                  <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                    <Button
                      size={'small'}
                      variant="contained"
                      fullWidth
                      onClick={handleShowDeposit}
                      startIcon={<Iconify icon={'ri:luggage-deposit-fill'} />}
                    >
                      {translate('deposit')}
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                    <Button
                      size={'small'}
                      variant="contained"
                      color="warning"
                      fullWidth
                      onClick={() => {
                        handleShowWithdraw('USDT');
                      }}
                      startIcon={<Iconify icon={'uil:money-withdrawal'} />}
                    >
                      {translate('withdraw')}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {balance.aliPrice > 0 && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={8} md={8}>
                  <ItemLeftIcon title={'ALI'} content={'Alita'} icon={'ali'} />
                </Grid>
                <Grid item xs={4} md={4}>
                  <ItemRight
                    total={parseFloat(balance.aliAvailableBalance.toFixed(4))}
                    usd={balance.aliAvailableBalance * balance.aliPrice}
                  />
                </Grid>
                {balance.aliPrice > 0 && (
                  <>
                    {' '}
                    <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                      <Button
                        size={'small'}
                        variant="contained"
                        fullWidth
                        onClick={handleShowDeposit}
                        startIcon={<Iconify icon={'ri:luggage-deposit-fill'} />}
                      >
                        {translate('deposit')}
                      </Button>
                    </Grid>
                    <Grid item xs={6} md={6} sx={{ mt: 3 }}>
                      <Button
                        size={'small'}
                        variant="contained"
                        color="warning"
                        fullWidth
                        onClick={() => {
                          handleShowWithdraw('ALI');
                        }}
                        startIcon={<Iconify icon={'uil:money-withdrawal'} />}
                      >
                        {translate('withdraw')}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {balance.aliPrice > 0 && (
        <Grid item xs={12} md={12}>
          <Transactions linkAccountId={linkAccountId} />
        </Grid>
      )}
    </Grid>
  );
};

const ItemRight = ({ total, usd }) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Box sx={{ flexGrow: 1, minWidth: 160 }}>
      <Typography variant="subtitle2">{total}</Typography>

      <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
        <Typography variant="caption" sx={{ mr: 1 }}>
          ~$ {parseFloat(usd.toFixed(2))}
        </Typography>
      </Stack>
    </Box>
  </Stack>
);

const ItemLeftIcon = ({ title, content, icon }) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Box
      sx={{
        width: 48,
        height: 48,
        flexShrink: 0,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.neutral',
      }}
    >
      <img
        src={`/icons/${icon}.svg`}
        alt="USDT"
        style={{
          width: 35,
          height: 35,
        }}
      />
    </Box>

    <Box sx={{ flexGrow: 1, minWidth: 160 }}>
      <Typography variant="subtitle2">{title}</Typography>

      <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
        <Typography variant="caption" sx={{ mr: 1 }}>
          {content}
        </Typography>
      </Stack>
    </Box>
  </Stack>
);

const CURRENCIES = [
  { name: 'usdt', value: 'usdt', iconSrc: '/icons/usdt.svg' },
  { name: 'ali', value: 'ali', iconSrc: '/icons/ali.svg' },
  { name: 'trading_commission', value: 'TRADING_COMMISION', iconSrc: '/icons/win_coms.svg' },
];

const Transactions = ({ linkAccountId }) => {
  const { translate } = useLocales();
  const [type, setType] = useState('usdt');
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const getTransactions = async () => {
    const response = await API_WALLET.transactions(linkAccountId, type, page);
    const current = { page: 0 };
    current.page = Math.round(response.data.d.t / 10);
    if (response.data.d.t / 10 > current.page) {
      current.page += 1;
    }
    setRows(response.data.d.c);
    if (page !== totalPage) setTotalPage(current.page);
  };

  const [rows, setRows] = useState([]);

  
  const handleChange = (e) => {
    setPage(1);
    setType(e.target.value);
  };


  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const classes = useStyles();

  useEffect(() => {
    getTransactions();
  }, [type, page]);

  return (
    <Card>
      <CardHeader title={translate('transaction_history')} />
      <CardContent className={classes.root}>
        <Stack spacing={2}>
          <TextField select label={translate('type')} value={type} onChange={handleChange}>
            {CURRENCIES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <div style={{ display: 'flex' }}>
                  <img
                    src={option.iconSrc}
                    style={{ width: '15px', height: '15px', marginRight: '0.5em', marginTop: '0.2em' }}
                    alt="icon "
                  />
                  {translate(option.name)}
                </div>
              </MenuItem>
            ))}
          </TextField>

          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.thead}>
              <TableRow>
                {/* <TableCell padding="checkbox" /> */}
                <TableCell>{translate('time')}</TableCell>
                <TableCell>{translate('value')}</TableCell>
                <TableCell>{translate('txid/description')}</TableCell>
                <TableCell>{translate('memo')}</TableCell>
                <TableCell>{translate('status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  hover
                  sx={{
                    borderBottom: (theme) => index !== rows.length - 1 && `solid 1px ${theme.palette.divider}`,
                  }}
                  key={row.ts}
                >
                  <TableCell>{format(new Date(row.ts), 'HH:mm:ss dd/MM')}</TableCell>
                  <TableCell>
                    <Amount row={row} />
                  </TableCell>
                  <TableCell>
                    <TxId row={row} />
                  </TableCell>
                  <TableCell>
                    <Memo row={row} />
                  </TableCell>
                  <TableCell>
                    <Status row={row} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
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
  );
};

const Status = ({ row }) => {
  const current = { status: 'eva:done-all-fill', color: 'success.main' };
  if (row.status === 'Processing' || row.status === 'Pending') {
    current.status = 'fluent-emoji:hourglass-done';
  }

  return <Iconify sx={{ color: current.color, width: 60 }} icon={current.status} />;
};

const TxId = ({ row }) => {
  try {
    const openInNewTab = (url) => {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    };

    if (row.type === 'InternalWithdraw') {
      const obj = JSON.parse(row.txid);

      return <Typography sx={{ color: 'warning.main' }}> {obj.ReceiverNickName} </Typography>;
    }

    if (row.txid === '') return <></>;
    const data = JSON.parse(row.txid);

    if (!data.TransactionId) return <></>;

    return (
      <Typography
        sx={{ color: 'primary.main', cursor: 'pointer' }}
        onClick={() =>
          data.TransactionId.indexOf('0x') > -1 && openInNewTab(`https://bscscan.com/tx/${data.TransactionId}`)
        }
      >
        {data.TransactionId.indexOf('0x') > -1 ? `${data.TransactionId.substring(0, 8)}...` : data.TransactionId}
      </Typography>
    );
  } catch (e) {
    return <></>;
  }
};

const Memo = ({ row }) => {
  try {
    return <Typography>{row.memo}</Typography>;
  } catch (e) {
    return <></>;
  }
};

const Amount = ({ row }) => {
  try {
    const current = { color: 'success.main' };
    if (row.type.indexOf('Withdraw') > -1 || row.type.indexOf('BUY') > -1) {
      current.color = 'error.main';
    }

    return (
      <Typography sx={{ color: current.color }}>
        {row.type.indexOf('Withdraw') > -1 || row.type.indexOf('BUY') > -1
          ? `-${parseFloat(row.amount.toFixed(6))}`
          : `+${parseFloat(row.amount.toFixed(6))}`}
      </Typography>
    );
  } catch (e) {
    return <></>;
  }
};

export default MainWallet;
