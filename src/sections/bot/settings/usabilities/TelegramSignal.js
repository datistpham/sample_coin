import { useState, useEffect } from 'react';

import { Grid, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// import { RHFTextField, RHFSwitch } from '../../../../components/hook-form';
// import Label from '../../../../components/Label';

// import useLocales from '../../../../hooks/useLocales';
// import { API_TELEBOT } from '../../../../apis';
import MixMode from './MixMode';
import AutoChangeMode from './AutoChangeMode';
import WaitSignalMode from './WaitSignalMode';
import useLocales from 'src/hooks2/useLocales';
import { API_TELEBOT } from 'src/apis';
import { RHFTextField } from 'src/component/hook-form';
import RHFSwitch from 'src/component/hook-form/RHFSwitch';
import Label from 'src/component/Label';

const ADVANCED_FEATURES = [
  { id: 1, key: 'mix_mode_enabled', name: 'mix_methods_mode' },
  { id: 2, key: 'auto_change_mode_enabled', name: 'auto_change_methods_mode' },
  { id: 3, key: 'wait_signal_enabled', name: 'wait_signal' },
];

const TelegramSignal = ({ watch, setValue, isEdit }) => {
  const { translate } = useLocales();
  const theme = useTheme();

  const [bots, setBots] = useState([]);

  const getBotsRunning = async () => {
    try {
      const response = await API_TELEBOT.getListRunning();
      if (response.data.ok) {
        setBots(response.data.d);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getBotsRunning();
  }, []);

  const values = watch();

  useEffect(() => {}, [values]);

  useEffect(() => {
    if (values.auto_change_mode_enabled) {
      setAdvanceFuture(2);
    }
  }, [values.auto_change_mode_enabled]);

  useEffect(() => {
    if (values.mix_mode_enabled) {
      setAdvanceFuture(1);
    }
  }, [values.mix_mode_enabled]);

  useEffect(() => {
    if (values.wait_signal_enabled) {
      setAdvanceFuture(3);
    }
  }, [values.wait_signal_enabled]);

  const [advanceFeature, setAdvanceFuture] = useState(0);

  const handleChangeAdvanceFeature = (e) => {
    try {
      setAdvanceFuture(e.target.value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    ADVANCED_FEATURES.forEach((feature) => {
      if (feature.id === advanceFeature) {
        setValue(feature.key, true);
      }
      if (feature.id !== advanceFeature) {
        setValue(feature.key, false);
      }
    });
  }, [advanceFeature]);

  return (
    <Grid container spacing={2}>
      {!values.fire_signal_enabled && (
        <Grid item xs={12} md={12}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id="demo-simple-select-label">{translate('advanced_feature')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              size="small"
              value={advanceFeature}
              onChange={handleChangeAdvanceFeature}
              label={translate('advanced_feature')}
            >
              <MenuItem key={0} value={0}>
                {translate('not_use')}
              </MenuItem>
              {ADVANCED_FEATURES.map((feature) => (
                <MenuItem key={feature.id} value={feature.id}>
                  {translate(feature.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {values.mix_mode_enabled || values.auto_change_mode_enabled || values.wait_signal_enabled ? (
        (values.mix_mode_enabled && (
          <Grid item xs={12} md={12}>
            <MixMode methods={bots} setValue={setValue} watch={watch} isEdit={isEdit} />
          </Grid>
        )) ||
        (values.auto_change_mode_enabled && (
          <Grid item xs={12} md={12}>
            <AutoChangeMode methods={bots} setValue={setValue} watch={watch} isEdit={isEdit} />
          </Grid>
        )) ||
        (values.wait_signal_enabled && (
          <Grid item xs={12} md={12}>
            <WaitSignalMode methods={bots} setValue={setValue} watch={watch} isEdit={isEdit} />
          </Grid>
        ))
      ) : (
        <>
          <Grid item xs={12} md={12}>
            <RHFTextField
              size="small"
              fullWidth
              select
              name="teleBotId"
              label={translate('bot_telegram_name')}
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
              {bots.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {translate(option.name)}
                </MenuItem>
              ))}
            </RHFTextField>
          </Grid>
          <Grid item xs={12} md={12}>
            <RHFSwitch
              name="fire_signal_enabled"
              label={
                <>
                  {translate('wait_for_session_signal')}{' '}
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={values.fire_signal_enabled ? 'success' : 'error'}
                  >
                    {values.fire_signal_enabled ? translate('is_on') : translate('is_off')}
                  </Label>
                </>
              }
              labelPlacement="end"
            />
          </Grid>
          {values.fire_signal_enabled && (
            <>
              {' '}
              <Grid item xs={6} md={6}>
                <RHFTextField
                  name="fs_fire_x_sessions"
                  type={'number'}
                  label={translate('fire_x_sessions')}
                  size="small"
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField name="fs_in_x_session" type={'number'} label={translate('in_x_sessions')} size="small" />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField
                  name="fs_skip_x_session"
                  type={'number'}
                  label={translate('skip_x_sessions')}
                  size="small"
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <RHFTextField
                  name="fs_order_x_session"
                  type={'number'}
                  label={translate('order_x_sessions')}
                  size="small"
                />
              </Grid>
            </>
          )}
        </>
      )}
    </Grid>
  );
};

export default TelegramSignal;
