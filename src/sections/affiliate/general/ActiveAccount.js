// @mui
import { Container, Tab, Box, Tabs, Card, CardHeader, CardContent } from '@mui/material';
import Iconify from 'src/component/Iconify';
import useLocales from 'src/hooks2/useLocales';
import useTabs from 'src/hooks2/useTabs';
import AutomaticActive from './active/AutomaticActive';
import ManualActive from './active/ManualActive';



const ActiveAccount = () => {
  const { translate } = useLocales();
  const { currentTab, onChangeTab } = useTabs(translate('manual_active'));

  const TABS = [
    {
      value: translate('manual_active'),
      icon: <Iconify icon={'logos:active-campaign-icon'} width={20} height={20} />,
      component: <ManualActive />,
    },
    {
      value: translate('automatic_active'),
      icon: <Iconify icon={'cib:automatic'} width={20} height={20} />,
      component: <AutomaticActive />,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Tabs
          allowScrollButtonsMobile
          variant="fullWidth"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
          centered
        >
          {TABS.map((tab) => (
            <Tab className={"tab-a21"} style={{display: "flex", flexDirection: "row", gap: 10}} key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>
        {/* <Box sx={{ }} /> */}


        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;

          return isMatched && <Box key={tab.value}>{tab.component}</Box>;

        })}
      </CardContent>
    </Card>
  );
};

export default ActiveAccount;
