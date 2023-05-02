import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Box, IconButton, Grid, TextField, Button } from '@mui/material';
import Iconify from 'src/component/Iconify';
import Label from 'src/component/Label';
import { API_EXCHANGE } from 'src/apis';
import useLocales from 'src/hooks2/useLocales';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 2, 3),
}));

// ----------------------------------------------------------------------

WidgetTotalTarget.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error']),
  icon: PropTypes.any,
  title: PropTypes.string,
};

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(16),
  height: theme.spacing(16),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

export default function WidgetTotalTarget({
  totalTakeProfit = 0,
  totalStopLoss = 0,
  total,
  icon,
  isMoney = true,
  color = 'success',
  actions = null,
  accountType,
  _id,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const { translate } = useLocales();
  const theme = useTheme();

  const [takeProfit, setTakeProfit] = useState(totalTakeProfit);
  const [stopLoss, setStopLoss] = useState(totalStopLoss);

  const handleChangeTakeProfit = (e) => {
    setTakeProfit(e.target.value);
  };

  const handleChangeStopLoss = (e) => {
    setStopLoss(e.target.value);
  };

  useEffect(() => {
    setTakeProfit(totalTakeProfit);
    setStopLoss(totalStopLoss);
  }, [totalTakeProfit, totalStopLoss]);

  const handleUpdateTotalTarget = async () => {
    try {
      const response = await API_EXCHANGE.updateTotalTarget(_id, {
        totalTakeProfit: takeProfit,
        totalStopLoss: stopLoss,
        accountType,
      });

      if (response.data.ok) {
        enqueueSnackbar(translate('success'), { variant: 'success' });

        return;
      }
      enqueueSnackbar(translate('failed'), { variant: 'error' });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <RootStyle style={{height: "100%"}}>
      <div style={{height: "100%"}}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
          {translate('closing_total_profit')} :{' '}
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={parseFloat(total) >= 0 ? 'success' : 'error'}
            sx={{ fontSize: '0.8em' }}
          >
            {isMoney ? fShortenNumber(total) : total} {isMoney && '$'}
          </Label>
          {actions && actions}
        </Typography>
        <Grid item container spacing={1}>
          <Grid item xs={4} md={4}>
            <TextField
              type="number"
              size="small"
              label={`${translate('take_profit')} ($)`}
              value={takeProfit}
              onChange={handleChangeTakeProfit}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <TextField
              type="number"
              size="small"
              label={`${translate('stop_loss')} ($)`}
              value={stopLoss}
              onChange={handleChangeStopLoss}
            />
          </Grid>
          <Grid item xs={4} md={4}>
            <Button
              startIcon={<Iconify icon={'bxs:save'} />}
              variant="contained"
              onClick={handleUpdateTotalTarget}
              size="small"
              sx={{ height: '100%' }}
            >
              {translate('save')}
            </Button>
          </Grid>
        </Grid>
      </div>
      <Box>
        <IconWrapperStyle
          sx={{
            color: (theme) => theme.palette[color].dark,
            bgcolor: 'white',
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                theme.palette[color].dark,
                0.24
              )} 100%)`,
          }}
        >
          <Iconify icon={icon} width={35} height={35} />
        </IconWrapperStyle>
      </Box>
    </RootStyle>
  );
}
