// @mui
import { Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';

import { Provider as StoreProvider } from 'react-redux';
import Page from 'src/component/Page';

// hooks
import useAuth from 'src/hooks2/useAuth';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';
import { PATH_PAGE } from 'src/routes/paths';
import { ConfigurationRentingList } from 'src/sections/telebot';



// ----------------------------------------------------------------------

export default function RentingBot() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { user } = useAuth();
  const navigate = useRouter();

  if (user.levelStaff < 3) {
    navigate.push(PATH_PAGE.page404, { replace: true });
  }

  return (
    <StoreProvider store={store2}>
      <Page title={translate('Quản lý danh sách bot đang thuê')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <ConfigurationRentingList />
            </Grid>
          </Grid>
        </Container>
      </Page>
    </StoreProvider>
  );
}
