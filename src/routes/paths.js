// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_TRADING = '/trading';
const ROOTS_BOT = '/bot';
const ROOTS_TELEBOT = '/telebot';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_RENTINGBOT = '/renting-bot';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  bot: {
    root: ROOTS_BOT,
    setting: path(ROOTS_BOT, '/setting'),
    edit: (_id) => path(ROOTS_BOT, `/edit/${_id}`),
    history: (_id = '') => {
      if (_id === '') return path(ROOTS_BOT, `/history`);
      if (_id !== '') return path(ROOTS_BOT, `/history/${_id}`);
    },
    method_management: path(ROOTS_BOT, '/method-management'),
    edit_chain_method: (_id) => path(ROOTS_BOT, `/edit-chain-method/${_id}`),
    edit_bubble_method: (_id) => path(ROOTS_BOT, `/edit-bubble-method/${_id}`),
    timer: path(ROOTS_BOT, '/timer'),
    edit_timer: (_id) => path(ROOTS_BOT, `/edit-timer/${_id}`),
  },
  telebot: {
    root: ROOTS_TELEBOT,
    setting: path(ROOTS_TELEBOT, '/setting'),
    edit: (_id) => path(ROOTS_TELEBOT, `/edit/${_id}`),
    signal_list: path(ROOTS_TELEBOT, '/signal-list'),
    history: (_id = '') => {
      if (_id === '') return path(ROOTS_TELEBOT, `/history`);
      if (_id !== '') return path(ROOTS_TELEBOT, `/history/${_id}`);
    },
    history_customer: (_id = '') => {
      if (_id === '') return path(ROOTS_TELEBOT, `/signal-list`);
      if (_id !== '') return path(ROOTS_TELEBOT, `/history-customer/${_id}`);
    },
    timer: path(ROOTS_TELEBOT, '/timer'),
    edit_timer: (_id) => path(ROOTS_TELEBOT, `/edit-timer/${_id}`),
  },
  copytrade_setting: {
    root: ROOTS_TRADING,
    setting: path(ROOTS_TRADING, '/cptsetting'),
    trading: path(ROOTS_TRADING, '/copytrade'),
    history: path(ROOTS_TRADING, '/history'),
    edit: (_id) => path(ROOTS_TRADING, `/edit/${_id}`),
  },
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  history: {
    view: (name) => path(ROOTS_DASHBOARD, `/history-trade/${name}`),
  },
  renting_bot: ROOTS_RENTINGBOT,
};
