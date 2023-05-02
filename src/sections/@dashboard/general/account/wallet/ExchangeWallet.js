import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  CardContent,
  Stack,
  Typography,
  CircularProgress,
  Pagination,
} from '@mui/material';
import { format } from 'date-fns';

import { makeStyles } from '@material-ui/core/styles';
import useLocales from 'src/hooks2/useLocales';
import { API_WALLET } from 'src/apis';
import Iconify from 'src/component/Iconify';
import ExchangeMoney from './ExchangeMoney';


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

function ExchangeWallet({ balance, handleReloadBalance, linkAccountId, setMaxWidth, reloadInfo }) {
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const [exchange, setExchange] = useState(false);

  const handleBack = () => {
    setExchange(false);
    setMaxWidth('md');
  };

  const resetDemoBalance = async () => {
    const response = await API_WALLET.resetDemo(linkAccountId);

    if (response.data.ok) {
      if (reloadInfo !== null) {
        reloadInfo();
      }
      enqueueSnackbar(translate('success'), { variant: 'success' });
      handleReloadBalance(false);

      return;
    }
    enqueueSnackbar(translate('failed'), { variant: 'error' });
  };

  const handleShowExchange = () => {
    setExchange(true);
  };

  useEffect(() => {
    setMaxWidth('md');
    setLoading(false);
  }, []);

  if (exchange) {
    return (
      <ExchangeMoney
        linkAccountId={linkAccountId}
        balance={balance}
        setMaxWidth={setMaxWidth}
        handleReloadBalance={handleReloadBalance}
        handleBack={handleBack}
        reloadInfo={reloadInfo}
      />
    );
  }

  return (
    <Grid container spacing={1}>
      {loading ? (
        <Grid item xs={12} md={12}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <CircularProgress />
          </Stack>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h4" align="center">
                    {translate('live_account')}
                  </Typography>
                  <Typography variant="h4" align="center" sx={{ color: 'warning.main' }}>
                    $ {balance.availableBalance}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleShowExchange}
                    color="info"
                    startIcon={<Iconify icon={'bi:currency-exchange'} />}
                  >
                    {translate('transfer')}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="h4" align="center">
                    {translate('demo_account')}
                  </Typography>
                  <Typography variant="h4" align="center" sx={{ color: 'warning.main' }}>
                    $ {balance.demoBalance}
                  </Typography>
                  <Button
                    onClick={resetDemoBalance}
                    variant="contained"
                    color="info"
                    startIcon={<Iconify icon={'ion:reload-circle-sharp'} />}
                  >
                    Nạp lại
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {balance.aliPrice > 0 && (
            <Grid item xs={12} md={12}>
              <Transactions linkAccountId={linkAccountId} />
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
}

const Transactions = ({ linkAccountId }) => {
  const { translate } = useLocales();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const getTransactions = async () => {
    const response = await API_WALLET.spotTransactions(linkAccountId, page, total);
    const current = { page: 0 };
    setTotal(response.data.d?.t);

    current.page = Math.round(response.data.d.t / 10);

    if (response.data.d.t / 10 > current.page) {
      current.page += 1;
    }
    setRows(response.data.d.c);
    if (page !== totalPage) setTotalPage(current.page);
  };

  const [rows, setRows] = useState([]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const classes = useStyles();

  useEffect(() => {
    getTransactions();
  }, [page]);

  return (
    <Card>
      <CardHeader title={translate('transaction_history')} />
      <CardContent className={classes.root}>
        <Stack spacing={2}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.thead}>
              <TableRow>
                {/* <TableCell padding="checkbox" /> */}
                <TableCell>{translate('time')}</TableCell>
                <TableCell>{translate('value')}</TableCell>
                <TableCell>{translate('type')}</TableCell>
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
                  <TableCell>{format(new Date(row.transactionTime), 'HH:mm:ss dd/MM')}</TableCell>
                  <TableCell>
                    <Amount row={row} />
                  </TableCell>
                  <TableCell>
                    <Type row={row} />
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

const Amount = ({ row }) => {
  try {
    const current = { color: 'success.main' };
    if (row.type.indexOf('TRANSFER_OUT') > -1) {
      current.color = 'error.main';
    }

    return (
      <Typography sx={{ color: current.color }}>
        {row.type.indexOf('TRANSFER_OUT') > -1
          ? `-${parseFloat(row.amount.toFixed(6))}`
          : `+${parseFloat(row.amount.toFixed(6))}`}
      </Typography>
    );
  } catch (e) {
    return <></>;
  }
};

const Type = ({ row }) => {
  const { translate } = useLocales();

  try {
    return <Typography>{translate(row.type.toLowerCase())}</Typography>;
  } catch (e) {
    return <></>;
  }
};

const Status = ({ row }) => {
  const current = { status: 'eva:done-all-fill', color: 'success.main' };
  if (row.status === 'Processing' || row.status === 'Pending') {
    current.status = 'fluent-emoji:hourglass-done';
  }

  return <Iconify sx={{ color: current.color, width: 60 }} icon={current.status} />;
};

export default ExchangeWallet;
