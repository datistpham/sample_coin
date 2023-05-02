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

export default function ActiveTelegramDialog({ isOpen, setIsOpen, setUseTelegram }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    setIsOpen(false);
  };

  const ActiveTelegramSchema = Yup.object().shape({
    linkAccountId: Yup.string().required(translate('this_is_required_information')),
    secretCode: Yup.string().required(translate('this_is_required_information')),
  });

  const defaultValues = {
    linkAccountId: '',
    secretCode: '',
  };

  const methods = useForm({
    resolver: yupResolver(ActiveTelegramSchema),
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
      console.log(e);
      const response = await API_BOT.activeTelegram(e.linkAccountId, e.secretCode);

      if (response.data.ok) {
        setUseTelegram(true);
        enqueueSnackbar(translate('success'), { variant: 'success' });

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
          {translate('active_send_signal_to_telegram')}
        </DialogTitle>

        <DialogContent>
          <FormProvider methods={methods}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  size="small"
                  fullWidth
                  select
                  name="linkAccountId"
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
                  {exchangeAccounts && exchangeAccounts.length > 0 ? (
                    exchangeAccounts
                      .filter((a) => a.access_type === 0)
                      .map((option) => (
                        <MenuItem
                          key={option._id}
                          checked
                          value={option._id || ''}
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
                    <></>
                  )}
                </RHFTextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField name="secretCode" label={translate('google_authenticator_code')} size="small" />
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography sx={{ color: 'error.main' }}>
                  {translate('note')} : {translate('guide_active_telegram')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  size="medium"
                  color="warning"
                  startIcon={<Iconify icon={'logos:active-campaign-icon'} />}
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                >
                  {' '}
                  {translate('active_now')}{' '}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
