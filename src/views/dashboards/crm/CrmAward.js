// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import useIsMountedRef from 'src/hooks2/useIsMountedRef'
import { SocketContext } from 'src/contexts/socket'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { getExchange } from 'src/redux/dashboard/account/action'
import useLocales from 'src/hooks2/useLocales'
import { useCallback, useContext, useEffect, useState } from 'react'
import { API_EXCHANGE, API_WALLET } from 'src/apis'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form'
import { Grid, MenuItem } from '@mui/material'
import { FormProvider, RHFTextField } from 'src/component/hook-form'
import Iconify from 'src/component/Iconify'

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 106,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 95
  }
}))

const CrmAward = () => {
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
      <Card sx={{ position: 'relative' }}>
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
    </FormProvider>
  )
}

export default CrmAward
