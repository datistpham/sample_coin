import { useState, useEffect, useCallback } from 'react';

import { Grid, MenuItem, Divider, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';

import useLocales from 'src/hooks2/useLocales';
import { getBotList } from 'src/redux/dashboard/account/action';
import { RHFCheckbox, RHFTextField } from 'src/component/hook-form';


// import { RHFTextField, RHFSwitch, RHFCheckbox } from '../../../../components/hook-form';

// import { getBotList } from '../../../../redux/dashboard/account/action';

// import useLocales from '../../../../hooks/useLocales';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const WaitSignalOtherBot = ({ isEdit, setValue, watch }) => {
  const { translate } = useLocales();

  const dispatch = useDispatch();

  const getBots = async () => {
    dispatch(await getBotList());
  };

  const botList = useSelector((state) => state.botList);

  const values = watch();

  useEffect(() => {
    if (botList.length === 0) getBots();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <RHFTextField
          size="small"
          fullWidth
          select
          name="wait_signal_from_other_bot_id"
          label={translate('configuration_name_want_to_waiting')}
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
          {isEdit
            ? botList
                .filter((a) => a._id !== values._id)
                .map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {translate(option.name)}
                  </MenuItem>
                ))
            : botList.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {translate(option.name)}
                </MenuItem>
              ))}
        </RHFTextField>
      </Grid>
      <Grid item xs={12} md={12}>
        <Divider>
          <Chip label={translate('condition_to_start')} />
        </Divider>
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_win_total"
          type={'number'}
          label={translate('start_when_win_total')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_lose_total"
          type={'number'}
          label={translate('start_when_lose_total')}
          size="small"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_win_streak"
          type={'number'}
          label={translate('start_when_win_streak')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_lose_streak"
          type={'number'}
          label={translate('start_when_lose_streak')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_profit"
          type={'text'}
          label={translate('start_when_profit')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_loss"
          type={'text'}
          label={translate('start_when_loss')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Divider>
          <Chip label={translate('stop_condition_to_wait_signal')} />
        </Divider>
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_stop_win_total"
          type={'number'}
          label={translate('stop_for_waiting_signal_when_win_total')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_stop_lose_total"
          type={'number'}
          label={translate('stop_for_waiting_signal_when_lose_total')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_stop_win_streak"
          type={'number'}
          label={translate('stop_for_waiting_signal_when_win_streak')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_stop_lose_streak"
          type={'number'}
          label={translate('stop_for_waiting_signal_when_lose_streak')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_stop_profit"
          type={'text'}
          label={translate('stop_for_waiting_signal_when_profit')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFTextField
          name="wait_signal_from_other_bot_stop_loss"
          type={'text'}
          label={translate('stop_for_waiting_signal_when_loss')}
          size="small"
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_from_other_start_when_exactly_enabled"
          label={translate('wait_signal_from_other_start_when_exactly_enabled')}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFCheckbox
          name="wait_signal_from_other_get_stop_signal_based_on_navigation_bot_enabled"
          label={translate('wait_signal_from_other_get_stop_signal_based_on_navigation_bot_enabled')}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <Typography sx={{ color: 'warning.main' }}>
          {translate('note')}: {translate('unused_targets_enter_0')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WaitSignalOtherBot;
