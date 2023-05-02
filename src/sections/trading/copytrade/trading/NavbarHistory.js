// @mui
import { Container, Tab, Box, Tabs, Card, CardHeader, CardContent } from '@mui/material';

// hooks

import PersonalTrading from './PersonalTrading';
import ExpertTradingHistory from './ExpertTradingHistory';
import PersonalTradingHistory from './PersonalTradingHistory';
import Iconify from 'src/component/Iconify';
import useLocales from 'src/hooks2/useLocales';
import useTabs from 'src/hooks2/useTabs';

function NavbarHistory() {
  const { translate } = useLocales();
  const { currentTab, onChangeTab } = useTabs(translate('history_my_trade'));

  const ACCOUNT_TABS = [
    {
      value: translate('history_my_trade'),
      icon: <Iconify icon={'icon-park-solid:personal-privacy'} width={20} height={20} />,
      component: <PersonalTradingHistory />,
    },
    {
      value: translate('history_copy_trade'),
      icon: <Iconify icon={'cib:experts-exchange'} width={20} height={20} />,
      component: <ExpertTradingHistory />,
    },
  ];

  return (
    <>
      <Tabs
        allowScrollButtonsMobile
        variant="fullWidth"
        scrollButtons="auto"
        value={currentTab}
        onChange={onChangeTab}
        centered
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ mb: 5 }} />

      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;

        return isMatched && <Box sx={{width: "100%"}} key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
}

export default NavbarHistory;
