import { useSnackbar } from 'notistack';
import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';

// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// components
import LoadingScreen from '../components/LoadingScreen';

// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

import { PATH_AFTER_LOGIN, HOST_API } from '../config';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard/app" replace />,
    },
    
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        {
          path: 'reset-password',
          element: (
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <Home /> },
        { path: 'account', element: <Account /> },
        { path: 'statics', element: <StaticsTimeLine /> },
      ],
    },
    {
      path: '/trading',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'copytrade', element: <CopyTrade /> },
        {
          path: 'history',
          element: <HistoryCopyTrade />,
        },
        { path: 'cptsetting', element: <SettingCopyTrade /> },
        { path: 'edit/:_id', element: <EditSettingCopyTrade /> },
      ],
    },
    {
      path: '/bot',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'setting', element: <BotSetting /> },
        { path: 'edit/:_id', element: <EditBotSetting /> },
        { path: 'history/:_id', element: <BotHistory /> },
        { path: 'history', element: <BotHistory /> },
        { path: 'method-management', element: <MethodManagement /> },
        { path: 'edit-chain-method/:_id', element: <EditChainMethod /> },
        { path: 'edit-bubble-method/:_id', element: <EditBubbleMethod /> },
        { path: 'timer', element: <BotTimer /> },
        { path: 'edit-timer/:_id', element: <EditBotTimer /> },
      ],
    },
    {
      path: '/telebot',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'setting', element: <TeleBotSetting /> },
        { path: 'edit/:_id', element: <EditTeleBotSetting /> },
        { path: 'history/:_id', element: <TeleBotHistory /> },
        { path: 'history', element: <TeleBotHistory /> },
        { path: 'timer', element: <TeleBotTimer /> },
        { path: 'edit-timer/:_id', element: <EditTeleBotTimer /> },
        { path: 'signal-list', element: <TeleSignal /> },
        { path: 'history-customer/:_id', element: <TeleBotHistoryCustomer /> },
      ],
    },
    {
      path: '/renting-bot',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [{ element: <RentingBot />, index: true }],
    },
    {
      path: '/jackpot',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [{ element: <Jackpot />, index: true }],
    },
    {
      path: '/affiliate',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'general', element: <AffiliateGeneral /> },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Dashboard
const Home = Loadable(lazy(() => import('../pages/dashboard/Home')));
const Account = Loadable(lazy(() => import('../pages/dashboard/Account')));
const StaticsTimeLine = Loadable(lazy(() => import('../pages/dashboard/StaticsTimeLine')));

// TRADING

const CopyTrade = Loadable(lazy(() => import('../pages/trading/copytrade/Trading')));
const HistoryCopyTrade = Loadable(lazy(() => import('../pages/trading/copytrade/History')));
const SettingCopyTrade = Loadable(lazy(() => import('../pages/trading/copytrade/SettingCopyTrade')));
const EditSettingCopyTrade = Loadable(lazy(() => import('../pages/trading/copytrade/SettingCopyTrade')));

// BOT

const BotSetting = Loadable(lazy(() => import('../pages/bot/BotSetting')));
const EditBotSetting = Loadable(lazy(() => import('../pages/bot/BotSetting')));
const BotHistory = Loadable(lazy(() => import('../pages/bot/History')));
const MethodManagement = Loadable(lazy(() => import('../pages/bot/MethodManagement')));
const EditChainMethod = Loadable(lazy(() => import('../pages/bot/MethodManagement')));
const EditBubbleMethod = Loadable(lazy(() => import('../pages/bot/MethodManagement')));
const BotTimer = Loadable(lazy(() => import('../pages/bot/Timer')));
const EditBotTimer = Loadable(lazy(() => import('../pages/bot/Timer')));

// TELE BOT
const TeleBotSetting = Loadable(lazy(() => import('../pages/telebot/BotSetting')));
const EditTeleBotSetting = Loadable(lazy(() => import('../pages/telebot/BotSetting')));
const TeleBotHistory = Loadable(lazy(() => import('../pages/telebot/History')));
const TeleBotHistoryCustomer = Loadable(lazy(() => import('../pages/telebot/HistoryCustomer')));
const TeleBotTimer = Loadable(lazy(() => import('../pages/telebot/Timer')));
const EditTeleBotTimer = Loadable(lazy(() => import('../pages/telebot/Timer')));
const TeleSignal = Loadable(lazy(() => import('../pages/telebot/Signal')));
const RentingBot = Loadable(lazy(() => import('../pages/telebot/RentingBot')));

// JACKPOT
const Jackpot = Loadable(lazy(() => import('../pages/jackpot')));

// AFFILIATES

const AffiliateGeneral = Loadable(lazy(() => import('../pages/affiliate/General')));

const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPassword')));
