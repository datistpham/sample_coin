import { API_BOT, API_TELEBOT, API_COPYTRADE, API_EXCHANGE } from '../../../apis';

export const GET_EXCHANGES = 'GET_EXCHANGES';

export const GET_EXCHANGE_ACCOUNT = 'ADD_EXCHANGE_ACCOUNT';

export const GET_FOLLOWERS_DATA = 'GET_FOLLOWERS_DATA';

export const GET_BOT_LIST = 'GET_BOT_LIST';

export const GET_TELEBOT_LIST = 'GET_TELEBOT_LIST';

export const GET_METHOD_LIST = 'GET_METHOD_LIST';

export const GET_BOT_TIMER_LIST = 'GET_BOT_TIMER_LIST';

export const GET_TELE_BOT_TIMER_LIST = 'GET_TELE_BOT_TIMER_LIST';

export const USER_LOG_OUT = 'USER_LOG_OUT';

export const GET_LINKACCOUNT_SELECTED = 'GET_LINKACCOUNT_SELECTED';


export const stateData = {
  exchanges: [],
  exchangeAccounts: [],
  followersData: {
    followers: [],
    followersBlocking: [],
    followersLoggedIn: [],
  },
  botList: [],
  teleBotList: [],
  methodList: [],
  botTimerList: [],
  teleBotTimerList: [],
  linkAccountSelected: {
    id: '',
    type: 'LIVE',
  },
};

export const setLinkAccountSelected = (_id, _type) => {
  const payload = {
    id: _id,
    type: _type,
  };
  localStorage.setItem('linkAccount', JSON.stringify(payload));
    
  return {
    type: GET_LINKACCOUNT_SELECTED,
    payload,
  };
};

export const getExchanges = () => async (dispatch) => {
  const response = await API_EXCHANGE.getExchangeList();
  stateData.exchanges = response.data;

  dispatch({
    type: GET_EXCHANGES,
    payload: response.data,
  });
};

export const getExchange = () => async (dispatch) => {
  const response = await API_EXCHANGE.getAccounts();
  dispatch({
    type: GET_EXCHANGE_ACCOUNT,
    payload: response.data.d,
  });
};

export const getBotList = () => async (dispatch) => {
  const response = await API_BOT.getBots();
  dispatch({
    type: GET_BOT_LIST,
    payload: response.data.d,
  });
};

export const getTeleBotList = () => async (dispatch) => {
  const response = await API_TELEBOT.getBots();
  dispatch({
    type: GET_TELEBOT_LIST,
    payload: response.data.d,
  });
};

export const getFollowersData = () => async (dispatch) => {
  const response = await API_COPYTRADE.getExpertStatus();
  dispatch({
    type: GET_FOLLOWERS_DATA,
    payload: response.data,
  });
};

export const getMethodList = () => async (dispatch) => {
  const response = await API_BOT.getMethods();
  dispatch({
    type: GET_METHOD_LIST,
    payload: response.data.d,
  });
};

export const getBotTimerList = () => async (dispatch) => {
  const response = await API_BOT.getTimerList();
  dispatch({
    type: GET_BOT_TIMER_LIST,
    payload: response.data.d,
  });
};

export const getTeleBotTimerList = () => async (dispatch) => {
  const response = await API_TELEBOT.getTimerList();
  dispatch({
    type: GET_TELE_BOT_TIMER_LIST,
    payload: response.data.d,
  });
};
