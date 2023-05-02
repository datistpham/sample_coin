// @mui
import { Container, Grid } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';
import { JackpotData } from 'src/sections/jackpot';

// hooks



// ----------------------------------------------------------------------

export default function Jackpot() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  return (
    <StoreProvider store={store2}>
      <Page title={translate('Jackpot')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <JackpotData />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </StoreProvider>
  );
}
