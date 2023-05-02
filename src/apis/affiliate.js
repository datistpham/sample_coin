import axiosWeb from '../utils/axios_web';

export const getOverview = async (id) => {
  const response = await axiosWeb.get(`/api/affiliate/overview/${id}`);

  return response;
};

export const calculateVolume = async (data) => {
  const response = await axiosWeb.post('/api/affiliate/calculate-volume', data);

  return response;
};

export const activeNickname = async (data) => {
  const response = await axiosWeb.post(`/api/affiliate/active/${data.linkAccountId}`, {
    nickName: data.nickName.trim(),
    activeType: data.activeType.trim(),
  });
  
  return response;
};
