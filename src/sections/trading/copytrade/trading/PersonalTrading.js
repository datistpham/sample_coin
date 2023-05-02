import { Stack, MenuItem, Card, Grid, CardHeader, CardContent, Button, Switch, FormControlLabel } from '@mui/material';
import PersonalBetForm from './PersonalBetForm';
import SignalBotTelegram from './SignalBotTelegram';

function PersonalTrading() {
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
            <PersonalBetForm />
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

export default PersonalTrading;
