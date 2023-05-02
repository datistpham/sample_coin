// cài đặt quản lý vốn

import { Grid, MenuItem, Typography, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import useLocales from 'src/hooks2/useLocales';
import { API_AUTH } from 'src/apis';
import ActiveTelegramDialog from './ActiveTelegramDialog';
import { RHFCheckbox, RHFTextField } from 'src/component/hook-form';
import Iconify from 'src/component/Iconify';
import TelegramSignal from './usabilities/TelegramSignal';
import PersonalMethods from './usabilities/PersonalMethods';
import RHFSwitch from 'src/component/hook-form/RHFSwitch';
import WaitSignalOtherBot from './usabilities/WaitSignalOtherBot';


// import { RHFTextField, RHFSwitch, RHFCheckbox } from '../../../components/hook-form';
// import Iconify from '../../../components/Iconify';

// import useLocales from '../../../hooks/useLocales';
// import TelegramSignal from './usabilities/TelegramSignal';
// import PersonalMethods from './usabilities/PersonalMethods';
// import WaitSignalOtherBot from './usabilities/WaitSignalOtherBot';

// import { API_AUTH } from '../../../apis';
// import ActiveTelegramDialog from './ActiveTelegramDialog';

function MethodSetting({ isEdit, setValue, watch }) {
  
  const { translate } = useLocales();

  const values = watch();

  const [canUseTelegram, setUseTelegram] = useState(false);

  const [expTelegram, setExpTelegram] = useState(0);

  const getProfile = async () => {
    try {
      const response = await API_AUTH.getProfile();

      if (response.status === 200 && response.data.user !== null) {
        if (response.data.user.exp_telegram > new Date().getTime()) {
          setExpTelegram(response.data.user.exp_telegram);
          setUseTelegram(response.data.user.can_use_telegram);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [isOpenActiveTelegram, setOpenActiveTelegram] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <ActiveTelegramDialog
        isOpen={isOpenActiveTelegram}
        setIsOpen={setOpenActiveTelegram}
        setUseTelegram={setUseTelegram}
      />
      {values.fromId ? (
        <Grid container spacing={2} sx={{ mt: 3, mb: 3 }} textCenter>
          <Grid item xs={12} md={12}>
            <Typography sx={{ color: 'warning.main' }}>
              {translate('the_donated_configuration_can_only_edit')}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography sx={{ color: 'info.main' }}>{translate('click_edit_configuration_to_finish')}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFCheckbox name="isNotificationsEnabled" label={translate('allow_notifications')} labelPlacement="end" />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFCheckbox name="isBrokerMode" label={translate('expert_mode')} labelPlacement="end" />
          </Grid>
          <Grid item xs={12} md={12}>
            <RHFCheckbox
              name="not_stop_when_logged_out_enabled"
              label={translate('not_stop_when_logged_out_enabled')}
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack direction="row">
              <RHFCheckbox
                name="telegram_signal"
                label={
                  canUseTelegram
                    ? `${translate('send_signal_to_telegram')} (HSD : ${format(new Date(expTelegram), 'HH:mm dd/MM')})`
                    : translate('send_signal_to_telegram')
                }
                labelPlacement="end"
                disabled={!canUseTelegram}
              />

              {!canUseTelegram && (
                <Button
                  size="small"
                  color="warning"
                  variant="contained"
                  onClick={() => {
                    setOpenActiveTelegram(true);
                  }}
                >
                  {translate('active_now')}
                </Button>
              )}
            </Stack>
          </Grid>
          {values.telegram_signal && (
            <Grid item xs={12} md={12}>
              <Stack direction="row" spacing={2}>
                <RHFTextField name="telegram_signal_chatid" type={'text'} label={translate('Chat ID')} size="small" />
                <Button
                  startIcon={<Iconify icon={'simple-icons:telegram'} />}
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    window.open('https://t.me/aitradesignal_bot', '_blank', 'noopener,noreferrer');
                  }}
                  fullWidth
                >
                  {translate('get_chat_id')}
                </Button>
              </Stack>
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
          <Grid item xs={7} md={8}>
            <RHFTextField
              size="small"
              fullWidth
              select
              name="usability"
              label={translate('usability')}
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
                key={0}
                checked
                value={0}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {translate('basic')}
              </MenuItem>
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
                Telegram Signal
              </MenuItem>
              <MenuItem
                key={2}
                checked
                value={2}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {translate('personal_methods')}
              </MenuItem>
            </RHFTextField>
          </Grid>

          <Grid item xs={5} md={4}>
            <RHFCheckbox name="reverse_enabled" label={translate('reverse_order')} labelPlacement="end" />
          </Grid>
          <Grid item xs={12} md={12}>
            {values.usability === 1 ? <TelegramSignal watch={watch} setValue={setValue} isEdit={isEdit} /> : <></>}
            {values.usability === 2 ? <PersonalMethods watch={watch} setValue={setValue} isEdit={isEdit} /> : <></>}
          </Grid>
          <Grid item xs={12} md={12}>
            <RHFSwitch
              name="wait_signal_from_other_bot_enabled"
              label={translate('wait_signal_from_other_bot')}
              labelPlacement="end"
            />
          </Grid>

          {values.wait_signal_from_other_bot_enabled && (
            <Grid item xs={12} md={12}>
              <WaitSignalOtherBot isEdit={isEdit} setValue={setValue} watch={watch} />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <RHFCheckbox name="isNotificationsEnabled" label={translate('allow_notifications')} labelPlacement="end" />
          </Grid>
          <Grid item xs={12} md={6}>
            <RHFCheckbox name="isBrokerMode" label={translate('expert_mode')} labelPlacement="end" />
          </Grid>
          <Grid item xs={12} md={12}>
            <RHFCheckbox
              name="not_stop_when_logged_out_enabled"
              label={translate('not_stop_when_logged_out_enabled')}
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <RHFCheckbox
              name="not_turn_off_bot_when_not_enough_balance_enabled"
              label={translate('not_turn_off_bot_when_not_enough_balance_enabled')}
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Stack direction="row">
              <RHFCheckbox
                name="telegram_signal"
                label={
                  canUseTelegram
                    ? `${translate('send_signal_to_telegram')} (HSD : ${format(new Date(expTelegram), 'HH:mm dd/MM')})`
                    : translate('send_signal_to_telegram')
                }
                labelPlacement="end"
                disabled={!canUseTelegram}
              />

              {!canUseTelegram && (
                <Button
                  size="small"
                  color="warning"
                  variant="contained"
                  onClick={() => {
                    setOpenActiveTelegram(true);
                  }}
                >
                  {translate('active_now')}
                </Button>
              )}
            </Stack>
          </Grid>
          {values.telegram_signal && (
            <Grid item xs={12} md={12}>
              <Stack direction="row" spacing={2}>
                <RHFTextField name="telegram_signal_chatid" type={'text'} label={translate('Chat ID')} size="small" />
                <Button
                  startIcon={<Iconify icon={'simple-icons:telegram'} />}
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    window.open('https://t.me/aitradesignal_bot', '_blank', 'noopener,noreferrer');
                  }}
                  fullWidth
                >
                  {translate('get_chat_id')}
                </Button>
              </Stack>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}

export default MethodSetting;
