// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';
import { AccountAddNew, GuideAccount, ListExchangeAccount } from 'src/sections/@dashboard/general/account';

// hooks


// ----------------------------------------------------------------------

export default function Account() {
  const { themeStretch } = useSettings();

  return (
    <StoreProvider store={store2}>
      <Page title="Account">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <AccountAddNew />
            </Grid>
            <Grid item xs={12} md={7}>
              <GuideAccount />
            </Grid>
            <Grid item xs={12} md={12}>
              <ListExchangeAccount />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </StoreProvider>
  );
}
