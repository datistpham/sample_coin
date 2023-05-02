// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';
import { useEffect, useContext } from 'react';
import { SocketContext } from 'src/contexts/socket';
import useSettings from 'src/hooks2/useSettings';
import useLocales from 'src/hooks2/useLocales';
import store2 from 'src/redux/dashboard/account/store';
import Page from 'src/component/Page';
import { NavbarCopyTrade } from 'src/sections/trading/copytrade/trading';
import { CanvasResults } from 'src/sections/bo';

// hooks


// ----------------------------------------------------------------------

export default function Trading() {
  const socket = useContext(SocketContext);

  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  // useEffect(() => {
  //   emit('trade-room', 'join');
  //   return () => emit('trade-room', 'leave');
  // }, [socket]);
  return (
    <StoreProvider store={store2}>
      <Page title={translate('trading')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack spacing={2}>
            <NavbarCopyTrade />
            <CanvasResults />
          </Stack>
        </Container>
      </Page>
    </StoreProvider>
  );
}
