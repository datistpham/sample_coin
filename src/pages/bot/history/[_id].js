// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';

import { useContext, useEffect } from 'react';
import Page from 'src/component/Page';
import { History } from 'src/sections/bot';
import { CanvasResults } from 'src/sections/bo';
import { SocketContext } from 'src/contexts/socket';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import store2 from 'src/redux/dashboard/account/store';

// import useLocales from '../../hooks/useLocales';
// import useSettings from '../../hooks/useSettings';
// import Page from '../../components/Page';

// import { CanvasResults } from '../../sections/bo';
// import { History } from '../../sections/bot';

// import store from '../../redux/dashboard/account/store';
// import { SocketContext, emit } from '../../contexts/socket';

// ----------------------------------------------------------------------

export default function BotHistory() {
  const socket = useContext(SocketContext);

  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  // useEffect(() => {
  //   emit('trade-room', 'join');
  //   return () => emit('trade-room', 'leave');
  // }, [socket]);

  return (
    <StoreProvider store={store2}>
      <Page title={translate('history')}>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack spacing={2}>
            <History />
            <CanvasResults />
          </Stack>
        </Container>
      </Page>
    </StoreProvider>
  );
}
