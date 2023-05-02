import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import {
  Button,
  Grid,
  Card,
  Tab,
  Tabs,
  Box,
  CardContent,
  Stack,
  CircularProgress,
  InputAdornment,
  Alert,
  AppBar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { LoadingButton } from '@mui/lab';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Iconify from 'src/component/Iconify';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import { API_WALLET } from 'src/apis';



const WithdrawMoney = ({ linkAccountId, typeWallet = 'USDT', handleReloadBalance, setMaxWidth, handleBack }) => {
  const theme = useTheme();

  const { translate } = useLocales();

  const { currentTab, onChangeTab } = useTabs(translate('internal'));

  const ACCOUNT_TABS = [
    {
      value: translate('internal'),
      icon: <Iconify icon={'fa6-solid:money-bill-transfer'} width={20} height={20} />,
      component: (
        <Internal
          linkAccountId={linkAccountId}
          typeWallet={typeWallet}
          handleReloadBalance={handleReloadBalance}
          setMaxWidth={setMaxWidth}
        />
      ),
    },
    {
      value: translate('bsc20'),
      icon: <Iconify icon={'arcticons:crypto-prices'} width={20} height={20} />,
      component: (
        <BSC20
          linkAccountId={linkAccountId}
          typeWallet={typeWallet}
          handleReloadBalance={handleReloadBalance}
          setMaxWidth={setMaxWidth}
        />
      ),
    },
  ];

  return (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Button
          onClick={handleBack}
          startIcon={<Iconify icon={'eva:arrow-back-outline'} />}
          variant="contained"
          color={'info'}
          size="small"
          sx={{ mb: 1 }}
        >
          {translate('back')}
        </Button>
        <Box sx={{ bgcolor: 'background.paper' }}>
          <AppBar position="static" sx={{ bgcolor: theme.palette.mode === 'light' && 'background.neutral' }}>
            <Tabs
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              value={currentTab}
              onChange={onChangeTab}
            >
              {ACCOUNT_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
              ))}
            </Tabs>
            <Box sx={{ mb: 3 }} />
            {ACCOUNT_TABS.map((tab) => {
              const isMatched = tab.value === currentTab;

              return isMatched && <Box key={tab.value}>{tab.component}</Box>;
            })}
          </AppBar>
        </Box>
      </Grid>
    </Grid>
  );
};

const BSC20 = ({ linkAccountId, typeWallet = 'USDT', handleReloadBalance, setMaxWidth }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setMaxWidth('sm');
  }, [linkAccountId]);

  const WithdrawSchema = Yup.object().shape({
    amount: Yup.number('Phải là số').required(translate('Vui lòng nhập số lượng muốn rút')),
    toAddress: Yup.string().required(translate('Vui lòng nhập mã ví BSC20')),
    verifyCode: Yup.number('Phải là số').required(translate('Vui lòng nhập mã 2FA')),
  });

  const defaultValues = {
    amount: '',
    toAddress: '',
    verifyCode: '',
    memo: '',
  };

  const methods = useForm({
    resolver: yupResolver(WithdrawSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const response = await API_WALLET.withdraw(linkAccountId, {
      amount: e.amount,
      toAddress: e.toAddress.trim(),
      verifyCode: e.verifyCode,
      memo: e.memo.trim(),
      typeWallet,
    });

    if (response.data.ok) {
      reset();
      handleReloadBalance(false);
      enqueueSnackbar(translate('success'), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardContent>
            {loading ? (
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <CircularProgress />
              </Stack>
            ) : (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Alert variant="filled" severity="warning">
                    {translate('note_withdraw_bep20')}
                  </Alert>
                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'clarity:dollar-bill-solid'} />
                        </InputAdornment>
                      ),
                    }}
                    name="amount"
                    label={`${translate('amount')} (${typeWallet})`}
                    size="small"
                    type="number"
                  />
                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'fa6-solid:wallet'} />
                        </InputAdornment>
                      ),
                    }}
                    name="toAddress"
                    label={translate('toAddress')}
                    size="small"
                  />

                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'emojione-v1:memo'} />
                        </InputAdornment>
                      ),
                    }}
                    name="memo"
                    label={translate('memo')}
                    size="small"
                  />

                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'tabler:2fa'} />
                        </InputAdornment>
                      ),
                    }}
                    name="verifyCode"
                    label={translate('google_authenticator_code')}
                    size="small"
                  />

                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    startIcon={<Iconify icon={'uil:money-withdraw'} />}
                    variant={'contained'}
                  >
                    {translate('withdraw')}
                  </LoadingButton>
                </Stack>
              </FormProvider>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const Internal = ({ linkAccountId, typeWallet = 'USDT', handleReloadBalance, setMaxWidth }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setMaxWidth('sm');
  }, [linkAccountId]);

  const WithdrawSchema = Yup.object().shape({
    amount: Yup.number('Phải là số').required(translate('Vui lòng nhập số lượng muốn rút')),
    nickName: Yup.string().required(translate('Vui lòng nhập biệt danh sàn muốn chuyển')),
    verifyCode: Yup.number('Phải là số').required(translate('Vui lòng nhập mã 2FA')),
  });

  const defaultValues = {
    amount: '',
    nickName: '',
    verifyCode: '',
    memo: '',
  };
  
  const methods = useForm({
    resolver: yupResolver(WithdrawSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    const response = await API_WALLET.transfer(linkAccountId, {
      amount: e.amount,
      nickName: e.nickName.trim(),
      verifyCode: e.verifyCode,
      memo: e.memo.trim(),
      typeWallet,
    });

    if (response.data.ok) {
      reset();
      handleReloadBalance(false);
      enqueueSnackbar(translate('success'), { variant: 'success' });

      return;
    }
    enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardContent>
            {loading ? (
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <CircularProgress />
              </Stack>
            ) : (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'clarity:dollar-bill-solid'} />
                        </InputAdornment>
                      ),
                    }}
                    name="amount"
                    label={`${translate('amount')} (${typeWallet})`}
                    size="small"
                    type="number"
                  />
                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'carbon:user-avatar-filled'} />
                        </InputAdornment>
                      ),
                    }}
                    name="nickName"
                    label={translate('nickname')}
                    size="small"
                  />

                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'emojione-v1:memo'} />
                        </InputAdornment>
                      ),
                    }}
                    name="memo"
                    label={translate('memo')}
                    size="small"
                  />

                  <RHFTextField
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon={'tabler:2fa'} />
                        </InputAdornment>
                      ),
                    }}
                    name="verifyCode"
                    label={translate('google_authenticator_code')}
                    size="small"
                  />

                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    startIcon={<Iconify icon={'uil:money-withdraw'} />}
                    variant={'contained'}
                  >
                    {translate('withdraw')}
                  </LoadingButton>
                </Stack>
              </FormProvider>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WithdrawMoney;
