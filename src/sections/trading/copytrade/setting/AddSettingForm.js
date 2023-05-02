import { useSnackbar } from 'notistack';

import {
  Stack,
  MenuItem,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { React, useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import useLocales from 'src/hooks2/useLocales';
import { getExchange, getExchanges } from 'src/redux/dashboard/account/action';
import { API_COPYTRADE } from 'src/apis';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import RHFSwitch from 'src/component/hook-form/RHFSwitch';
import Label from 'src/component/Label';
import Iconify from 'src/component/Iconify';

// components

// import { FormProvider, RHFTextField, RHFSwitch } from '../../../../components/hook-form';
// import Label from '../../../../components/Label';
// import Iconify from '../../../../components/Iconify';

// import useLocales from '../../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../../routes/paths';
// import { API_COPYTRADE } from '../../../../apis';

function AddSettingForm(props) {
  const navigate = useRouter();

  const { _id = '' } = navigate.query

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const { translate } = useLocales();

  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchanges());
  };

  const [isEdit, setIsEdit] = useState(false);
  const [currentIdEdit, setCurrentIdEdit] = useState(0);

  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);
  useEffect(() => {
    if (!exchangeAccounts || (exchangeAccounts && exchangeAccounts.length === 0)) getExchangeAccount();

  }, [exchangeAccounts]);

  const CreateSettingSchema = Yup.object().shape({
    accountType: Yup.string().required(translate('Vui lòng chọn loại tài khoản')),
    brokerUserName: Yup.string().required(translate('Vui lòng nhập tên tài khoản chuyên gia')),
    moneyPerOrder: Yup.number(translate('must_enter_number')).required(translate('Vui lòng nhập giá trị 1 lệnh')),
    stopLossTarget: Yup.number(translate('must_enter_number')).required(translate('Vui lòng nhập mục tiêu cắt lỗ')),
    takeProfitTarget: Yup.number(translate('must_enter_number')).required(translate('Vui lòng nhập mục tiêu chốt lãi')),
    linkAccountId: Yup.string().required(translate('please_choose_a_trading_account')),
  });

  useEffect(() => {
    try {
      if (exchangeAccounts && exchangeAccounts.length > 0) {
        setValue('linkAccountId', exchangeAccounts[0]._id);

        if (_id !== '' && _id !== undefined) {
          setIsEdit(true);
          loadSettingId();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [exchangeAccounts, _id]);

  const defaultValues = {
    linkAccountId: exchangeAccounts && exchangeAccounts.length > 0 ? exchangeAccounts[0]._id : '',
    accountType: 'LIVE',
    brokerUserName: '',
    moneyPerOrder: '1',
    stopLossTarget: '1000',
    takeProfitTarget: '1000',
    isNotificationsEnabled: true,
    isActive: true,
  };

  const methods = useForm({
    resolver: yupResolver(CreateSettingSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [isLoading, setLoading] = useState(false);

  const loadSettingId = async () => {
    setLoading(true);
    try {
      const response = await API_COPYTRADE.getSetting(_id);

      if (response.data.ok === false) {
        navigate.push(PATH_DASHBOARD.copytrade_setting.setting);

        return;
      }
      if (response.data.ok) {
        const data = response.data.d;
        setCurrentIdEdit(data._id);
        reset(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        data._id = currentIdEdit;
      }
      const response = await API_COPYTRADE.updateSetting(isEdit, data);
      if (response.status === 200) {
        if (response.data.ok === true) {
          getExchangeAccount();
          enqueueSnackbar(translate('success'), { variant: 'success' });
          if (isEdit) {
            navigate.push(PATH_DASHBOARD.copytrade_setting.setting, { replace: true });
          }
          reset();

          return;
        }
        enqueueSnackbar(translate(response.data.err_code), { variant: 'error' });

        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (

    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader title={translate('add_new_copytrade_configuration')} />
        <CardContent>
          {isLoading ? (
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <CircularProgress />
            </Stack>
          ) : (
            <Stack spacing={3} direction={{ xs: 'column', sm: 'column' }} sx={{ py: 2.5, px: 3 }}>
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
              <br />
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
                  {translate('demo_account')}
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
                  {translate('live_account')}
                </MenuItem>
              </RHFTextField>
              <br />
              <RHFTextField name="brokerUserName" label={translate('broker_username')} size="small" />
              <br />
              <RHFTextField name="moneyPerOrder" label={translate('money_per_order')} size="small" />
              <br />
              <RHFTextField name="takeProfitTarget" label={translate('take_profit_target')} size="small" />
              <br />
              <RHFTextField name="stopLossTarget" label={translate('stop_loss_target')} size="small" />
              <br />

              <RHFSwitch
                name="isActive"

                // onChange={() => {
                //   setIsActive(!isActive);
                // }}
                label={
                  <>
                    {' '}
                    {translate('status')}{' '}
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={values.isActive ? 'success' : 'error'}
                    >
                      {values.isActive ? translate('is_on') : translate('is_off')}
                    </Label>
                  </>
                }
                labelPlacement="end"
              />

              <RHFSwitch name="isNotificationsEnabled" label={translate('allow_notifications')} labelPlacement="end" />

              <Stack spacing={1} direction={{ xs: 'column', sm: 'column' }}>
                <LoadingButton
                  size="sm"
                  sx={{ width: '100%' }}
                  type="submit"
                  variant="contained"
                  color={isEdit ? 'warning' : 'primary'}
                  loading={isSubmitting}
                  startIcon={<Iconify icon={isEdit ? 'eva:edit-2-fill' : 'carbon:add-filled'} />}
                >
                  {isEdit ? translate('edit_configuration') : translate('add_configuration')}
                </LoadingButton>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </FormProvider>
  );
}

export default AddSettingForm;
