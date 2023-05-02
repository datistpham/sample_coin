// @mui
import { Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';
import useAuth from 'src/hooks2/useAuth';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';
import { PATH_PAGE } from 'src/routes/paths';
import { ConfigurationList, Setting } from 'src/sections/telebot';

// // hooks
// import { useNavigate } from 'react-router-dom';

// import useLocales from '../../hooks/useLocales';
// import useSettings from '../../hooks/useSettings';
// import useAuth from '../../hooks/useAuth';

// // components
// import Page from '../../components/Page';

// import { Setting, ConfigurationList } from '../../sections/telebot';

// import store from '../../redux/dashboard/account/store';
// import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function TeleBotSetting() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { user } = useAuth();
  const navigate = useRouter();

  if (user?.levelStaff < 1) {
    navigate.push(PATH_PAGE.page404, { replace: true });
  }

  return (
    <StoreProvider store={store2}>
      <Page title={translate('bot_management')}>
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
