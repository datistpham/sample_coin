// @mui
import { Container, Grid, Stack, TextField, MenuItem } from '@mui/material';

import { Provider as StoreProvider } from 'react-redux';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PATH_PAGE } from 'src/routes/paths';
import Page from 'src/component/Page';
import store2 from 'src/redux/dashboard/account/store';
import { History } from 'src/sections/telebot';
import { CanvasResults } from 'src/sections/bo';
import useLocales from 'src/hooks2/useLocales';
import useSettings from 'src/hooks2/useSettings';
import useAuth from 'src/hooks2/useAuth';

// hooks

// import { useNavigate } from 'react-router-dom';

// import useLocales from '../../hooks/useLocales';
// import useSettings from '../../hooks/useSettings';
// import useAuth from '../../hooks/useAuth';

// // components
// import Page from '../../components/Page';

// import { CanvasResults } from '../../sections/bo';
// import { History } from '../../sections/telebot';

// import store from '../../redux/dashboard/account/store';
// import { SocketContext } from '../../contexts/socket';
// import { PATH_PAGE } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function TeleBotHistory() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  const { user } = useAuth();
  const navigate = useRouter();

  // useEffect(() => {
  //   socket.current.emit('trade-room', 'join');
  //   return () => socket.current.emit('trade-room', 'leave');
  // }, [socket]);

  if (user.levelStaff < 1) {
    navigate.push(PATH_PAGE.page404);
  }

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
