// cài đặt quản lý vốn

import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import {
  Card,
  CardHeader,
  Grid,
  Select,
  Stack,
  MenuItem,
  InputLabel,
  CardContent,
  Alert,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useSelector, useDispatch } from 'react-redux';
import { RHFTextField } from 'src/component/hook-form';
import useLocales from 'src/hooks2/useLocales';



const CAPITALS_TYPE = [
  { name: 'martingale', value: 0, minRows: 1, defaultValue: '1-2-4-8-17-35' },
  { name: 'fibo1step', value: 1, minRows: 1, defaultValue: '1-2-3-5-8-13-21-34-55-89-144' },
  { name: 'fibo2step', value: 2, minRows: 1, defaultValue: '1-2-3-5-8-13-21-34-55-89-144' },
  {
    name: 'victor1',
    value: 3,
    minRows: 2,
    defaultValue:
      '1-1-2-2-3-4-5-7-10-13-18-24-32-44-59-80-108-146-197-271\n0-2-4-4-6-8-10-14-20-26-36-48-64-88-118-160-216-292-394-542',
  },
  {
    name: 'victor2',
    value: 4,
    minRows: 3,
    defaultValue:
      '1-1-1-1-1-1-1.5-2-2-2-2.5-3-3.5-4-4.5-5.4-6-7-8-9.5-11\n0-2-2-2-2-2-3-3.9-3.9-3.9-4.875-5.85-6.825-7.8-8.775-10.53-11.7-13.65-15.6-18.525-21.45\n0-4-4-4-4-4-6-7.605-7.605-7.605-9.50625-11.4075-13.30875-15.21-17.11125-20.5335-22.815-26.6175-30.42-36.12375-41.8275',
  },
  {
    name: 'victor3',
    value: 5,
    minRows: 4,
    defaultValue:
      '1-1-1-1-1-1-1-1-1-1-1-1-1-1-1.23-1.25-1.28-1.3-1.47-1.6-1.74-1.88-2.04-2.22\n1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-1.95-2.28-2.32-2.36-2.41-2.73-2.96-3.21-3.48-3.78\n3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-3.8-4.22-4.29-4.37-4.45-5.04-5.47-5.94-6.44-6.99-7.59\n7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.41-7.81-7.94-8.08-8.24-9.33-10.12-10.99-11.92-12.93-14.03',
  },
  {
    name: 'money_custom',
    value: 6,
    minRows: 3,
    defaultValue: '1-1-2-6-4-3\n1-2-4-8-17-35\n2-3-4-5-6-1',
  },
];

const INCREASE_VALUE_TYPES = [
  { name: 'increase_when_losing', value: 0 },
  { name: 'increase_when_winning', value: 1 },
  { name: 'always_increasing', value: 2 },
];

function CapitalManagementSetting({ isEdit, setValue, watch }) {
  const { translate } = useLocales();

  const exchangeAccounts = useSelector((state) => state.exchangeAccounts);

  const [minRows, setMinRows] = useState(1);
  const [increase, setIncrease] = useState(true);

  const handleOnChangeCapitalManagement = (e) => {
    setValue('capital_management_type', e.target.value);
    setValue('capital_management', CAPITALS_TYPE.find((a) => a.value === e.target.value).defaultValue);

    updateRowsCapitalManagement(e.target.value);
  };

  const updateRowsCapitalManagement = (type) => {
    setMinRows(CAPITALS_TYPE.find((a) => a.value === type).minRows);
    if (type > 2) {
      setIncrease(false);

      return;
    }
    setIncrease(true);
  };

  const values = watch();
  useEffect(() => {
    if (isEdit) {
      updateRowsCapitalManagement(values.capital_management_type);
    }
  }, [values]);

  return (
    <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
      <Grid item xs={12} md={6}>
        <RHFTextField name="name" label={translate('bot_configuration_name')} size="small" />
      </Grid>

      <Grid item xs={12} md={6}>
        <RHFTextField
          size="small"
          fullWidth
          select
          name="capital_management_type"
          onChange={(e) => {
            handleOnChangeCapitalManagement(e);
          }}
          label={translate('capital_management')}
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
          {CAPITALS_TYPE.map((capital) => (
            <MenuItem
              key={capital.value}
              checked
              value={capital.value}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {translate(capital.name)}
            </MenuItem>
          ))}
        </RHFTextField>
      </Grid>
      <Grid item xs={12} md={12}>
        {increase ? (
          <RHFTextField
            size="small"
            fullWidth
            select
            name="increase_value_type"
            label={translate('increase_value_type')}
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
            {INCREASE_VALUE_TYPES.map((increaseType) => (
              <MenuItem
                key={increaseType.value}
                checked
                value={increaseType.value}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {translate(increaseType.name)}
              </MenuItem>
            ))}
          </RHFTextField>
        ) : (
          <></>
        )}
      </Grid>

      <Grid item xs={12} md={12}>
        <RHFTextField
          name="capital_management"
          minRows={minRows}
          multiline={minRows > 1}
          label={translate('orders_value')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFTextField name="bet_second" type={'number'} label={translate('betting_seconds')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="take_profit_target" type={'text'} label={translate('take_profit_target')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="stop_loss_target" type={'text'} label={translate('stop_loss_target')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="win_streak_target" type={'number'} label={translate('win_streak_target')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="lose_streak_target" type={'number'} label={translate('lose_streak_target')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="win_total_target" type={'number'} label={translate('win_total_target')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="lose_total_target" type={'number'} label={translate('lose_total_target')} size="small" />
      </Grid>
      <Grid item xs={12} md={12}>
        <Alert variant="outlined" severity="warning">
          {translate('unused_targets_enter_0')}
        </Alert>
      </Grid>
    </Grid>
  );
}

export default CapitalManagementSetting;
