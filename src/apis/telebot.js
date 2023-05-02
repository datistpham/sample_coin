import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web';

export const getBots = async () => {
  const response = await axiosWeb.get('/api/telebot/list');
  return response;
};

export const getRentingBots = async () => {
  const response = await axiosWeb.get('/api/telebot/renting-list');
  return response;
};

export const deleteBot = async (_id) => {
  const response = await axios.delete(`/api/telebot/delete/${_id}`);
  return response;
};

export const actionBot = async (_id, actionType) => {
  const response = await axios.post(`/api/telebot/action/${_id}`, { actionType });
  return response;
};

export const updateBot = async (_id, data) => {
  delete data.teleData;
  delete data.lastData;
  const response = await axios.post(`/api/telebot/update/${_id}`, data);
  return response;
};

export const getBotHistory = async (id = '', page = 1) => {
  const response = await axiosWeb.get(
    id === '' ? `/api/telebot/history?page=${page}` : `/api/telebot/history/${id}?page=${page}`
  );
  return response;
};

export const deleteBotHistory = async (id = '') => {
  const response = await axiosWeb.delete(id === '' ? `/api/telebot/history` : `/api/telebot/history/${id}`);
  return response;
};

export const createBot = async (data) => {
  const response = await axiosWeb.post(`/api/telebot/create`, data);
  return response;
};

export const getBotInfo = async (_id) => {
  const response = await axiosWeb.get(`/api/telebot/info/${_id}`);
  return response;
};

export const getListRunning = async () => {
  const response = await axiosWeb.get(`/api/telebot/list-running`);
  return response;
};

export const getTimerList = async () => {
  const response = await axiosWeb.get(`/api/telebot/timer`);
  return response;
};

export const getTimerById = async (_id) => {
  const response = await axiosWeb.get(`/api/telebot/timer/${_id}`);
  return response;
};

export const addTimer = async (data) => {
  const response = await axiosWeb.post(`/api/telebot/timer/add`, data);
  return response;
};

export const updateTimer = async (_id, data) => {
  const response = await axiosWeb.post(`/api/telebot/timer/update/${_id}`, data);
  return response;
};

export const deleteTimerById = async (_id) => {
  const response = await axiosWeb.delete(`/api/telebot/timer/${_id}`);
  return response;
};

export const getTopList = async () => {
  const response = await axios.get('/api/telebot/get-top-list');
  return response;
};

export const getLogMixById = async (methodList, count) => {
  const response = await axiosWeb.post('/api/telebot/get-log-mix', {
    methodList,
    count,
  });
  return response;
};

export const grantTeleBot = async (data) => {
  const response = await axiosWeb.post('/api/telebot/grant-bot', data);
  return response;
};

export const renewTeleBot = async (data) => {
  const response = await axiosWeb.post('/api/telebot/renew-bot', data);
  return response;
};
