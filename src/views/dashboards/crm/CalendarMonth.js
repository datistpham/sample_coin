import { Card, Grid, CardContent, Chip, Stack, IconButton, CircularProgress } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import EditCalendarDialog from './EditCalendarDialog';
import useAuth from 'src/hooks2/useAuth';
import useIsMountedRef from 'src/hooks2/useIsMountedRef';
import Iconify from 'src/component/Iconify';
import Label from 'src/component/Label';
import { API_EXCHANGE } from 'src/apis';
import useLocales from 'src/hooks2/useLocales';

function CalendarMonth({ linkAccountId, accType }) {
  const isMountedRef = useIsMountedRef();
  const theme = useTheme();
  const { translate } = useLocales();

  const { user } = useAuth();
  const [now, setTime] = useState(new Date());

  const [isLoading, setLoading] = useState(false);

  const increaseTime = () => {
    try {
      setLoading(true);
      const newTime = now.setMonth(now.getMonth() + 1);
      setTime(new Date(newTime));
    } catch (e) {
      console.log(e);
    }
  };

  const decreaseTime = () => {
    try {
      setLoading(true);
      const newTime = now.setMonth(now.getMonth() - 1);
      setTime(new Date(newTime));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getHistories();

  }, [now]);

  const allDays = getDaysInMonth(now.getMonth(), now.getFullYear());

  const [history, setHistory] = useState([]);

  const getHistories = useCallback(async () => {
    try {
      if (linkAccountId === undefined || !linkAccountId) {
        return;
      }
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const response = await API_EXCHANGE.getHistory(linkAccountId, month, year);

      if (isMountedRef.current) {
        if (response.data.ok) {
          setHistory(response.data.d);

          const currentProfit = {
            totalProfit: 0,
            totalVolume: 0,
          };
          response.data.d.forEach((data) => {
            if (accType === 'DEMO') {
              currentProfit.totalProfit += data.profit_demo;
              currentProfit.totalVolume += data.volume_demo;
            }
            if (accType === 'LIVE') {
              currentProfit.totalProfit += data.profit_live;
              currentProfit.totalVolume += data.volume_live;
            }
          });
          setTotalProfit(currentProfit.totalProfit);
          setTotalVolume(currentProfit.totalVolume);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [isMountedRef, accType, linkAccountId, now]);

  const [totalProfit, setTotalProfit] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);

  useEffect(() => {
    const currentProfit = {
      totalProfit: 0,
      totalVolume: 0,
    };
    history.forEach((data) => {
      if (accType === 'DEMO') {
        currentProfit.totalProfit += data.profit_demo;
        currentProfit.totalVolume += data.volume_demo;
      }
      if (accType === 'LIVE') {
        currentProfit.totalProfit += data.profit_live;
        currentProfit.totalVolume += data.volume_live;
      }
    });

    setTotalProfit(currentProfit.totalProfit);
    setTotalVolume(currentProfit.totalVolume);

  }, [accType]);

  useEffect(() => {
    getHistories();

  }, [linkAccountId]);

  const [isOpenEditCalendar, setOpenEditCalendar] = useState(false);

  return (
    <>
      <EditCalendarDialog
        linkAccountId={linkAccountId}
        isOpen={isOpenEditCalendar}
        setIsOpen={setOpenEditCalendar}
        accountType={accType}
        reloadHistories={getHistories}
      />
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Grid container spacing={1}>
              <Grid item xs={7} md={8} align="left" marginBottom={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
                  <Chip
                    label={`${translate('short_total_profit')}: ${parseFloat(totalProfit.toFixed(2))}$`}
                    sx={{
                      bgcolor: 'rgb(224, 224, 224)',
                      color: 'rgba(0, 0, 0, 0.87)',
                      width: 'fit-content',
                      padding: '1em',
                    }}
                    variant="contained"
                  />
                  <Chip
                    label={`${translate('short_total_volume')}: ${parseFloat(totalVolume.toFixed(2))}$`}
                    color={'warning'}
                    sx={{
                      ml: 1,
                      color: 'rgba(0, 0, 0, 0.87)',
                      width: 'fit-content',
                      padding: '1em',
                    }}
                    variant="contained"
                  />
                </Stack>
              </Grid>
              {/* <Grid item xs={1} md={1} align="left">

              </Grid> */}
              <Grid item xs={2} md={2} align="left">
                <></>
              </Grid>

              <Grid item xs={3} md={2} align="right">
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    aria-label="previous"
                    color="warning"
                    disabled={isLoading}
                    sx={{ bgcolor: 'primary.main' }}
                    onClick={decreaseTime}
                  >
                    <Iconify icon="ooui:arrow-previous-ltr" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="next"
                    color="warning"
                    disabled={isLoading}
                    sx={{ bgcolor: 'primary.main' }}
                    onClick={increaseTime}
                  >
                    <Iconify icon="ooui:arrow-previous-rtl" />
                  </IconButton>
                  {user.levelStaff >= 3 && (
                    <IconButton
                      size="small"
                      aria-label="next"
                      color="info"
                      disabled={isLoading}
                      sx={{ bgcolor: 'warning.main' }}
                      onClick={() => {
                        setOpenEditCalendar(true);
                      }}
                    >
                      <Iconify icon="ph:pencil-line" />
                    </IconButton>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{ border: '2px solid', borderColor: 'primary.main', borderRadius: '0.4em', height: '100%' }}
            >
              {allDays.map((day) => {
                const date = day.getDate();

                return (
                  <Day
                    day={date}
                    key={date}
                    isLoading={isLoading}
                    info={history.find((a) => a.day === date)}
                    accType={accType}
                  />
                );
              })}


              <Grid
                item
                xs={4}
                md={2}
                align="center"
                sx={{
                  borderRight: '1px solid #424242',
                  borderBottom: '1px solid #424242',
                  paddingTop: '1.5em',
                  paddingBottom: '0.5em',

                  minHeight: '4.5em',
                }}
              >
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  sx={{ fontSize: '0.8em', padding: '0.5em', bgcolor: 'primary.main', color: 'white' }}
                >
                  {translate('month')} {now.getMonth() + 1} - {now.getFullYear().toString().replace('20', '')}
                </Label>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}

const Day = ({ day, info, accType, isLoading }) => {
  const [profit, setProfit] = useState('');
  const [volume, setVolume] = useState('');

  useEffect(() => {
    if (info) {
      setProfit(accType === 'DEMO' ? info.profit_demo : info.profit_live);
      setVolume(accType === 'DEMO' ? info.volume_demo : info.volume_live);

      return;
    }
    setVolume('');
    setProfit('');
  }, [info, accType]);

  return (
    <Grid
      item
      xs={4}
      md={2}
      align="center"
      sx={{
        borderRight: '1px solid #424242',
        borderBottom: '1px solid #424242',
        paddingTop: '0.3em',
        paddingBottom: '0.5em',

        minHeight: '4.5em',
      }}
    >
      {isLoading ? (
        <CircularProgress size={25} />
      ) : (
        <>
          {' '}
          <p style={{ fontSize: '0.9em' }}>{day}</p>
          <p style={{ fontSize: '0.9em', color: profit >= 0 ? '#54D62C' : '#FF4842' }}>
            {profit > 0 ? `+${parseFloat(profit.toFixed(2))} $` : profit < 0 && `${parseFloat(profit.toFixed(2))} $`}
          </p>
          <p style={{ fontSize: '0.9em', color: 'orange' }}>{volume > 0 && `${parseFloat(volume.toFixed(2))} $`}</p>
        </>
      )}
    </Grid>
  );
};

const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

export default CalendarMonth;
