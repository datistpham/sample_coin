import jwtDecode from 'jwt-decode';

import axios from './axios';
import axiosWeb from './axios_web';

// ----------------------------------------------------------------------

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  // ----------------------------------------------------------------------

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

// ----------------------------------------------------------------------

const setSession = (accessToken, refreshToken = '') => {
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    axiosWeb.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken);
    handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
    delete axiosWeb.defaults.headers.common.Authorization;
  }
};

const handleTokenExpired = (timeExpired) => {
  const now = new Date().getTime();

  if (timeExpired * 1000 < now) {
    try {
      console.log('AccessToken expired !!');
      const refreshToken = localStorage.getItem('refreshToken');
      axios
        .post('/api/auth/refresh', {
          refreshToken,
        })
        .then((response) => {
          if (response.data.ok) {
            setSession(response.data.accessToken, response.data.refreshToken);

            return;
          }
          setSession('', '');
        });
    } catch (e) {
      console.log(e);
    }
  }
};

export { isValidToken, setSession };
