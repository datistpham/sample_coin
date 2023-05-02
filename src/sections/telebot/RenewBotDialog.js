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
import { getExchange } from 'src/redux/dashboard/account/action';
import { API_TELEBOT } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';


function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function RenewBotDialog({ botId, isOpen, setIsOpen, callback }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('xs');

  const handleClose = () => {
    setIsOpen(false);
  };

  const GrantBotSchema = Yup.object().shape({
    username: Yup.string().required(translate('username_is_required')),
  });

  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };
  useEffect(() => {
    if (!exchangeAccounts || (exchangeAccounts && exchangeAccounts.length === 0)) getExchangeAccount();
  }, [exchangeAccounts]);

  const defaultValues = {
    linkAccountId: '',
    secretCode: '',
    moneyNeedPay: 6.25,
  };

  const methods = useForm({
    resolver: yupResolver(GrantBotSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      const moneyNPay = 6.25;

      const response = await API_TELEBOT.renewTeleBot({
        linkAccountId: values.linkAccountId,
        moneyNeedPay: moneyNPay,
        secretCode: values.secretCode,
        botId,
      });
      if (response.data.ok) {
        enqueueSnackbar('Đã gia hạn bot thành công', { variant: 'success' });
        callback();
        handleClose();
        reset();

        return;
      }
      enqueueSnackbar(translate(response.data.message), { variant: 'error' });

      return;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    reset();
  }, [isOpen]);

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
          Gia hạn cấu hình bot
        </DialogTitle>

        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <>
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

                <Grid item xs={12} md={6}>
                  <RHFTextField name="moneyNeedPay" label="Số tiền cẩn trả ($)" size="small" />
                </Grid>
              </>

              <Grid item xs={12} md={12}>
                <Button
                  size="medium"
                  onClick={onSubmit}
                  startIcon={<Iconify icon={'line-md:confirm-circle-twotone'} />}
                  fullWidth
                  variant="contained"
                >
                  {' '}
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
