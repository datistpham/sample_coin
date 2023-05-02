// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';

import useSettings from 'src/hooks2/useSettings';
import useLocales from 'src/hooks2/useLocales';
import Page from 'src/component/Page';
import SignalList from 'src/sections/telebot/SignalList';
import store2 from 'src/redux/dashboard/account/store';


// components



// ----------------------------------------------------------------------

export default function Signal() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  // useEffect(() => {
  //   socket.current.emit('trade-room', 'join');
  //   return () => socket.current.emit('trade-room', 'leave');
  // }, [socket]);

  return (
    <StoreProvider store={store2}>
      <Page title={translate('list_signal')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack spacing={2}>
            <SignalList />
          </Stack>
        </Container>
      </Page>
    </StoreProvider>
  );
}
