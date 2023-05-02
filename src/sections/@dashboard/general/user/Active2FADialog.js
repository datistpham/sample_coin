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
import Iconify from '../../../../components/Iconify';
import useLocales from '../../../../hooks/useLocales';

// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

import { API_AUTH } from '../../../../apis';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function Active2FADialog({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    setIsOpen(false);
  };

  const Active2FASchema = Yup.object().shape({
    current_password: Yup.string().required(translate('password_is_required')),
    code: Yup.number().required(translate('this_is_required')),
  });

  const defaultValues = {
    current_password: '',
    code: '',
  };
  const methods = useForm({
    resolver: yupResolver(Active2FASchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    setLoading(true);
    try {
      const response = isEnabled
        ? await API_AUTH.deactive2FAMode(e.code, e.current_password)
        : await API_AUTH.active2FAMode(info.secret_key, e.code, e.current_password);

      if (response.data.ok) {
        reset();
        enqueueSnackbar(translate('success'), { variant: 'success' });
        setIsOpen(false);
        return;
      }
      enqueueSnackbar(translate(response.data.m), { variant: 'error' });
      return;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const [isEnabled, setEnabled] = useState(false);
  const [info, setInfo] = useState({
    secret_key: '',
    qrcode_image: '',
  });

  const checkEnabled2FA = async () => {
    setLoading(true);
    try {
      const response = await API_AUTH.generateAndGetQrCode();
      if (response.data.ok) {
        setInfo({
          secret_key: response.data.secret_key,
          qrcode_image: response.data.qrcode_image,
        });
      }
      setEnabled(!response.data.ok);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkEnabled2FA();
    }
  }, [isOpen]);

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
          {translate('enabled_2fa')}
        </DialogTitle>

        <DialogContent>
          {loading ? (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <CircularProgress />
            </Stack>
          ) : (
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {!isEnabled && (
                  <>
                    <Grid item xs={12} md={12}>
                      <Stack alignItems="center" justifyContent="space-between">
                        <img style={{ borderRadius: '1em' }} src={info.qrcode_image} alt="test" />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <TextField
                        fullWidth
                        label={translate('recovery_code')}
                        value={info.secret_key}
                        size="small"
                        readOnly
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={12}>
                  <RHFTextField name="code" label={translate('google_authenticator_code')} type="number" size="small" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField
                    name="current_password"
                    label={translate('current_password')}
                    type="password"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Button
                    size="medium"
                    type="submit"
                    color={isEnabled ? 'error' : 'primary'}
                    startIcon={<Iconify icon={'game-icons:archive-register'} />}
                    fullWidth
                    variant="contained"
                  >
                    {' '}
                    {translate(isEnabled ? 'deactive' : 'active')}
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
