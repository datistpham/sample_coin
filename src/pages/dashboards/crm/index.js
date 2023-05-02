// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CrmAward from 'src/views/dashboards/crm/CrmAward'

import { CircularProgress, IconButton, useTheme } from '@mui/material'
import Iconify from 'src/component/Iconify'
import WidgetStatic from 'src/views/dashboards/crm/WidgetStatic'
import useLocales from 'src/hooks2/useLocales'
import { useContext, useEffect, useState } from 'react'
import useIsMountedRef from 'src/hooks2/useIsMountedRef'
import { SocketContext } from 'src/contexts/socket'
import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { getExchange } from 'src/redux/dashboard/account/action'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import CalendarMonth from 'src/views/dashboards/crm/CalendarMonth'
import WidgetTotalTarget from 'src/views/dashboards/crm/WidgetTotalTarget'
import SettingDetails from 'src/views/dashboards/crm/SettingDetails'
import { API_EXCHANGE, API_WALLET } from 'src/apis'

const CrmDashboard = () => {
  const isMountedRef = useIsMountedRef();

  const socket = useContext(SocketContext);

  const { translate } = useLocales();

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  useEffect(() => {
    if (!exchangeAccounts || (exchangeAccounts && exchangeAccounts.length === 0)) getExchangeAccount();

  }, [exchangeAccounts]);

  useEffect(() => {
    if (exchangeAccounts && exchangeAccounts.length > 0) {
      setValue('linkAccountId', exchangeAccounts[0]._id);
      handleChangeAccount(null);
    }
  }, [exchangeAccounts]);

  const defaultValues = {
    linkAccountId: exchangeAccounts && exchangeAccounts.length > 0 ? exchangeAccounts[0]._id : '',
    accountType: 'LIVE',
  };

  const CreateSettingSchema = Yup.object().shape({
    linkAccountId: Yup.string().required(translate('please_choose_a_trading_account')),
    accountType: Yup.string().required(translate('Vui lòng chọn loại tài khoản')),
  });

  const methods = useForm({
    resolver: yupResolver(CreateSettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [balance, setBalance] = useState({
    demo: 0,
    real: 0,
  });

  useEffect(() => {
    handleChangeAccount(null);

  }, []);

  const [linkAccountId, setLinkAccountId] = useState();

  const [isLoading, setLoading] = useState(false);

  const handleChangeAccount = useCallback(
    async (e) => {
      setLoading(true);
      try {
        const linkAccountId = e === null ? getValues('linkAccountId') : e.target.value;
        if (linkAccountId) {
          setLinkAccountId(linkAccountId);
          showStaticLinkAccount(linkAccountId);
          setValue('linkAccountId', linkAccountId);
          const response = await API_WALLET.getBalance(linkAccountId);
          if (isMountedRef.current) {
            if (response.data.ok && response.data.d) {
              setBalance({
                demo: response.data.d.demoBalance,
                real: response.data.d.availableBalance,
              });

              return;
            }
            if (!response.data.ok) {
              setBalance({
                demo: 0,
                real: 0,
              });
            }
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [isMountedRef]
  );

  const handleUpdateBotHistory = (data) => {
    try {
      if (data.botData.linkAccountId.toString() === getValues('linkAccountId')) {
        handleChangeAccount(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdateHistoryTrading = (data) => {
    try {
      if (data.linkAccountId === getValues('linkAccountId')) {
        handleChangeAccount(null);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    socket.current?.on('update_history_trading', handleUpdateHistoryTrading);
    socket.current?.on('update_bothistory', handleUpdateBotHistory);

    return () => {
      socket?.current?.off('update_history_trading', handleUpdateHistoryTrading);
      socket?.current?.off('update_bothistory', handleUpdateBotHistory);
    };
  }, [socket]);

  const [statics, setStatics] = useState({
    profitDay: 0,
    totalProfit: 0,
    winDay: 0,
    loseDay: 0,
    volumeDay: 0,
  });

  const showStaticLinkAccount = useCallback(
    async (_id) => {
      try {
        const response = await API_EXCHANGE.getLinkAccount(_id);
        if (isMountedRef.current) {
          if (response.data.ok) {
            if (getValues('accountType').toUpperCase() === 'DEMO') {
              const data = response.data.d;
              setStatics({
                profitDay: data.profitDay_Demo,
                totalProfit: data.totalProfit_Demo,
                winDay: data.winDay_Demo,
                loseDay: data.loseDay_Demo,
                volumeDay: data.volumeDay_Demo,
                totalTakeProfit: data.totalTakeProfit_Demo || 0,
                totalStopLoss: data.totalStopLoss_Demo || 0,
              });

              return;
            }
            if (getValues('accountType').toUpperCase() === 'LIVE') {
              const data = response.data.d;
              setStatics({
                profitDay: data.profitDay_Live,
                totalProfit: data.totalProfit_Live,
                winDay: data.winDay_Live,
                loseDay: data.loseDay_Live,
                volumeDay: data.volumeDay_Live,
                totalTakeProfit: data.totalTakeProfit_Live || 0,
                totalStopLoss: data.totalStopLoss_Live || 0,
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    [isMountedRef]
  );

  const onSubmit = () => {};

  const [openWallet, setOpenWallet] = useState(false);
  const [linkAccountIdWallet, setLinkAccountIdWallet] = useState(0);

  const handleResetLinkAccount = async (type) => {
    try {
      const response = await API_EXCHANGE.resetLinkAccount(linkAccountId, type, getValues('accountType').toUpperCase());

      if (response.data.ok) {
        enqueueSnackbar(translate('success'), { variant: 'success' });
        if (getValues('accountType').toUpperCase() === 'DEMO') {
          const data = response.data.d;
          setStatics({
            profitDay: data.profitDay_Demo,
            totalProfit: data.totalProfit_Demo,
            winDay: data.winDay_Demo,
            loseDay: data.loseDay_Demo,
            volumeDay: data.volumeDay_Demo,
            totalTakeProfit: data.totalTakeProfit_Demo || 0,
            totalStopLoss: data.totalStopLoss_Demo || 0,
          });

          return;
        }
        if (getValues('accountType').toUpperCase() === 'LIVE') {
          const data = response.data.d;
          setStatics({
            profitDay: data.profitDay_Live,
            totalProfit: data.totalProfit_Live,
            winDay: data.winDay_Live,
            loseDay: data.loseDay_Live,
            volumeDay: data.volumeDay_Live,
            totalTakeProfit: data.totalTakeProfit_Live || 0,
            totalStopLoss: data.totalStopLoss_Live || 0,
          });
        }

        return;
      }
      enqueueSnackbar(translate('failed'), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  const handleOpenWallet = () => {
    setOpenWallet(true);
  };

  const handleCloseWallet = () => {
    setOpenWallet(false);
  };


  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className=''>
        <Grid item xs={12} md={4}>
          <CrmAward />
        </Grid>
        <Grid item xs={4} sm={4} md={4}>
           <WidgetStatic
              title={translate('balance')}
              isMoney={false}
              total={
                isLoading ? (
                  <CircularProgress size={25} />
                ) : (
                  <span style={{ color: '#44a963', fontSize: 30}}>
                    {getValues('accountType') === 'DEMO'
                      ? parseFloat(balance.demo.toFixed(2))
                      : parseFloat(balance.real.toFixed(2))}{' '}
                    $
                  </span>
                )
              }
              actions={
                <IconButton onClick={() => handleChangeAccount(null)}>
                  <Iconify icon={'ion:refresh-circle-sharp'} sx={{ color: 'warning.main' }} />
                </IconButton>
              }
              color="success"
              icon={'clarity:wallet-solid'}
            />
        </Grid>
        <Grid item xs={6} sm={4} md={4}>
        <WidgetStatic
            title={translate('profit_day')}
            isMoney={false}
            actions={
              <IconButton
                onClick={() => {
                  handleResetLinkAccount('profit_day');
                }}
              >
                <Iconify icon={'ion:refresh-circle-sharp'} sx={{ color: 'primary.main' }} />
              </IconButton>
            }
            total={
              isLoading ? (
                <CircularProgress size={25} />
              ) : (
                <span style={{ color: '#4488a9' , fontSize: 30}}>{parseFloat(statics.profitDay.toFixed(2))} $</span>
              )
            }
            color="info"
            icon={'fa6-solid:circle-dollar-to-slot'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4}>
          <WidgetStatic
            title={translate('volume_day')}
            isMoney={false}
            total={
              isLoading ? (
                <CircularProgress size={25} />
              ) : (
                <span style={{ color: '#a99844', fontSize: 30, fontSize: 30 }}>{parseFloat(statics.volumeDay.toFixed(2))} $</span>
              )
            }
            color="warning"
            actions={
              <IconButton
                onClick={() => {
                  handleResetLinkAccount('volumeDay');
                }}
              >
                <Iconify icon={'ion:refresh-circle-sharp'} sx={{ color: 'info.main' }} />
              </IconButton>
            }
            icon={'fa6-solid:sack-dollar'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4}>
          <WidgetStatic
            title="Win / Lose"
            isMoney={false}
            total={
              isLoading ? (
                <CircularProgress size={25} />
              ) : (
                <WinLoseStatic winTotal={statics.winDay} loseTotal={statics.loseDay} />
              )
            }
            color="error"
            actions={
              <IconButton
                onClick={() => {
                  handleResetLinkAccount('winLoseDay');
                }}
              >
                <Iconify icon={'ion:refresh-circle-sharp'} sx={{ color: 'success.main' }} />
              </IconButton>
            }
            icon={'humbleicons:exchange-vertical'}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={4}>
          <WidgetTotalTarget
            isMoney={false}
            totalTakeProfit={statics.totalTakeProfit}
            totalStopLoss={statics.totalStopLoss}
            accountType={getValues('accountType').toLowerCase()}
            _id={linkAccountId}
            total={isLoading ? <CircularProgress size={25} /> : `${parseFloat(statics.totalProfit.toFixed(2))} $`}
            actions={
              <IconButton
                onClick={() => {
                  handleResetLinkAccount('totalProfit');
                }}
              >
                <Iconify icon={'ion:refresh-circle-sharp'} sx={{ color: 'error.main' }} />
              </IconButton>
            }
            color="success"
            icon={'fa-solid:funnel-dollar'}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <SettingDetails linkAccountId={linkAccountId} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CalendarMonth linkAccountId={linkAccountId} accType={getValues('accountType').toUpperCase()} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

const WinLoseStatic = ({ winTotal, loseTotal }) => (
  <>
    <span style={{ color: 'rgb(84, 214, 44)', fontSize: 30 }}>{winTotal}W</span>
    {' '}
    <span style={{ fontSize: 30 }}>/</span>
    {' '}
    <span style={{ color: 'rgb(255, 72, 66)', fontSize: 30 }}>{loseTotal}L</span>
  </>
);

export default CrmDashboard
