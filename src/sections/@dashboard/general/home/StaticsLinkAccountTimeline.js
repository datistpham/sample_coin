import merge from 'lodash/merge';
import dayjs from 'dayjs';
import { Card, Grid, CardContent, CardHeader, IconButton, TextField, MenuItem, Stack } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { getExchange } from 'src/redux/dashboard/account/action';
import { API_EXCHANGE } from 'src/apis';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import useLocales from 'src/hooks2/useLocales';
import { BaseOptionChart } from 'src/component/chart';
import Iconify from 'src/component/Iconify';
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

function StaticsLinkAccountTimeline() {
  const dispatch = useDispatch();

  const getExchangeAccount = async () => {
    dispatch(await getExchange());
  };

  const exchangeAccounts = useSelector((state) => state.exchangeAccountsLogined);

  const [linkAccountId, setLinkAccountId] = useState('');

  useEffect(() => {
    if (!exchangeAccounts || (exchangeAccounts && exchangeAccounts.length === 0)) getExchangeAccount();
    
  }, [exchangeAccounts]);

  useEffect(() => {
    if (exchangeAccounts && exchangeAccounts.length > 0) {
      setLinkAccountId(exchangeAccounts[0]._id);
    }
  }, [exchangeAccounts]);

  const handleChangeAccount = (e) => {
    try {
      setLinkAccountId(e.target.value);
    } catch (e) {
      console.log(e);
    }
  };

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([
    {
      name: 'DEMO',
      data: [],
    },
    {
      name: 'LIVE',
      data: [],
    },
  ]);

  const chartOption = merge(BaseOptionChart(), {
    xaxis: {
      categories,
    },
    chart: {
      redrawOnParentResize: true,
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4,
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1,
          },
        },
      },
    },
    series: data,
  });

  const isMountedRef = useIsMountedRef();
  const theme = useTheme();
  const { translate } = useLocales();

  const [now, setTime] = useState(new Date());

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    getHistories();
  }, [now]);

  const [fromTime, setFromTime] = useState(dayjs(new Date().setDate(new Date().getDate() - 1)));
  const [endTime, setEndTime] = useState(dayjs());

  const getHistories = useCallback(async () => {
    try {
      if (linkAccountId === undefined || !linkAccountId) {
        return;
      }
      // const date = now.getDate();
      // const month = now.getMonth() + 1;
      // const year = now.getFullYear();

      const response = await API_EXCHANGE.getStaticsLinkAccount(
        linkAccountId,
        fromTime.unix() * 1000,
        endTime.unix() * 1000
      );

      if (isMountedRef.current) {
        if (response.data.ok) {
          const current = {
            categories: [],
            data: [
              {
                name: 'DEMO',
                data: [],
              },
              {
                name: 'LIVE',
                data: [],
              },
            ],
            itemCount: 0,
            divideCount: 0,
          };

          if (response.data.d && response.data.d.length > 0) {
            current.itemCount = response.data.d.length;
            current.divideCount = current.itemCount;
            if (current.itemCount > 0) {
              current.divideCount = 1;
            }
            if (current.itemCount > 40) {
              current.divideCount = 5;
            }
            if (current.itemCount > 80) {
              current.divideCount = 10;
            }
            if (current.itemCount > 120) {
              current.divideCount = 20;
            }
            if (current.itemCount > 160) {
              current.divideCount = 30;
            }
            if (current.itemCount > 200) {
              current.divideCount = 40;
            }
            response.data.d.forEach((item, index) => {
              const time = new Date(item.createTime);
              const hour = time.getHours();
              const minute = time.getMinutes();
              const name = `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
              current.data[0].data.push(parseFloat(item.totalProfit_Demo.toFixed(2)));
              current.data[1].data.push(parseFloat(item.totalProfit_Live.toFixed(2)));
              if (index === 0 || index === current.itemCount - 1 || index % current.divideCount === 0) {
                current.categories.push(name);
              } else {
                current.categories.push('');
              }
            });
          }

          if (current.data[0].data.length === 0) {
            current.data = current.data.filter(
              (a) =>
                a.name !== 'DEMO' || current.data[0].data.filter((a) => a === 0).length === current.data[0].data.length
            );
          }

          if (
            current.data[1].data.length === 0 ||
            current.data[1].data.filter((a) => a === 0).length === current.data[1].data.length
          ) {
            current.data = current.data.filter((a) => a.name !== 'LIVE');
          }

          setCategories(current.categories);
          setData(current.data);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [isMountedRef, linkAccountId, now, fromTime, endTime]);

  useEffect(() => {
    getHistories();
  }, [linkAccountId]);

  const handleChangeFromTime = (newValue) => {
    setFromTime(newValue);
  };

  const handleChangeEndTime = (newValue) => {
    setEndTime(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card>
        <CardHeader
          title={translate('statics_link_account')}
          action={
            <Stack direction="row" spacing={1}>
              <IconButton size="small" aria-label="next" color="warning" disabled={isLoading} onClick={getHistories}>
                <Iconify icon="mdi:refresh-circle" />
              </IconButton>
              <TextField
                size="small"
                fullWidth
                select
                value={linkAccountId}
                name="linkAccountId"
                onChange={handleChangeAccount}
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
              </TextField>
            </Stack>
          }
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Stack direction="row" spacing={2}>
                <DateTimePicker
                  size="small"
                  label={translate('from')}
                  value={fromTime}
                  onChange={handleChangeFromTime}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                  size="small"
                  label={translate('to')}
                  value={endTime}
                  onChange={handleChangeEndTime}
                  renderInput={(params) => <TextField {...params} />}
                />
                <IconButton aria-label="next" color="warning" disabled={isLoading} onClick={getHistories}>
                  <Iconify icon="material-symbols:screen-search-desktop" />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={12}>
              <ReactApexChart options={chartOption} series={data} type="line" width={"100%"} height={365} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}

export default StaticsLinkAccountTimeline;
