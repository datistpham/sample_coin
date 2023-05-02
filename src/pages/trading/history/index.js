// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';

import { useContext, useEffect } from 'react';

import { SocketContext } from 'src/contexts/socket';
import useSettings from 'src/hooks2/useSettings';
import useLocales from 'src/hooks2/useLocales';
import store2 from 'src/redux/dashboard/account/store';
import Page from 'src/component/Page';
import { NavbarHistory } from 'src/sections/trading/copytrade/trading';
import { CanvasResults } from 'src/sections/bo';

// import useLocales from '../../../hooks/useLocales';
// import useSettings from '../../../hooks/useSettings';
// import Page from '../../../components/Page';

// import { NavbarHistory } from '../../../sections/trading/copytrade/trading';
// import { CanvasResults } from '../../../sections/bo';

// import store from '../../../redux/dashboard/account/store';
// import { SocketContext } from '../../../contexts/socket';

// ----------------------------------------------------------------------

export default function CopyTradeHistory() {
  const socket = useContext(SocketContext);

  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  // useEffect(() => {
  //   socket.current.emit('trade-room', 'join');
  //   return () => socket.current.emit('trade-room', 'leave');
  // }, [socket]);
  return (
    <StoreProvider store={store2}>
      <Page title={translate('history')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack spacing={2}>
            <NavbarHistory />
            <CanvasResults />
          </Stack>
        </Container>
      </Page>
    </StoreProvider>
  );
}
