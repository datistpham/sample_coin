import { useSnackbar } from 'notistack';

import {
  Grid,
  RadioGroup,
  Radio,
  Divider,
  FormLabel,
  FormControlLabel,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { useCallback, useState, useEffect } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';


// components
import RegisterDialog from './RegisterDialog';
import { INFO_SITE } from 'src/config';
import { API_EXCHANGE } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import useLocales from 'src/hooks2/useLocales';
import { getExchange, getExchanges } from 'src/redux/dashboard/account/action';


function AccountAddNew() {
  const { translate } = useLocales();

  const [isOpenRegister, setOpenRegister] = useState(false);

  const [accessType, setAccessType] = useState(0);

  const handleChangeAccessType = (e) => {
    setAccessType(e.target.value);
  };

  return (
    <>
      <RegisterDialog isOpen={isOpenRegister} setIsOpen={setOpenRegister} />
      <Card>
        <CardHeader title={translate('add_new_exchange_account')} />
        <CardContent>
          <Grid container spacing={1} sx={{ p: 2.5, mt: -3 }}>
            <Grid item xs={12} md={12}>
              <FormLabel id="access_type">{translate('access_type')}</FormLabel>
              <RadioGroup
                onChange={handleChangeAccessType}
                value={accessType}
                row
                aria-labelledby="access_type"
                name="access_type"
              >
                <FormControlLabel value={0} control={<Radio />} label="Email/Pass" />
                <FormControlLabel value={1} control={<Radio />} label="API Key" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} md={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mt: 3 }}>
              {accessType === 0 || accessType === '0' ? (
                <AccessEmailPassword setOpenRegister={setOpenRegister} />
              ) : (
                <AccessAPIKey setOpenRegister={setOpenRegister} />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

const AccessAPIKey = ({ setOpenRegister }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  const CreateAPISchema = Yup.object().shape({
    token: Yup.string().required(translate('token_is_required')),
  });

  const defaultValues = {
    token: '',
  };

  const methods = useForm({
    resolver: yupResolver(CreateAPISchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    try {
      const response = await API_EXCHANGE.postLinkAccountToken({ api_key: e.token });
      if (response.data.ok === true) {
        enqueueSnackbar(translate('login_success'), { variant: 'success' });
        reset();
        getExchangeAccount();

        return;
      }
      enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });

      return;
    } catch (e) {
      console.log(e);
    }
  };

  const accountRegisterHandle = () => {
    try {
      setOpenRegister(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} sx={{ mb: 1 }} marginBottom={2}>
          <Typography sx={{ color: 'warning.main' }}>
            {translate('note')} : {translate('note_add_api_key')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} marginBottom={2}>
          <RHFTextField name="token" label={translate('API Key')} size="small" />
        </Grid>
        <Grid item xs={12} md={12} marginBottom={2}>
          {' '}
          <LoadingButton size="sm" sx={{ width: '100%' }} type="submit" variant="contained" loading={isSubmitting}>
            {translate('login')}
          </LoadingButton>
        </Grid>
        <Grid item xs={12} md={12} marginBottom={2}>
          {' '}
          <Button size="sm" sx={{ width: '100%' }} onClick={accountRegisterHandle} color="warning" variant="contained">
            {translate('account_register')}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

const AccessEmailPassword = ({ setOpenRegister }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  const getListExchange = async () => {
    dispatch(await getExchanges());
  };

  const exchanges = useSelector((state) => {
    try {
      const array = [];
      const exchangesss = state.exchanges;

      if (exchangesss && exchangesss.length > 0) {
        exchangesss.forEach((exchange) => {
          if (INFO_SITE.client_list.includes(exchange.clientId)) {
            array.push(exchange);
          }
        });
      }

      return array;
    } catch (e) {
      return [];
    }
  });

  const [require2fa, setRequire2fa] = useState(false);

  const CreateAPISchema = Yup.object().shape({
    email: Yup.string().required(translate('email_is_required')).email(translate('email_invalidate')),
    password: Yup.string().required(translate('password_is_required')),
    clientId: Yup.string().required(translate('clientid_is_required')),
  });

  const defaultValues = {
    clientId: INFO_SITE.client_default || '',
    email: '',
    password: '',
    secretCode: '',
    token2FA: '',
  };

  const methods = useForm({
    resolver: yupResolver(CreateAPISchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    try {
      const response = e.token2FA ? await API_EXCHANGE.postLinkAccount2FA(e) : await API_EXCHANGE.postLinkAccount(e);
      if (response.status === 200) {
        if (response.data.ok === true) {
          if (response.data.d.access_token) {
            enqueueSnackbar(translate('login_success'), { variant: 'success' });
            reset();
            setRequire2fa(false);
            getExchangeAccount();

            return;
          }
          if (response.data.d.require2Fa) {
            setRequire2fa(true);
            setValue('token2FA', response.data.d.t);

            return;
          }
        }
        enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });

        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const accountRegisterHandle = () => {
    try {
      setOpenRegister(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListExchange();
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {require2fa ? (
          <>
            <Grid item xs={12} md={12} marginBottom={2}>
              <RHFTextField
                name="secretCode"
                label={translate('google_authenticator_code')}
                size="small"
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={12} marginBottom={2}>
              <RHFTextField name="token2FA" sx={{ display: 'none' }} />
            </Grid>

            <Grid item xs={12} md={12}>
              <LoadingButton
                size="sm"
                sx={{ width: '100%' }}
                type="submit"
                color="warning"
                variant="contained"
                loading={isSubmitting}
              >
                {translate('continue')}
              </LoadingButton>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={12} marginBottom={2}>
              <RHFTextField
                size="small"
                fullWidth
                select
                name="clientId"
                label={translate('exchange_name')}
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
                {exchanges.map((option) => (
                  <MenuItem
                    key={option.clientId}
                    checked
                    value={option.clientId}
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
                      {option.name}
                    </div>
                  </MenuItem>
                ))}
              </RHFTextField>
            </Grid>

            <Grid item xs={12} md={12} marginBottom={2}>
              <RHFTextField name="email" label={translate('exchange_login_email')} size="small" />
            </Grid>
            <Grid item xs={12} md={12} marginBottom={2}>
              <RHFTextField name="password" label={translate('password')} type="password" size="small" />
            </Grid>

            <Grid item xs={12} md={12} marginBottom={2}>
              {' '}
              <LoadingButton size="sm" sx={{ width: '100%' }} type="submit" variant="contained" loading={isSubmitting}>
                {translate('login')}
              </LoadingButton>
            </Grid>
            <Grid item xs={12} md={12}>
              {' '}
              <Button
                size="sm"
                sx={{ width: '100%' }}
                onClick={accountRegisterHandle}
                color="warning"
                variant="contained"
              >
                {translate('account_register')}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </FormProvider>
  );
};

export default AccountAddNew;
