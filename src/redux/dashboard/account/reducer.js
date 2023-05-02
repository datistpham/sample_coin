import {
  GET_EXCHANGE_ACCOUNT,
  GET_FOLLOWERS_DATA,
  GET_BOT_LIST,
  GET_TELEBOT_LIST,
  GET_METHOD_LIST,
  GET_EXCHANGES,
  GET_BOT_TIMER_LIST,
  GET_TELE_BOT_TIMER_LIST,
  USER_LOG_OUT,
  GET_LINKACCOUNT_SELECTED,
  stateData,
} from './action';

function reducer(state = stateData, action = 'none') {
  switch (action.type) {
    case GET_EXCHANGE_ACCOUNT:
      return {
        ...state,
        exchangeAccounts: action.payload,
        exchangeAccountsLogined: action.payload.filter((a) => a.isLogin === true),
      };
    case GET_FOLLOWERS_DATA:
      return { ...state, followersData: action.payload };
    case GET_BOT_LIST:
      return { ...state, botList: action.payload };
    case GET_TELEBOT_LIST:
      return { ...state, teleBotList: action.payload };
    case GET_METHOD_LIST:
      return { ...state, methodList: action.payload };
    case GET_EXCHANGES:
      return { ...state, exchanges: action.payload };
    case GET_BOT_TIMER_LIST:
      return { ...state, botTimerList: action.payload };
    case GET_TELE_BOT_TIMER_LIST:
      return { ...state, teleBotTimerList: action.payload };
    case GET_LINKACCOUNT_SELECTED:
      return { ...state, linkAccountSelected: action.payload };
    case USER_LOG_OUT:
      return {
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
      };
    default:
      return state;
  }
}

export default reducer;
