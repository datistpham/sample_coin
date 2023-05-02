import { useSnackbar } from 'notistack';

import { MenuItem, Button, Stack, CircularProgress, Typography, Alert } from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useState, useEffect, useCallback, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// components


import Overview from '../Overview';
import { SocketContext } from 'src/contexts/socketWeb';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import { getExchange } from 'src/redux/dashboard/account/action';
import { API_AFFILIATE } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';
import useLocales from 'src/hooks2/useLocales';

export default function AutomaticActive() {
  const { enqueueSnackbar } = useSnackbar();
  const socket = useContext(SocketContext);

  const isMountedRef = useIsMountedRef();
  const { translate } = useLocales();

  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };
  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  useEffect(() => {
    if (!exchangeAccounts === 0) {
      getExchangeAccount();
    }
  }, []);

  const [currentRank, setCurrentRank] = useState(0);
  const [linkAccountId, setLinkAccountId] = useState(0);
  const [overviewData, setOverviewData] = useState({});

  const getOverview = async (id) => {
    if (id !== undefined && id !== '') {
      const response = await API_AFFILIATE.getOverview(id);
      if (response.data.ok) {
        setCurrentRank(response.data.d.rank);
        setOverviewData(response.data.d);
      }
    }
  };

  const handleChangeAccount = async (e) => {
    await getOverview(e.target.value);
    setValue('linkAccountId', e.target.value);
    handleCheckScanning(e.target.value);
    setLinkAccountId(e.target.value);
  };

  const NetworkSchema = Yup.object().shape({
    linkAccountId: Yup.string().required(translate('Vui lòng chọn tài khoản giao dịch')),
  });

  const defaultValues = {
    linkAccountId: '',
  };

  const methods = useForm({
    resolver: yupResolver(NetworkSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [systemScan, setSystemScan] = useState(false);

  const handleCheckScanning = (linkAccountId) => {
    socket.current.emit('system-scan', { type: 'status', linkAccountId });

    socket.current.on('system-scan', (data) => {
      if (data.type === 'status') {
        if (data.isScanning) {
          setSystemScan(true);

          return;
        }
        setSystemScan(false);
      }
    });
  };

  const [statusScan, setStatusScan] = useState({ total: 0, processed: -1 });
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (statusScan.processed === statusScan.total) {
      setSystemScan(false);
      setDone(true);
    }
  }, [statusScan]);

  useEffect(() => {
    if (systemScan) {
      setDone(false);
      socket.current.emit('system-scan', { type: 'start', linkAccountId: getValues('linkAccountId') });

      socket.current.on('system-scan', (data) => {
        if (data.d) {
          setStatusScan(data.d);
        }

        if (!data.isScanning) {
          setSystemScan(false);
          setDone(true);
        }
      });
      
      return;
    }
    if (!systemScan) {
      socket.current.emit('system-scan', { type: 'stop', linkAccountId: getValues('linkAccountId') });
    }

    return () => {
      socket.current.off('system-scan');
    };
  }, [systemScan]);

  const onSubmit = (e) => {
    try {
      setSystemScan(!systemScan);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 2.5, px: 3 }}>
        <RHFTextField
          size="small"
          fullWidth
          select
          name="linkAccountId"
          label={translate('exchange_account')}
          onChange={handleChangeAccount}
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
            ))
          ) : (
            <MenuItem
              key={1}
              checked
              value={1}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              <div style={{ display: 'flex' }}>{translate('not_affiliate_account_yet')}</div>
            </MenuItem>
          )}
        </RHFTextField>
        {systemScan ? (
          <>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <CircularProgress color="warning" />
            </Stack>
            <Typography align="center">
              Đang quét hệ thống, vui lòng chờ ({statusScan.processed}/{statusScan.total})
            </Typography>
          </>
        ) : (
          <></>
        )}

        {currentRank > 0 ? (
          <>
            <Button
              disabled={currentRank === 0}
              size="medium"
              startIcon={<Iconify icon={systemScan ? 'fa:stop-circle' : 'ant-design:security-scan-filled'} />}
              sx={{ width: '100%' }}
              type="submit"
              variant="contained"
              color={systemScan ? 'error' : 'warning'}
            >
              {systemScan ? translate('stop_scanning') : translate('system_scan')}
            </Button>
            <Overview data={overviewData} />
          </>
        ) : (
          <Alert variant="outlined" severity="warning">
            {translate(
              linkAccountId === 0 ? 'please_choose_a_trading_account' : 'your_account_not_been_activated_affiliate'
            )}
          </Alert>
        )}

        {done ? (
          <Alert variant="outlined" severity="success">
            Đã quét thành công tổng cộng : {statusScan.processed} thành viên
          </Alert>
        ) : (
          <></>
        )}
      </Stack>
    </FormProvider>
  );
}
