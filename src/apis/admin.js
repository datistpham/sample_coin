import axiosWeb from '../utils/axios_web';

export const checkUserByUsername = async (username) => {
  const response = await axiosWeb.get(`/api/admin/user/${username}`);
  
  return response;
};
