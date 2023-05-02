import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// routes
import { PATH_AUTH } from '../../../routes/paths';

// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { API_AUTH } from '../../../apis';

// ----------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const navigate = usenavigate.push();

  const [step, setStep] = useState(0);

  const ForgotPasswordSchema = Yup.object().shape({
    username: Yup.string().min(4).max(20).required('Username is required'),
  });

  const defaultValues = {
    username: '',
    code: '',
    newPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response =
        step === 0 ? await API_AUTH.getRecoveryCodeForgotPass(data.username) : await API_AUTH.postResetPassword(data);
      if (response.data.ok) {
        enqueueSnackbar(response.data.m, { variant: 'success' });
        if (step === 0) {
          setStep(1);

return;
        }
        reset();
        navigate.push(PATH_AUTH.login, { replace: true });

        return;
      }

      enqueueSnackbar(response.data.m, { variant: 'error' });

return;
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ my: 2 }}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        {step === 0 ? (
          <RHFTextField name="username" label="Username" />
        ) : (
          <>
            <RHFTextField name="code" label="Code" />
            <RHFTextField name="newPassword" label="New Password" />
          </>
        )}
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Confirm
      </LoadingButton>
    </FormProvider>
  );
}
