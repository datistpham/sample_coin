import { Stack, MenuItem, Card, Grid, CardHeader, CardContent, Button, Switch, FormControlLabel } from '@mui/material';
import ExpertBetForm from './ExpertBetForm';
import ExpertStatus from './ExpertStatus';
import SignalBotTelegram from './SignalBotTelegram';
import { FollowersAction } from '.';

function ExpertTrading() {
  return (
    <>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <SignalBotTelegram
              sx={{
                minHeight: 500,
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Grid item xs={12} md={12}>
                <ExpertBetForm />
              </Grid>
              <Grid item xs={12} md={12}>
                <ExpertStatus />
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={12} md={12}>
            <FollowersAction />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default ExpertTrading;
