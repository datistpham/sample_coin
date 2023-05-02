// @mui
import { Container, Grid } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';
import { ActiveAccount, NetworkManangement } from 'src/sections/affiliate/general';

// hooks


// ----------------------------------------------------------------------

export default function Account() {
  const { themeStretch } = useSettings();

  return (
    <StoreProvider store={store2}>
      <Page title="Account">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ActiveAccount />
            </Grid>
            <Grid item xs={12} md={6}>
              <NetworkManangement />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </StoreProvider>
  );
}
