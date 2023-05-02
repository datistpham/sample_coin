import { useSnackbar } from 'notistack';

import { useState, useEffect } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import Draggable from 'react-draggable';
import { format } from 'date-fns';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useLocales from 'src/hooks2/useLocales';


function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function InfoDialog({ isOpen, setIsOpen, data }) {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [loading, setLoading] = useState(true);

  const [maxWidth, setMaxWidth] = useState('sm');

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {data && (
        <Dialog
          open={isOpen}
          PaperComponent={PaperComponent}
          onClose={handleClose}
          maxWidth={maxWidth}
          fullWidth
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {translate('info')} : {data.name}
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {data.lastData && (
                <>
                  <Grid item xs={12} md={12}>
                    <Typography>{`${translate('profit')} : ${parseFloat(
                      data.lastData.profit.toFixed(2)
                    )} $`}</Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography>{`${translate('win_streak')} : ${data.lastData.winStreak}/${
                      data.lastData.bestWinStreak
                    }`}</Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography>{`${translate('loss_streak')} : ${data.lastData.loseStreak}/${
                      data.lastData.bestLoseStreak
                    }`}</Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography>{`${translate('victor_streak')} : ${data.lastData.victorStreak}/${
                      data.lastData.bestVictorStreak
                    }`}</Typography>
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Typography>{`${translate('last_method')} : ${translate(
                      data.lastData.lastMethodName
                    )}`}</Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography>{`${translate('win_total')} : ${data.lastData.winTotal}`}</Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography>{`${translate('lose_total')} : ${data.lastData.loseTotal}`}</Typography>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={12}>
                <Typography>{`${translate('day_profit')} (DEMO) : ${parseFloat(
                  data.day_profit_demo.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('day_profit')} (LIVE) : ${parseFloat(
                  data.day_profit_live.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('total_profit')} (DEMO) : ${parseFloat(
                  data.total_profit_demo.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('total_profit')} (LIVE) : ${parseFloat(
                  data.total_profit_live.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('volume_day')} (DEMO) : ${parseFloat(
                  data.day_volume_demo.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('volume_day')} (LIVE) : ${parseFloat(
                  data.day_volume_live.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('total_volume')} (DEMO) : ${parseFloat(
                  data.total_volume_demo.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('total_volume')} (LIVE) : ${parseFloat(
                  data.total_volume_live.toFixed(2)
                )} $`}</Typography>
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography>{`${translate('created_time')} : ${format(
                  new Date(data.createdAt),
                  'HH:mm:ss dd/MM/yyyy'
                )}`}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
