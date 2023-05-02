import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { Stack, MenuItem, Card, CardContent, Button, Typography } from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useEffect, useContext, useState, useCallback } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import { SocketContext } from 'src/contexts/socketWeb';
import useLocales from 'src/hooks2/useLocales';
import { getExchange } from 'src/redux/dashboard/account/action';
import { API_COPYTRADE, API_WALLET } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';

// import { getExchange } from '../../../../redux/dashboard/account/action';

// import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// import useIsMountedRef from '../../../../hooks/useIsMountedRef';

// import useLocales from '../../../../hooks/useLocales';

// import { SocketContext } from '../../../../contexts/socketWeb';
// import { API_COPYTRADE, API_WALLET } from '../../../../apis';

function PersonalBetForm() {
  const isMountedRef = useIsMountedRef();
  const socket = useContext(SocketContext);

  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  const BetSchema = Yup.object().shape({
    accountType: Yup.string().required(translate('this_is_required_information')),
    marginDense: Yup.number(translate('must_enter_number')).required(translate('this_is_required_information')),
    linkAccountId: Yup.string().required(translate('please_choose_a_trading_account')),
  });

  useEffect(() => {
    if (exchangeAccounts && exchangeAccounts.length > 0) {
      setValue('linkAccountId', exchangeAccounts[0]._id);
      handleChangeAccount(null);
    }
  }, [exchangeAccounts]);

  const defaultValues = {
    linkAccountId: exchangeAccounts && exchangeAccounts.length > 0 ? exchangeAccounts[0]._id : 1,
    accountType: 'LIVE',
    marginDense: '1',
  };

  const methods = useForm({
    resolver: yupResolver(BetSchema),
    defaultValues,
  });

  const {
    getValues,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handSendBetBtn = async (type) => {
    try {
      const obj = {
        accountType: getValues('accountType'),
        marginDense: getValues('marginDense'),
        linkAccountId: getValues('linkAccountId'),
        betType: type,
      };
      if (obj.linkAccountId === 1) {
        enqueueSnackbar(translate('trading_account_is_not_valid'), {
          variant: 'error',
        });

        return;
      }
      const response = await API_COPYTRADE.personalTrade(obj);

      if (response.status === 200) {
        const data = response.data.data.data;
        if (data.ok) {
          enqueueSnackbar(translate('successfully_entered_order'), {
            variant: 'success',
          });
          handleChangeAccount(null);

          return;
        }
        enqueueSnackbar(data.m, {
          variant: 'error',
        });

        return;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const [boPrice, setBoPrice] = useState({});
  const [isBetSession, setIsBetSession] = useState(false);

  const [balance, setBalance] = useState({
    demo: '',
    real: '',
  });

  const handleChangeAccount = useCallback(
    async (e) => {
      const linkAccountId = e === null ? getValues('linkAccountId') : e.target.value;
      if (linkAccountId) {
        setValue('linkAccountId', linkAccountId);
        const response = await API_WALLET.getBalance(linkAccountId);
        if (isMountedRef.current) {
          if (response.data.ok) {
            setBalance({
              demo: `: ${response.data.d.demoBalance}$`,
              real: `: ${response.data.d.availableBalance}$`,
            });
          }
        }
      }
    },
    [isMountedRef]
  );

  const handleUpdateBoPrice = (data) => {
    setBoPrice(data);
    setIsBetSession(data.isBetSession);
  };

  useEffect(() => {
    socket.current.on('BO_PRICE', handleUpdateBoPrice);

    return () => socket.current.off('BO_PRICE', handleUpdateBoPrice);
  }, [socket]);

  useEffect(() => {
    if (!exchangeAccounts || (exchangeAccounts && exchangeAccounts.length === 0)) getExchangeAccount();
  }, []);

  return (
    <FormProvider methods={methods}>
      <Card>
        <CardContent>
          <Stack spacing={3} direction={{ xs: 'column', sm: 'column' }} sx={{ py: 2.5, px: 3 }}>
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
            <RHFTextField
              size="small"
              fullWidth
              select
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
                {translate('demo_account')} {balance.demo}
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
                {translate('live_account')} {balance.real}
              </MenuItem>
            </RHFTextField>
            <RHFTextField name="marginDense" label={translate('bet_amount')} size="small" />

            <Typography variant="caption" sx={{ textAlign: 'center', color: 'orange', fontSize: '1em' }}>
              {boPrice && boPrice.isBetSession
                ? `${translate('session')} ${boPrice.session ? boPrice.session : '0'} : ${translate('please_trade')} (${
                    boPrice.order ? boPrice.order : '0'
                  }s)`
                : `${translate('session')} ${boPrice.session ? boPrice.session : '0'} :  ${translate(
                    'waiting_result'
                  )}  (${boPrice.order ? boPrice.order : '0'}s)`}
            </Typography>
            <Stack spacing={1}>
              <Button
                disabled={!isBetSession}
                size="large"
                sx={{ width: '100%' }}
                color="success"
                onClick={() => {
                  handSendBetBtn('UP');
                }}
                variant="contained"
              >
                {translate('up').toUpperCase()}
              </Button>

              <Button
                disabled={!isBetSession}
                size="large"
                sx={{ width: '100%' }}
                color="error"
                onClick={() => {
                  handSendBetBtn('DOWN');
                }}
                variant="contained"
              >
                {translate('down').toUpperCase()}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </FormProvider>
  );
}

export default PersonalBetForm;
