import { useSnackbar } from 'notistack';

import { useState } from 'react';
import { Grid, Button, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';

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

export default function ChangePasswordDialog({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    setIsOpen(false);
  };

  const ChangePasswordSchema = Yup.object().shape({
    current_password: Yup.string().required(translate('password_is_required')),
    new_password: Yup.string().required(translate('password_is_required')),
    confirm_new_password: Yup.string().required(translate('password_is_required')),
  });

  const defaultValues = {
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  };
  const methods = useForm({
    resolver: yupResolver(ChangePasswordSchema),
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
    try {
      if (e.new_password !== e.confirm_new_password) {
        enqueueSnackbar(translate('passwords_do_not_match'), { variant: 'error' });
        return;
      }
      const response = await API_AUTH.changePassword(e.current_password, e.new_password);

      if (response.data.ok) {
        reset();
        enqueueSnackbar(translate('change_password_successfully'), { variant: 'success' });
        setIsOpen(false);
        return;
      }
      enqueueSnackbar(translate(response.data.m), { variant: 'error' });
      return;
    } catch (e) {
      console.log(e);
    }
  };

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
          {translate('change_password')}
        </DialogTitle>

        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={12}>
                <RHFTextField
                  name="current_password"
                  label={translate('current_password')}
                  type="password"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <RHFTextField name="new_password" label={translate('new_password')} type="password" size="small" />
              </Grid>
              <Grid item xs={12} md={12}>
                <RHFTextField
                  name="confirm_new_password"
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
                  {translate('change_password')}{' '}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
