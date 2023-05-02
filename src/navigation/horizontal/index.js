import useAuth from "src/hooks2/useAuth"


const Navigation = () => {
  const {user }= useAuth()
  if(user?.levelStaff== 3) {
    return [
      {
        sectionTitle: 'Dashboard'
      },
      {
        title: 'Dashboards',
        icon: 'mdi:home-outline',
        path: '/dashboards/crm',
        badgeColor: 'error',
      },
      {
        title: 'Static',
        icon: 'iconoir:stat-up',
        path: '/dashboards/statics'
      },
      {
        title: 'Exchange Account',
        icon: 'material-symbols:currency-exchange',
        path: '/dashboards/account'
      },
      {
        title: 'Affiliate',
        icon: 'tabler:affiliate',
        path: '/affiliate/general'
      },
      {
        title: 'Jackbot',
        icon: 'mdi:file-document-outline',
        path: '/jackpot'
      },
      {
        title: 'Signal',
        icon: 'material-symbols:signal-cellular-alt-sharp',
        path: '/telebot/signal-list'

      },
      {
        sectionTitle: 'Trading'
      },
      {
        title: 'Copy Trade',
        icon: 'mdi:registered-trademark',
        children: [
          {
            title: 'Trading (Zoom)',
            path: '/trading/copytrade'
          },
          {
            title: 'History',
            path: '/trading/history'
          },
          {
            title: 'Setting',
            path: '/trading/cptsetting'
          }
        ]
      },
      {
        sectionTitle: 'Auto Trading'
      },
      {
        title: 'Bot Trade',
        icon: 'bx:bot',
        children: [
          {
            title: 'Bot Management',
            path: '/bot/setting'
          },
          {
            title: 'Method Management',
            path: '/bot/method-management'
          },
          {
            title: 'History',
            path: '/bot/history'
          },
          {
            title: 'Timer',
            path: '/bot/timer'
          }

        ]
      },
      {
        title: 'Bot Telegram',
        icon: 'logos:telegram',
        children: [
          {
            title: 'Bot Management',
            path: '/telebot/setting'
          },
          {
            title: 'History',
            path: '/telebot/history'
          },
          {
            title: 'Timer',
            path: '/telebot/timer'
          }

        ]
      },
      {
        title: 'Quản lý thuê bot',
        icon: 'gg:bot',
        path: "/renting-bot"
      },
    ]
  }
  else {
    return [
      {
        sectionTitle: 'Dashboard'
      },
      {
        title: 'Dashboards',
        icon: 'mdi:home-outline',
        path: '/dashboards/crm',
        badgeColor: 'error',
      },
      {
        title: 'Static',
        icon: 'iconoir:stat-up',
        path: '/dashboards/statics'
      },
      {
        title: 'Exchange Account',
        icon: 'material-symbols:currency-exchange',
        path: '/dashboards/account'
      },
      {
        title: 'Affiliate',
        icon: 'tabler:affiliate',
        path: '/affiliate/general'
      },
      {
        title: 'Jackbot',
        icon: 'mdi:file-document-outline',
        path: '/jackpot'
      },
      {
        title: 'Signal',
        icon: 'material-symbols:signal-cellular-alt-sharp',
        path: '/telebot/signal-list'

      },
      {
        sectionTitle: 'Trading'
      },
      {
        sectionTitle: 'Auto Trading'
      },
      {
        title: 'Bot Trade',
        icon: 'bx:bot',
        children: [
          {
            title: 'Bot Management',
            path: '/bot/setting'
          },
          {
            title: 'Method Management',
            path: '/bot/method-management'
          },
          {
            title: 'History',
            path: '/bot/history'
          },
          {
            title: 'Timer',
            path: '/bot/timer'
          }
        ]
      },
    ]
  }
}

export default Navigation
