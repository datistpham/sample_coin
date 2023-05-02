import { useSnackbar } from 'notistack';
import { useState, useEffect, useContext, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Card, Grid, MenuItem, Button, CardContent, IconButton, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { getExchange } from '../../../../redux/dashboard/account/action';

// components

import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import Iconify from '../../../../components/Iconify';
import useLocales from '../../../../hooks/useLocales';

import { WidgetStatic, CalendarMonth } from './index';
import { WalletDialog } from '../account';

import SettingDetails from './SettingDetails';
import { SocketContext } from '../../../../contexts/socket';
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
import { API_WALLET, API_EXCHANGE } from '../../../../apis';
import WidgetTotalTarget from './WidgetTotalTarget';

function StaticAccount(props) {
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
  }, []);

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
      socket.current?.off('update_history_trading', handleUpdateHistoryTrading);
      socket.current?.off('update_bothistory', handleUpdateBotHistory);
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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <WalletDialog
        isOpen={openWallet}
        linkAccountId={linkAccountId}
        handleClose={handleCloseWallet}
        reloadInfo={() => {
          handleChangeAccount(null);
        }}
      />
      <Grid className={"tag-x-1"} container>
        <Grid className={"tag-x-1"} container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card style={{height: "100%"}}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={6} md={6}>
                    <RHFTextField
                      size="small"
                      fullWidth
                      select
                      name="linkAccountId"
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
                        <></>
                      )}
                    </RHFTextField>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <RHFTextField
                      size="small"
                      fullWidth
                      select
                      onClick={() => handleChangeAccount(null)}
                      name="accountType"
                      label={translate('account_type')}
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
                    </RHFTextField>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Button
                      startIcon={<Iconify icon={'bi:currency-exchange'} />}
                      variant="contained"
                      onClick={handleOpenWallet}
                      size={'small'}
                      fullWidth
                      sx={{ mt: 1 }}
                      md={6}
                      xs={6}
                    >
                      {translate('wallet')}
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Button
                      startIcon={<Iconify icon={'ion:reload-circle'} />}
                      variant="contained"
                      color="info"
                      onClick={() => handleChangeAccount(null)}
                      size={'small'}
                      fullWidth
                      sx={{ mt: 1 }}
                      md={6}
                      xs={6}
                    >
                      {translate('refresh')}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
         
          <Grid item spacing={2} className={"tag-x-1"} container md={6}>
            <Grid item className={"tag-x-1"} xs={12} md={6}>
              <WidgetStatic

                title={translate('balance')}
                isMoney={false}
                total={
                  isLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <span style={{ color: '#44a963' }}>
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
            <Grid item xs={12} md={6}>
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
                    <span style={{ color: '#4488a9' }}>{parseFloat(statics.profitDay.toFixed(2))} $</span>
                  )
                }
                color="info"
                icon={'fa6-solid:circle-dollar-to-slot'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <WidgetStatic
                title={translate('volume_day')}
                isMoney={false}
                total={
                  isLoading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <span style={{ color: '#a99844' }}>{parseFloat(statics.volumeDay.toFixed(2))} $</span>
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
            <Grid item xs={12} md={6}>
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
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} marginTop={2}>
          <CalendarMonth linkAccountId={linkAccountId} accType={getValues('accountType').toUpperCase()} />
        </Grid>
        <Grid className={"tag-x-1"} container spacing={2} marginTop={1}>
          <Grid item xs={12} md={6}>
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
        </Grid>
        
        
      </Grid>
    </FormProvider>
  );
}

const WinLoseStatic = ({ winTotal, loseTotal }) => (
  <>
    <span style={{ color: 'rgb(84, 214, 44)' }}>{winTotal}W</span> /{' '}
    <span style={{ color: 'rgb(255, 72, 66)' }}>{loseTotal}L</span>
  </>
);

export default StaticAccount;
