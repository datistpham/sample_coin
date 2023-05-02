import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import {
  Box,
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
import Iconify from 'src/component/Iconify';
import { API_WALLET } from 'src/apis';


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

function RewardWallet({ balance, handleReloadBalance, linkAccountId, setMaxWidth, reloadInfo }) {
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const [info, setInfo] = useState(false);

  const getEventInfo = async () => {
    try {
      const response = await API_WALLET.eventsRewardInfo(linkAccountId);

      if (response.data.ok) {
        setInfo(response.data.d);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClaim = async () => {
    try {
      const response = await API_WALLET.eventClaimAll(linkAccountId);

      if (response.data.ok) {
        getEventInfo();
        enqueueSnackbar(translate('success'), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate('failed'), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setMaxWidth('lg');
    setLoading(false);
    getEventInfo();
  }, []);

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
          <Grid item xs={12} md={12}>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
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
                        }}
                      >
                        <img src="/icons/total_claim.svg" alt="total_claimed" />
                      </Box>

                      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            {translate('total_claimed_rewards')}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">{info ? info.totalClaimed : 0} ALI</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                        }}
                      >
                        <img src="/icons/cooling.svg" alt="total_claimed" />
                      </Box>

                      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            {translate('cooling_rewards')}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">{info ? info.coolingBalance : 0} ALI</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={3}>
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
                        }}
                      >
                        <img src="/icons/unclaimed.svg" alt="total_claimed" />
                      </Box>

                      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
                        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
                          <Typography variant="caption" sx={{ mr: 1 }}>
                            {translate('unclaimed_rewards')}
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">{info ? info.rewardBalance : 0} ALI</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Button
                        disabled={!info || info.rewardBalance === 0}
                        onClick={handleClaim}
                        fullWidth
                        startIcon={<Iconify icon={'emojione:baggage-claim'} />}
                        size="large"
                        variant={'contained'}
                      >
                        {translate('claim_all')}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* 
          {balance.aliPrice > 0 && (
            <Grid item xs={12} md={12}>
              <Transactions linkAccountId={linkAccountId} />
            </Grid>
          )} */}
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
    const response = await API_WALLET.eventsRewardHistory(linkAccountId, page, total);
    const current = { page: 0 };
    setTotal(response.data.d.t);

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
                <TableCell>{translate('value')}(ALI)</TableCell>
                <TableCell>{translate('volume')}</TableCell>
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

export default RewardWallet;
