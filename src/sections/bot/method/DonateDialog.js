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
import { API_BOT } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';

// import Iconify from '../../../components/Iconify';
// import useLocales from '../../../hooks/useLocales';

// // components
// import { FormProvider, RHFTextField } from '../../../components/hook-form';

// import { API_BOT } from '../../../apis';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function DonateDialog({ methodIds = [], isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    setIsOpen(false);
  };

  const DonateSchema = Yup.object().shape({
    username: Yup.string().required(translate('username_is_required')),
  });

  const defaultValues = {
    username: '',
  };

  const methods = useForm({
    resolver: yupResolver(DonateSchema),
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
      const data = { count: 0 };
      await Promise.all(
        methodIds.map(async (methodId) => {
          const response = await API_BOT.sendMethod(methodId, e.username);

          if (response.data.ok) {
            data.count += 1;

            return;
          }
          enqueueSnackbar(translate(response.data.m), { variant: 'error' });
        })
      );
      if (data.count > 0) {
        enqueueSnackbar(`${translate('success')} ${data.count} ${translate('method')}`, { variant: 'success' });
        
        return;
      }

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
          {translate('donate_method')}
        </DialogTitle>

        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={12}>
                <RHFTextField name="username" label={translate('recipient_username')} size="small" />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  size="medium"
                  type="submit"
                  startIcon={<Iconify icon={'bxs:donate-heart'} />}
                  fullWidth
                  variant="contained"
                >
                  {' '}
                  {translate('donate')}{' '}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
