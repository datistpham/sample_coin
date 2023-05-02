import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web';

/// auth user
export const getAccounts = async () => {
  const response = await axiosWeb.get('/api/exchange/account');

  return response;
};

export const getLinkAccount = async (_id) => {
  const response = await axiosWeb.get(`/api/exchange/account/${_id}`);

  return response;
};

export const getExchangeList = async () => {
  const response = await axiosWeb.get('/api/exchange/list');

  return response;
};

export const postLinkAccount = async (data) => {
  const response = await axiosWeb.post('/api/exchange/link-account', data);

  return response;
};

export const postLinkAccount2FA = async (data) => {
  const response = await axiosWeb.post('/api/exchange/link-account-2fa', data);

  return response;

};

export const deleteLinkAccount = async (id) => {
  const response = await axios.get(`/api/exchange/delete/${id}`);

  return response;
};

export const logOutLinkAccount = async (id) => {
  const response = await axios.get(`/api/exchange/logout/${id}`);

  return response;
};

export const getHistory = async (linkAccountId, month, year) => {
  const response = await axiosWeb.get(`/api/exchange/history/${linkAccountId}?month=${month}&year=${year}`);

  return response;
};

export const resetLinkAccount = async (linkAccountId, type, accType) => {
  const response = await axiosWeb.post(`/api/exchange/reset/${linkAccountId}`, {

    type,
    account_type: accType,
  });

  return response;
};

export const register = async (data) => {
  const response = await axiosWeb.post(`/api/exchange/register`, data);

  return response;
};

export const resendConfirmEmail = async (data) => {
  const response = await axiosWeb.post(`/api/exchange/resend-confirm-email`, data);

  return response;
};

export const postLinkAccountToken = async (data) => {
  const response = await axiosWeb.post('/api/exchange/link-account-token', data);

  return response;
};

export const updateTotalTarget = async (_id, data) => {
  const response = await axiosWeb.post(`/api/exchange/update-total-target/${_id}`, data);

  return response;
};

export const getStaticsLinkAccount = async (_id, from, to) => {
  const response = await axiosWeb.get(`/api/exchange/statics/${_id}?from=${from}&to=${to}`);

  return response;
};

export const updateHistoryByLinkAccount = async (
  username,
  linkAccountId,
  accountType,
  date,
  month,
  year,
  profit,
  volume
) => {
  const response = await axiosWeb.post(`/api/exchange/update-statics`, {
    username,
    linkAccountId,
    accountType,
    date,
    month,
    year,
    profit,
    volume,
  });
  
  return response;
};
