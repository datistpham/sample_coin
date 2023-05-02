import { useSnackbar } from 'notistack';

import { Card, MenuItem, Stack, CardHeader, CardContent, Typography, Divider, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { DataGrid } from '@mui/x-data-grid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExchange } from 'src/redux/dashboard/account/action';
import useLocales from 'src/hooks2/useLocales';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import { API_AFFILIATE } from 'src/apis';
import { FormProvider, RHFTextField } from 'src/component/hook-form';
import Overview from './Overview';


const compareTradevol = (a, b) => {
  if (a.tradevol < b.tradevol) {
    return 1;
  }
  if (a.tradevol > b.tradevol) {
    return -1;
  }

  return 0;
};

function NetworkManangement() {
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
    rank: Yup.string().required(translate('please_select_the_level_want_to_analyze')),
  });

  const defaultValues = {
    linkAccountId: '',
    rank: 0,
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

  const calculateVolume = async (data) => {
    try {
      const response = await API_AFFILIATE.calculateVolume(data);

      return response;
    } catch (err) {
      console.log(err);
    }
  };
  const ranks = [1, 2, 3, 4, 5, 6, 7];

  const [dataVolume, setDataVolume] = useState({
    traders: [],
    tradevol: 0,
    trading_coms: 0,
    isFind: false,
  });

  const dataVol = {
    traders: [],
    tradevol: 0,
    trading_coms: 0,
  };

  const handleDataVolume = (data, rank) => {
    try {
      const current = { i: 0 };
      while (current.i < data.traders.length) {
        data.traders[current.i].levelF = rank;
        current.i += 1;
      }
      dataVol.traders = [...data.traders, ...dataVol.traders];
      dataVol.tradevol += data.tradevol;
      dataVol.trading_coms += data.trading_coms;
    } catch (e) {
      console.log(e);
    }
  };

  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'id',
      headerName: '#',
      filterable: false,
      minWidth: 50,
      width: 80,
      maxWidth: 100,
      flex: 0.8,
    },
    {
      field: 'rank',
      headerName: translate('vip_level'),
      minWidth: 50,
      width: 80,
      maxWidth: 100,
      flex: 0.8,
    },
    {
      field: 'nick',
      headerName: translate('nickname'),
      minWidth: 100,
      width: 120,
      maxWidth: 150,
      flex: 1,
    },
    {
      field: 'levelF',
      headerName: translate('floor'),
      minWidth: 100,
      width: 120,
      maxWidth: 150,
      flex: 1,
      renderCell: (cellValues) => `${cellValues.row.levelF}`,
    },
  ];

  const onSubmit = async (e) => {
    setDataVolume({
      traders: [],
      tradevol: 0,
      trading_coms: 0,
      isFind: false,
    });
    try {
      const rank = e.rank;
      const total = { current: 1 };

      if (rank === 0 || rank === '0') {
        await Promise.all(
          ranks.map(async (rankCheck) => {
            if (rankCheck <= currentRank) {
              const obj = {
                rank: rankCheck,
                linkAccountId: e.linkAccountId,
              };
              const result = await calculateVolume(obj);
              handleDataVolume(result.data, rankCheck);
            }
          })
        );
        dataVol.traders.sort(compareTradevol);
        dataVol.traders.forEach((trader) => {
          trader.id = total.current;
          total.current += 1;
        });
        dataVol.isFind = true;

        setDataVolume(dataVol);
        setRows(dataVol.traders);
        setOverviewData({});

        return;
      }
      if (rank !== 0) {
        const result = await calculateVolume(e);
        handleDataVolume(result.data, rank);
        dataVol.traders.sort(compareTradevol);
        dataVol.traders.forEach((trader) => {
          trader.id = total.current;
          total.current += 1;
        });
        dataVol.isFind = true;

        setDataVolume(dataVol);
        setRows(dataVol.traders);
        setOverviewData({});
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={"f-aa"} style={{height: "100%"}}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card style={{height: "100%", width: "100%", padding: 20}}>
        <CardHeader title={translate('daily_commission_analysis')} />
        <CardContent style={{padding: 0}}>
          <Stack spacing={2}>
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
              {exchangeAccounts && exchangeAccounts.filter((a) => a.access_type === 0) ? (
                exchangeAccounts
                  .filter((a) => a.access_type === 0)
                  .map((option) => (
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
                  name="rank"
                  label={translate('Rank')}
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
                  {Array.from(Array(8), (e, i) => (
                    <MenuItem
                      key={i}
                      checked
                      value={i}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      }}
                    >
                      {i === 0
                        ? `${translate('according_to_current_level')} ( 1 -> ${currentRank})`
                        : ` ${translate('level')} ${i}`}
                    </MenuItem>
                  ))}
                </RHFTextField>
                <LoadingButton
                  disabled={currentRank === 0}
                  size="medium"
                  sx={{ width: '100%' }}
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  {translate('confirm')}
                </LoadingButton>
                <Overview data={overviewData || {}} />
              </>
            ) : (
              <Alert variant="outlined" severity="warning">
                {translate(
                  linkAccountId === 0 ? 'please_choose_a_trading_account' : 'your_account_not_been_activated_affiliate'
                )}
              </Alert>
            )}

            {dataVolume.traders.length > 0 && !isSubmitting ? (
              <>
                <Divider />

                <Typography variant="caption" sx={{ mr: 1, fontSize: '0.9em' }} color={'#f44336'}>
                  {translate('total_commission_level')}{' '}
                  {getValues('rank') === 0 ? `1->${currentRank}` : getValues('rank')} {translate('today_is')}:{' '}
                  {parseFloat(dataVolume.trading_coms.toFixed(2))} $
                </Typography>
                {/* <Typography variant="caption" sx={{ mr: 1, fontSize: '0.9em' }} color={'#ffc00e'}>
                  {translate('total_volume_level')}
                  {getValues('rank') === 0 ? `1->${currentRank}` : getValues('rank')} {translate('today_is')} :{' '}
                  {parseFloat(dataVolume.tradevol.toFixed(2))} $
                </Typography> */}
                <DataGrid
                  disableColumnSelector
                  disableColumnMenu
                  disableColumnFilter
                  autoHeight
                  rows={rows}
                  columns={columns}
                  components={{
                    LoadingOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        {translate('data_loading')}
                      </Stack>
                    ),
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        {translate('no_data_to_display')}
                      </Stack>
                    ),
                    NoResultsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        {translate('no_data_to_display')}
                      </Stack>
                    ),
                  }}
                  getRowId={(row) => row.nick}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  disableSelectionOnClick
                />
              </>
            ) : (
              <Typography variant="caption" sx={{ mr: 1, fontSize: '0.9em' }} align="center" color={'#ffc00e'}>
                {dataVolume.isFind ? translate('no_search_data_available') : ''}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    </FormProvider>
    </div>
  );
}

export default NetworkManangement;
