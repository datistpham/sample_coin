import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web';

export const getBots = async () => {
  const response = await axiosWeb.get('/api/bot/list');

  return response;
};

export const deleteBot = async (_id) => {
  const response = await axios.delete(`/api/bot/delete/${_id}`);

  return response;
};

export const actionBot = async (_id, actionType) => {
  const response = await axios.post(`/api/bot/action/${_id}`, { actionType });

  return response;
};

export const updateBot = async (_id, data) => {
  const response = await axios.post(`/api/bot/update/${_id}`, data);

  return response;
};

export const getBotHistory = async (id = '', page = 1) => {
  const response = await axiosWeb.get(
    id === '' ? `/api/bot/history?page=${page}` : `/api/bot/history/${id}?page=${page}`
  );

  return response;
};

export const deleteBotHistory = async (id = '') => {
  const response = await axios.delete(id === '' ? `/api/bot/history` : `/api/bot/history/${id}`);

  return response;
};

export const createBot = async (data) => {
  const response = await axiosWeb.post(`/api/bot/create`, data);

  return response;
};

export const getBotInfo = async (_id) => {
  const response = await axiosWeb.get(`/api/bot/info/${_id}`);

  return response;
};

export const createMethod = async (data) => {
  const response = await axiosWeb.post(`/api/bot/method/create`, data);

  return response;
};

export const updateMethod = async (id, data) => {
  const response = await axios.post(`/api/bot/method/update/${id}`, data);

  return response;
};

export const getMethods = async () => {
  const response = await axiosWeb.get(`/api/bot/method/list`);

  return response;
};

export const getMethodsByType = async (type) => {
  const response = await axiosWeb.get(`/api/bot/method/type/${type}`);

  return response;
};

export const getMethodById = async (id) => {
  const response = await axiosWeb.get(`/api/bot/method/info/${id}`);

  return response;
};

export const deleteMethodById = async (id) => {
  const response = await axios.delete(`/api/bot/method/${id}`);

  return response;

};

export const getTimerList = async () => {
  const response = await axiosWeb.get(`/api/bot/timer`);

  return response;
};

export const getTimerById = async (_id) => {
  const response = await axiosWeb.get(`/api/bot/timer/${_id}`);

  return response;
};

export const addTimer = async (data) => {
  const response = await axiosWeb.post(`/api/bot/timer/add`, data);

  return response;
};

export const updateTimer = async (_id, data) => {
  const response = await axiosWeb.post(`/api/bot/timer/update/${_id}`, data);

  return response;
};

export const deleteTimerById = async (_id) => {
  const response = await axiosWeb.delete(`/api/bot/timer/${_id}`);

  return response;
};

export const sendMethod = async (methodId, username) => {
  const response = await axiosWeb.post(`/api/bot/method/send/${methodId}`, { username });

  return response;
};

export const sendBot = async (botId, username) => {
  const response = await axiosWeb.post(`/api/bot/send/${botId}`, { username });

  return response;
};

export const activeTelegram = async (linkAccountId, secretCode) => {
  const response = await axiosWeb.post(`/api/bot/active-telegram`, { linkAccountId, secretCode });
  
  return response;
};
