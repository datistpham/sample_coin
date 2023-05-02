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
import { isValidToken, setSession } from '../../../../utils/jwt';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function UpdateEmailDialog({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    setIsOpen(false);
  };

  const ChangePasswordSchema = Yup.object().shape({
    email: Yup.string().email().required(translate('password_is_required')),
  });

  const defaultValues = {
    email: '',
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
      const response = await API_AUTH.updateEmail(e);

      if (response.data.ok) {
        const { accessToken, refreshToken } = response.data;
        setSession(accessToken, refreshToken);
        reset();
        enqueueSnackbar(translate(response.data.m), { variant: 'success' });
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
          {translate('update_email')}
        </DialogTitle>

        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={12}>
                <RHFTextField name="email" label={translate('email')} size="small" />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  size="medium"
                  type="submit"
                  startIcon={<Iconify icon={'game-icons:archive-register'} />}
                  fullWidth
                  variant="contained"
                >
                  {translate('confirm')}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
