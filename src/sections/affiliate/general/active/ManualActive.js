import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import { MenuItem, Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Overview from '../Overview';
import useLocales from 'src/hooks2/useLocales';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import { API_AFFILIATE } from 'src/apis';
import { getExchange } from 'src/redux/dashboard/account/action';

export default function ManualActive() {
  const { enqueueSnackbar } = useSnackbar();

  const isMountedRef = useIsMountedRef();
  const { translate } = useLocales();

  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };
  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  useEffect(() => {
    if (!exchangeAccounts) {
      getExchangeAccount();
    }
  }, []);

  const [currentRank, setCurrentRank] = useState(0);
  const [linkAccountId, setLinkAccountId] = useState(0);
  const [overviewData, setOverviewData] = useState({});

  const getOverview = async (id) => {
    if (id !== undefined && id !== '') {
      const response = await API_AFFILIATE.getOverview(id);
      if (isMountedRef.current)
        if (response.data.ok) {
          setCurrentRank(response.data.d.rank);
          setOverviewData(response.data.d);
        }
    }
  };

  const handleChangeAccount = async (e) => {
    await getOverview(e.target.value);
    setValue('linkAccountId', e.target.value);
    setLinkAccountId(e.target.value);

    // console.log('change', e);
  };

  const NetworkSchema = Yup.object().shape({
    linkAccountId: Yup.string().required(translate('please_choose_a_trading_account')),
    activeType: Yup.string().required(translate('please_select_an_active_account_type')),
    nickName: Yup.string().required(translate('please_enter_the_nickname_you_want_to_active')),
  });

  const defaultValues = {
    linkAccountId: '',
    activeType: 'normal',
    nickName: '',
  };

  const methods = useForm({
    resolver: yupResolver(NetworkSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    try {
      const response = await API_AFFILIATE.activeNickname(e);

      if (response.data.ok) {
        enqueueSnackbar(translate(response.data.d.err_code), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate(response.data.d.err_code), { variant: 'error' });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ py: 2.5, px: 3 }}>
        <RHFTextField
          size="small"
          fullWidth
          select
          name="linkAccountId"
          label={translate('exchange_account')}
          onChange={handleChangeAccount}
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
            <MenuItem
              key={1}
              checked
              value={1}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              <div style={{ display: 'flex' }}>{translate('not_affiliate_account_yet')}</div>
            </MenuItem>
          )}
        </RHFTextField>
        {currentRank > 0 ? (
          <>
            {' '}
            <RHFTextField
              size="small"
              fullWidth
              select
              name="activeType"
              label={'Loại kích hoạt'}
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
                key={'normal'}
                checked
                value={'normal'}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                Tài khoản Thường
              </MenuItem>
              <MenuItem
                key={'marketing'}
                checked
                value={'marketing'}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                Tài khoản Marketing
              </MenuItem>
            </RHFTextField>
            <RHFTextField name="nickName" label={translate('nickname')} size="small" />
            <LoadingButton
              disabled={currentRank === 0}
              size="medium"
              sx={{ width: '100%' }}
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {translate('active')}
            </LoadingButton>
            <Overview data={overviewData} />
          </>
        ) : (
          <Alert variant="outlined" severity="warning">
            {translate(
              linkAccountId === 0 ? 'please_choose_a_trading_account' : 'your_account_not_been_activated_affiliate'
            )}
          </Alert>
        )}
      </Stack>
    </FormProvider>
  );
}
