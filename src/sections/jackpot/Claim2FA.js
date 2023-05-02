import { useSnackbar } from 'notistack';

import { useState } from 'react';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useLocales from 'src/hooks2/useLocales';
import { API_JACKPOT } from 'src/apis';


export default function Claim2FA({ open, setOpen, linkAccountId, requestCode, getHistoryWinning }) {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [code, setCode] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handleClaim = async () => {
    const data = {
      code,
      otpCode,
      requestCode,
    };

    const response = await API_JACKPOT.claim(linkAccountId, data);

    if (response.data.ok) {
      enqueueSnackbar(translate('successfully_received_rewards'), { variant: 'success' });
      getHistoryWinning();
      handleClose();

      return;
    }
    enqueueSnackbar(response.data.m, { variant: 'error' });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Vui lòng nhập mã gửi về Email và 2FA</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            autoFocus
            label="Email Code"
            onChange={(e) => setOtpCode(e.target.value)}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            label="2FA Code"
            type="number"
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            variant="standard"
          />
          <Button variant="contained" onClick={handleClaim}>
            Nhận ngay
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
