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


// components


import Iconify from 'src/component/Iconify';
import { API_EXCHANGE } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import useLocales from 'src/hooks2/useLocales';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function EditCalendarDialog({ isOpen, setIsOpen, linkAccountId, accountType, reloadHistories }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    reloadHistories();
    setIsOpen(false);
  };

  const EditSchema = Yup.object().shape({
    username: Yup.string().required(translate('this_info_is_required')),
    linkAccountId: Yup.string().required(translate('this_info_is_required')),
    date: Yup.string().required(translate('this_info_is_required')),
    month: Yup.string().required(translate('this_info_is_required')),
    year: Yup.string().required(translate('this_info_is_required')),
    profit: Yup.string().required(translate('this_info_is_required')),
    volume: Yup.string().required(translate('this_info_is_required')),
  });

  const defaultValues = {
    username: '',
    linkAccountId: '',
    accountType: 'LIVE',
    date: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    profit: '0',
    volume: '0',
  };

  const methods = useForm({
    resolver: yupResolver(EditSchema),
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
      const profit = parseFloat(e.profit);
      const volume = parseFloat(e.volume);

      console.log(e);
      if (profit === 0 || volume <= 0) {
        enqueueSnackbar(translate('Lợi nhuận phải khác 0 và volume phải lớn hơn 0'), { variant: 'error' });

        return;
      }

      const response = await API_EXCHANGE.updateHistoryByLinkAccount(
        e.username,
        e.linkAccountId,
        e.accountType,
        e.date,
        e.month,
        e.year,
        profit,
        volume
      );

      if (response.data.ok) {
        handleClose();
        enqueueSnackbar(translate('success'), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate(response.data.err_code), { variant: 'error' });

      return;
    } catch (e) {
      console.log(e);
    }
  };

  const values = watch();

  const [exchangeAccounts, setExchangeAccounts] = useState([]);

  const hanleCheckUsername = async () => {
    try {
      const username = values.username.trim().toLowerCase();
      const response = await API_ADMIN.checkUserByUsername(username);
      if (response.data.ok) {
        setExchangeAccounts(response.data.d);
      } else {
        setExchangeAccounts([]);
        enqueueSnackbar(translate(response.data.m), { variant: 'error' });
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    reset();
    setExchangeAccounts([]);
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
          {translate('Chỉnh sửa lợi nhuận tháng')}
        </DialogTitle>

        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} md={6}>
                <RHFTextField name="username" label={translate('recipient_username')} size="small" />
              </Grid>{' '}
              <Grid item xs={6} md={6}>
                <Button variant="contained" onClick={hanleCheckUsername} size="sm" fullWidth>
                  {translate('check')}
                </Button>
              </Grid>
              <Grid item xs={6} md={6}>
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
                  {exchangeAccounts ? (
                    exchangeAccounts.map((option) => (
                      <MenuItem
                        key={option._id}
                        checked
                        value={option._id}
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
              <Grid item xs={6} md={6}>
                <RHFTextField
                  size="small"
                  fullWidth
                  select
                  name="accountType"
                  label={translate('account_type')}
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
                  <MenuItem
                    key="DEMO"
                    checked
                    value="DEMO"
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    }}
                  >
                    DEMO
                  </MenuItem>
                  <MenuItem
                    key="LIVE"
                    checked
                    value="LIVE"
                    sx={{
                      mx: 1,
                      my: 0.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      textTransform: 'capitalize',
                    }}
                  >
                    LIVE
                  </MenuItem>
                </RHFTextField>
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField name="date" label={translate('date')} size="small" />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField name="month" label={translate('month')} size="small" />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField name="year" label={translate('year')} size="small" />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField name="profit" label={translate('profit')} size="small" />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField name="volume" label={translate('volume')} size="small" />
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  size="medium"
                  type="submit"
                  startIcon={<Iconify icon={'mdi:content-save-all-outline'} />}
                  fullWidth
                  variant="contained"
                  disabled={!values.linkAccountId}
                >
                  {translate('confirm')}{' '}
                </Button>
              </Grid>
            </Grid>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
