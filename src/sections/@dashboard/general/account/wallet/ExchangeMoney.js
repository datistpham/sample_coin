import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import {
  Button,
  Grid,
  Card,
  IconButton,
  Typography,
  CardContent,
  Stack,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

import { LoadingButton } from '@mui/lab';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import Iconify from 'src/component/Iconify';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import { API_WALLET } from 'src/apis';

// components

const ExchangeMoney = ({ linkAccountId, balance, handleReloadBalance, setMaxWidth, handleBack, reloadInfo }) => {
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [usdt2real, setUsdt2real] = useState(true);

  useEffect(() => {
    setLoading(false);
    setMaxWidth('sm');
  }, [linkAccountId]);

  const ExchangeSchema = Yup.object().shape({
    amount: Yup.number('Phải là số').required(translate('Vui lòng nhập số lượng muốn rút')),
  });

  const defaultValues = {
    amount: '',
  };

  const methods = useForm({
    resolver: yupResolver(ExchangeSchema),
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
    const response = await API_WALLET.exchangeMoney(linkAccountId, {
      amount: e.amount,
      usdt2real,
    });

    if (response.data.ok) {
      reset();
      handleReloadBalance(false);
      enqueueSnackbar(translate('success'), { variant: 'success' });
      if (reloadInfo !== null) {
        reloadInfo();
      }

      return;
    }
    enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Button
          onClick={handleBack}
          startIcon={<Iconify icon={'eva:arrow-back-outline'} />}
          variant="contained"
          size="small"
          color={'info'}
          sx={{ mb: 1 }}
        >
          {translate('back')}
        </Button>
        <Card>
          <CardContent>
            {loading ? (
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <CircularProgress />
              </Stack>
            ) : (

              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                  <Grid item xs={5} md={5}>
                    <Typography variant="h6" align="center">
                      {usdt2real ? translate('usdt_wallet') : translate('live_account')}
                    </Typography>
                    <Typography variant="h5" align="center">
                      $ {usdt2real ? balance.usdtAvailableBalance : balance.availableBalance}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <IconButton onClick={() => setUsdt2real(!usdt2real)}>
                      <Iconify icon={'fa:exchange'} />
                    </IconButton>
                  </Grid>
                  <Grid item xs={5} md={5}>
                    <Typography variant="h6" align="center">
                      {usdt2real ? translate('live_account') : translate('usdt_wallet')}
                    </Typography>
                    <Typography variant="h5" align="center">
                      $ {usdt2real ? balance.availableBalance : balance.usdtAvailableBalance}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <RHFTextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon={'clarity:dollar-bill-solid'} />
                          </InputAdornment>
                        ),
                      }}
                      name="amount"
                      label={translate('amount')}
                      size="small"
                      type="number"
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      fullWidth
                      startIcon={<Iconify icon={'bi:currency-exchange'} />}
                      variant={'contained'}
                    >
                      {translate('exchange')}
                    </LoadingButton>
                  </Grid>
                </Grid>
              </FormProvider>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ExchangeMoney;
