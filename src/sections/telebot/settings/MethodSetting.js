// cài đặt quản lý vốn

import { Grid, MenuItem } from '@mui/material';
import { RHFCheckbox, RHFTextField } from 'src/component/hook-form';
import PersonalMethods from 'src/sections/bot/settings/usabilities/PersonalMethods';



function MethodSetting({ isEdit, setValue, watch }) {
  const { translate } = useLocales();
  const values = watch();

  return (
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
        {values.usability === 2 ? <PersonalMethods watch={watch} setValue={setValue} isEdit={isEdit} /> : <></>}
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="telegramBotToken" label={translate('telegram_bot_token')} size="small" />
      </Grid>
      <Grid item xs={6} md={6}>
        <RHFTextField name="telegramChatId" label={translate('telegram_chat_id')} size="small" />
      </Grid>
      <Grid item xs={12} md={12}>
        <RHFTextField name="channel_url" label={translate('Channel URL')} size="small" />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="isNotificationsEnabled" label={translate('allow_notifications')} labelPlacement="end" />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFCheckbox name="isBrokerMode" label={translate('expert_mode')} labelPlacement="end" />
      </Grid>
      <Grid item xs={12} md={6}>
        <RHFCheckbox
          name="get_bet_type_enabled"
          label={translate('Lấy kết quả dựa trên phương pháp')}
          labelPlacement="end"
        />
      </Grid>
    </Grid>
  );
}

export default MethodSetting;
