import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

import {
  Card,
  MenuItem,
  IconButton,
  Stack,
  CardHeader,
  CardContent,
  Button,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Box,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { DataGrid } from '@mui/x-data-grid';

import { React, useState, useEffect } from 'react';

// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// import Iconify from '../../../components/Iconify';
// import Label from '../../../components/Label';

// import useTabs from '../../../hooks/useTabs';
// import useLocales from '../../../hooks/useLocales';
// import { PATH_DASHBOARD } from '../../../routes/paths';
// import { API_BOT } from '../../../apis';
import MoneyChain from './money-chain';
import MoneyBubble from './money-bubble';
import useLocales from 'src/hooks2/useLocales';
import Iconify from 'src/component/Iconify';
import useTabs from 'src/hooks2/useTabs';

// routes
function Setting() {
  const { translate } = useLocales();

  const theme = useTheme();

  const defaultTab = window.location.href.indexOf('bubble') > -1 ? translate('money_bubble') : translate('money_chain');

  const { currentTab, onChangeTab } = useTabs(defaultTab);

  const TABS = [
    {
      value: translate('money_chain'),
      icon: <Iconify icon={'icon-park:blockchain'} width={20} height={20} />,
      component: <MoneyChain />,
    },
    {
      value: translate('money_bubble'),
      icon: <Iconify icon={'fluent-emoji:bubbles'} width={20} height={20} />,
      component: <MoneyBubble />,
    },
  ];

  return (
    <>
      {window.location.href.indexOf('edit') < 0 && (
        <Tabs
          allowScrollButtonsMobile
          variant="fullWidth"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          centered
        >
          {TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
      )}

      <Box sx={{ mb: 5 }} />

      {TABS.map((tab) => {
        const isMatched = tab.value === currentTab;

        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        
      })}
    </>
  );
}

export default Setting;
