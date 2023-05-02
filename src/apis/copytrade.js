import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web';

export const getExpertStatus = async () => {
  const response = await axiosWeb.get('/api/copytrade/expert/status');

  return response;
};

export const getListConfiguration = async (linkAccountId) => {
  const response = await axiosWeb.get(`/api/copytrade/list/${linkAccountId}`);

  return response;
};

export const getSetting = async (id) => {
  const response = await axiosWeb.get(`/api/copytrade/setting/${id}`);

  return response;

};

export const updateSetting = async (isEdit, data) => {
  const response = await axiosWeb.post(isEdit ? '/api/copytrade/update-setting' : '/api/copytrade/add-setting', data);

  return response;
};

export const getList = async () => {
  const response = await axiosWeb.get('/api/copytrade/list');

  return response;
};

export const updateStatus = async (_id, isActive) => {
  const response = await axiosWeb.post('/api/copytrade/update-status', {
    _id,
    isActive,
  });

  return response;
};

export const deleteSetting = async (_id) => {
  const response = await axiosWeb.get(`/api/copytrade/delete-setting/${_id}`);

  return response;
};

export const expertTrade = async (data) => {
  const response = await axiosWeb.post('/api/copytrade/expert/trade', data);

  return response;
};

export const personalTrade = async (data) => {
  const response = await axiosWeb.post('/api/copytrade/personal/trade', data);

  return response;
};

export const getHistory = async (type, page = 1) => {
  const response = await axiosWeb.post(`/api/copytrade/history?page=${page}`, {
    type,
  });

  return response;
};

export const deleteHistory = async (type) => {
  const response = await axiosWeb.get(`/api/copytrade/history/delete/${type}`);

  return response;
};

export const getBlockList = async (_id) => {
  const response = await axiosWeb.get(`/api/copytrade/block/${_id}`);

  return response;
};

export const getUnblockList = async (_id) => {
  const response = await axiosWeb.get(`/api/copytrade/unblock/${_id}`);
  
  return response;
};
