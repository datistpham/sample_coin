// import axios from '../utils/axios';
import axios from '../utils/axios_web';

export const getBalance = async (linkAccountId) => {
  const response = await axios.get(`/api/wallet/balance/${linkAccountId}`);

  return response;
};

export const getAddress = async (linkAccountId) => {
  const response = await axios.get(`/api/wallet/address/${linkAccountId}`);

  return response;
};

export const postAddress = async (linkAccountId) => {
  const response = await axios.post(`/api/wallet/address/${linkAccountId}`);

  return response;
};

export const exchangeMoney = async (linkAccountId, data) => {
  const response = await axios.post(`/api/wallet/exchange-money/${linkAccountId}`, data);

  return response;
};

export const resetDemo = async (linkAccountId) => {
  const response = await axios.put(`/api/wallet/demo/${linkAccountId}`);

  return response;
};

export const withdraw = async (linkAccountId, data) => {
  const response = await axios.post(`/api/wallet/withdraw/${linkAccountId}`, data);

  return response;
};

export const transfer = async (linkAccountId, data) => {
  const response = await axios.post(`/api/wallet/transfer/${linkAccountId}`, data);

  return response;
};

export const transactions = async (linkAccountId, type, page) => {
  const response = await axios.get(`/api/wallet/transactions/${linkAccountId}?page=${page}&type=${type}`);

  return response;
};

export const spotTransactions = async (linkAccountId, page, total = 0) => {
  const response = await axios.get(`/api/wallet/spot-transactions/${linkAccountId}?page=${page}&total=${total}`);

  return response;
};

export const eventsRewardInfo = async (linkAccountId) => {
  const response = await axios.get(`/api/wallet/events/reward/info/${linkAccountId}`);

  return response;
};

export const eventsRewardHistory = async (linkAccountId, page = 1, total = 0) => {
  const response = await axios.get(`/api/wallet/events/reward/history/${linkAccountId}?page=${page}&total=${total}`);

  return response;
};

export const eventClaimAll = async (linkAccountId) => {
  const response = await axios.get(`/api/wallet/events/reward/claim/${linkAccountId}`);
  
  return response;
};
