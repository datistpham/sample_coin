// import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web';

export const userWinningHistory = async (linkAccountId, page) => {
  const response = await axiosWeb.post('/api/jackpot/winning_history', {
    linkAccountId,
    page,
  });
  return response;
};

export const getCodeClaim2FA = async (linkAccountId) => {
  const response = await axiosWeb.get(`/api/jackpot/claim-2fa/${linkAccountId}`);
  return response;
};

export const claim = async (linkAccountId, data) => {
  const response = await axiosWeb.post(`/api/jackpot/claim/${linkAccountId}`, data);
  return response;
};
