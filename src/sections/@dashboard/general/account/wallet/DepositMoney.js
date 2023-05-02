import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import {
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  OutlinedInput,
  Alert,
  InputLabel,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useLocales from 'src/hooks2/useLocales';
import Iconify from 'src/component/Iconify';
import { API_WALLET } from 'src/apis';


function DepositMoney({ linkAccountId, setMaxWidth, handleBack }) {
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();

  const [address, setAddress] = useState(null);

  const [loading, setLoading] = useState(true);

  const getAddress = async () => {
    setLoading(true);
    try {
      const response = await API_WALLET.getAddress(linkAccountId);

      if (response.data.ok) {
        setAddress(response.data.d.a);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const postAddress = async () => {
    setLoading(true);
    try {
      const response = await API_WALLET.postAddress(linkAccountId);
      if (response.data.ok) {
        setAddress(response.data.d.a);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    enqueueSnackbar(translate('copied'), { variant: 'success' });
  };

  useEffect(() => {
    setMaxWidth('sm');
    getAddress();
  }, [linkAccountId]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={12}>
        <Button
          onClick={handleBack}
          startIcon={<Iconify icon={'eva:arrow-back-outline'} />}
          variant="contained"
          size="small"
          color={'info'}
          sx={{ mb: 1 }}
        >
          {translate('back')}
        </Button>
        <Card>
          <CardContent>
            {loading ? (
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <CircularProgress />
              </Stack>
            ) : (
              <Stack spacing={1}>
                {address ? (
                  <>
                    <InputLabel htmlFor="toAddress">{translate('toAddress')}</InputLabel>
                    <OutlinedInput
                      id="toAddress"
                      defaultValue={address}
                      endAdornment={
                        <InputAdornment position="end">
                          <CopyToClipboard text={address}>
                            <IconButton aria-label="copyclipboard" onClick={handleCopyToClipboard} edge="end">
                              <Iconify icon={'clarity:copy-to-clipboard-line'} />
                            </IconButton>
                          </CopyToClipboard>
                        </InputAdornment>
                      }
                    />
                    <Alert variant="filled" severity="info">
                      Hãy gửi USDT , ALI theo địa chỉ ví BSC20 trên
                    </Alert>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    onClick={postAddress}
                    startIcon={<Iconify icon={'carbon:intent-request-scale-out'} />}
                  >
                    Yêu cầu lấy mã ví
                  </Button>
                )}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default DepositMoney;
