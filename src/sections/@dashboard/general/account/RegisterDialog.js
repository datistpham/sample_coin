import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import {
  Grid,
  CircularProgress,
  Stack,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import Draggable from 'react-draggable';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useLocales from 'src/hooks2/useLocales';
import { INFO_SITE } from 'src/config';
import { getExchanges } from 'src/redux/dashboard/account/action';
import { API_EXCHANGE } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';


// components


function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function RegisterDialog({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const exchanges = useSelector((state) => {
    try {
      const array = [];
      const exchangesss = state.exchanges;

      exchangesss.forEach((exchange) => {
        if (INFO_SITE.client_list.includes(exchange.clientId)) {
          array.push(exchange);
        }
      });

      return array;
    } catch (e) {
      return [];
    }
  });

  const getListExchange = async () => {
    dispatch(await getExchanges());
  };

  useEffect(() => {
    if (!exchanges || (exchanges && exchanges.length === 0)) getListExchange();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().required(translate('email_is_required')).email(translate('email_invalidate')),
    password: Yup.string().required(translate('password_is_required')),
    confirm_password: Yup.string().required(translate('password_is_required')),
    clientId: Yup.string().required(translate('clientid_is_required')),
    nickname: Yup.string().required(translate('nickname_is_required')),
  });

  const defaultValues = {
    clientId: INFO_SITE.client_default,
    email: '',
    password: '',
    confirm_password: '',
    nickname: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const [isRegister, setIsRegister] = useState(false);

  const onSubmit = async (e) => {
    try {
      const response = await API_EXCHANGE.register({
        clientId: e.clientId,
        email: e.email,
        nickname: e.nickname,
        password: e.password,
        confirm_password: e.confirm_password,
      });

      if (response.data.ok) {
        enqueueSnackbar(translate('register_account_success'), { variant: 'success' });
        setIsRegister(true);

        return;
      }
      enqueueSnackbar(translate(response.data.m), { variant: 'error' });

      return;
    } catch (e) {
      console.log(e);
    }
  };

  const values = watch();

  return (
    <>
      <Dialog
        open={isOpen}
        PaperComponent={PaperComponent}
        onClose={handleClose}
        maxWidth={maxWidth}
        fullWidth
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {translate('register')}
        </DialogTitle>

        <DialogContent>
          {isRegister ? (
            <WaitingToResendEmail clientId={values.clientId} email={values.email} />
          ) : (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={12}>
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
                <Grid item xs={12} md={12}>
                  <RHFTextField name="email" label={translate('exchange_login_email')} size="small" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField name="nickname" label={translate('nickname')} size="small" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField name="password" label={translate('password')} type="password" size="small" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField
                    name="confirm_password"
                    label={translate('confirm_password')}
                    type="password"
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Button
                    size="medium"
                    type="submit"
                    startIcon={<Iconify icon={'game-icons:archive-register'} />}
                    fullWidth
                    variant="contained"
                  >
                    {' '}
                    {translate('register')}{' '}
                  </Button>
                </Grid>
              </Grid>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const WaitingToResendEmail = ({ clientId, email }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countdown > 0) {
        const down = countdown - 1;
        setCountdown(down);
      }
    }, 1000);

    return () => clearInterval(interval);
  });

  const handleResendConfirmEmail = async () => {
    try {
      const response = await API_EXCHANGE.resendConfirmEmail({ clientId, email });
      if (response.data.ok) {
        setCountdown(30);
        enqueueSnackbar(translate('success'), { variant: 'success' });
        
        return;
      }
      enqueueSnackbar(translate('failed'), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Iconify sx={{ width: 50, height: 50, color: 'success.main' }} icon={'bi:shield-fill-check'} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Typography variant="h4">{translate('notice')}</Typography>
            </Stack>
          </Grid>
          <Divider />
          <Grid item xs={12} md={12}>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Typography>{translate('register_notice_content')}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Typography variant="h3"> {countdown}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <Button
              startIcon={<Iconify icon={'icon-park:email-block'} />}
              fullWidth
              disabled={countdown !== 0}
              onClick={handleResendConfirmEmail}
              variant="contained"
              color="warning"
            >
              {translate('resend_confirm_email')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
