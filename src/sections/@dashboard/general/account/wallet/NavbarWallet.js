// @mui
import { Tab, Box, Tabs } from '@mui/material';
import Iconify from 'src/component/Iconify';
import useLocales from 'src/hooks2/useLocales';
import useTabs from 'src/hooks2/useTabs';
import ExchangeWallet from './ExchangeWallet';
import MainWallet from './MainWallet';
import RewardWallet from './RewardWallet';



function NavbarWallet({ balance, handleReloadBalance, linkAccountId, setMaxWidth, reloadInfo }) {
  const { translate } = useLocales();

  const { currentTab, onChangeTab } = useTabs(translate('main_wallet'));

  const ACCOUNT_TABS = [
    {
      value: translate('main_wallet'),
      icon: <Iconify icon={'entypo:wallet'} width={20} height={20} />,
      component: (
        <MainWallet
          linkAccountId={linkAccountId}
          balance={balance}
          handleReloadBalance={handleReloadBalance}
          setMaxWidth={setMaxWidth}
          reloadInfo={reloadInfo}
        />
      ),
      type: 0,
    },
    {
      value: translate('exchange_wallet'),
      icon: <Iconify icon={'icon-park-outline:exchange'} width={20} height={20} />,
      component: (
        <ExchangeWallet
          linkAccountId={linkAccountId}
          balance={balance}
          handleReloadBalance={handleReloadBalance}
          setMaxWidth={setMaxWidth}
          reloadInfo={reloadInfo}
        />
      ),
      type: 0,
    },
    {
      value: translate('reward_wallet'),
      icon: <Iconify icon={'arcticons:rewards'} width={20} height={20} />,
      component: (
        <RewardWallet
          linkAccountId={linkAccountId}
          balance={balance}
          handleReloadBalance={handleReloadBalance}
          setMaxWidth={setMaxWidth}
          reloadInfo={reloadInfo}
        />
      ),
      type: 1,
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
        {ACCOUNT_TABS.map((tab) => {
          if (tab.type === 1 && balance.aliPrice === 0) return <></>;

          return <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />;
        })}
      </Tabs>
      <Box sx={{ mb: 3 }} />

      {ACCOUNT_TABS.map((tab) => {
        if (tab.type === 1 && balance.aliPrice === 0) return <></>;
        const isMatched = tab.value === currentTab;

        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </>
  );
}

export default NavbarWallet;
