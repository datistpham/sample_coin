// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import { AddSettingForm, ListSetting } from 'src/sections/trading/copytrade/setting';

// hooks

// import useLocales from '../../../hooks/useLocales';
// import useSettings from '../../../hooks/useSettings';
// import Page from '../../../components/Page';

// import { AddSettingForm, ListSetting} from '../../../sections/trading/copytrade/setting';

// ----------------------------------------------------------------------

export default function SettingCopyTrade() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  return (
    <Page title={translate('copytrade_setting')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
      <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <AddSettingForm />
            </Grid>
            <Grid item xs={12} md={7}>
              <ListSetting />
            </Grid>

          </Grid>
      </Container>
    </Page>
  );
}
