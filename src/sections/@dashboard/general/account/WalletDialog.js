import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import { Grid, CircularProgress, Stack, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NavbarWallet from './wallet/NavbarWallet';
import useLocales from 'src/hooks2/useLocales';
import Iconify from 'src/component/Iconify';
import { API_WALLET } from 'src/apis';

export default function WalletDialog({ isOpen, linkAccountId, handleClose, reloadInfo = null }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  const [currentLinkAccount, setCurrentLinkAccount] = useState(linkAccountId);

  const [maxWidth, setMaxWidth] = useState('md');

  const getBalance = async (setLoad = true) => {
    if (setLoad) setLoading(true);
    try {
      if (currentLinkAccount === 0) {
        handleClose();

        return;
      }
      const response = await API_WALLET.getBalance(currentLinkAccount);

      if (response.data.ok && response.data.d) {
        const data = response.data.d;

        setBalance(data);

        const totalBalanceTemp =
          data.aliAvailableBalance * data.aliPrice + data.availableBalance + data.usdtAvailableBalance;
        setTotalBalance(totalBalanceTemp);

        return;
      }
      enqueueSnackbar(translate('account_not_logged_in'), { variant: 'error' });
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getBalance();
    }
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (linkAccountId !== 0) {
      setCurrentLinkAccount(linkAccountId);
    }
  }, [linkAccountId]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth={maxWidth} fullWidth>
        <DialogTitle>
          {translate('total_asset')} <Iconify icon={'cryptocurrency:usdt'} sx={{ color: 'success.main' }} /> :{' '}
          {parseFloat(totalBalance.toFixed(3))} $
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <Iconify icon={'bi:x-circle-fill'} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          {balance && !loading ? (
            <NavbarWallet
              linkAccountId={linkAccountId}
              balance={balance}
              handleReloadBalance={getBalance}
              reloadInfo={reloadInfo}
              setMaxWidth={setMaxWidth}
            />
          ) : (
            <Grid item xs={12} md={12}>
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <CircularProgress />
              </Stack>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
