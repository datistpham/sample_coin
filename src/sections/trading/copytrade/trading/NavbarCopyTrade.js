// @mui
import { Container, Tab, Box, Tabs, Card, CardHeader, CardContent } from '@mui/material';

// hooks
import { useContext, useEffect } from 'react';
import Iconify from 'src/component/Iconify';
import useLocales from 'src/hooks2/useLocales';
import useTabs from 'src/hooks2/useTabs';
import ExpertTrading from './ExpertTrading';
import PersonalTrading from './PersonalTrading';


function NavbarCopyTrade() {
  const { translate } = useLocales();

  const { currentTab, onChangeTab } = useTabs(translate('personal_trading'));

  const ACCOUNT_TABS = [
    {
      value: translate('personal_trading'),
      icon: <Iconify icon={'icon-park-solid:personal-privacy'} width={20} height={20} />,
      component: <PersonalTrading />,
    },
    {
      value: translate('expert_trading'),
      icon: <Iconify icon={'cib:experts-exchange'} width={20} height={20} />,
      component: <ExpertTrading />,
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

        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
}

export default NavbarCopyTrade;
