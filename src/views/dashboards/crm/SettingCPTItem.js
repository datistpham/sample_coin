import { Stack, Typography, Box } from '@mui/material';

import { React } from 'react';
import Iconify from 'src/component/Iconify';

function SettingCPTItem({ icon, title, content }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
        }}
      >
        <Iconify icon={icon} sx={{ width: 25, height: 25, color: 'white' }} />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 160 }}>
        <Stack direction="row" alignItems="center" sx={{ mt: 0.5, color: 'text.secondary' }}>
          <Typography variant="caption" sx={{ mr: 1, fontSize: '0.8em' }}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="subtitle2">{content}</Typography>
      </Box>
    </Stack>
  );
}

export default SettingCPTItem;
