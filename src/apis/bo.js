// import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web';

export const getLastResults = async () => {
  const response = await axiosWeb.get('/api/bo/data/last_results');
  
  return response;
};
