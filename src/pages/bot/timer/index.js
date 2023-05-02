// @mui
import { Container, Grid } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';
import { ConfigurationList, Setting } from 'src/sections/bot/timer';

// hooks

// import useLocales from '../../hooks/useLocales';
// import useSettings from '../../hooks/useSettings';
// import Page from '../../components/Page';

// import { Setting, ConfigurationList } from '../../sections/bot/timer';

// import store from '../../redux/dashboard/account/store';

// ----------------------------------------------------------------------

export default function Timer() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  return (
    <StoreProvider store={store2}>
      <Page title={translate('timer')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Setting />
            </Grid>
            <Grid item xs={12} md={6}>
              <ConfigurationList />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </StoreProvider>
  );
}
