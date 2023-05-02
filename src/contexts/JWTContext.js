import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

// utils
import { isValidToken, setSession } from '../utils/jwt';
import { SYSTEM_ID } from '../config';
import { API_AUTH } from '../apis';
import axios from '../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: null,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider2.propTypes = {
  children: PropTypes.node,
};

function AuthProvider2({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (typeof window !== 'undefined') {

          const accessToken = window.localStorage.getItem('accessToken');

          if (accessToken && isValidToken(accessToken)) {
            setSession(accessToken);

            const response = await API_AUTH.getProfile();
            const { user } = response.data;

            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user,
              },
            });
          } else {
            console.log(1234)

            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    axios.interceptors.request.use(async (config) => {
      if (
        config.url.indexOf('/login') > -1 ||
        config.url.indexOf('/register') > -1 ||
        config.url.indexOf('/refresh') > -1
      ) {
        return config;
      }
      await handleTokenExpired();

      return config;
    });

    const handleTokenExpired = () =>
      new Promise((resolve, reject) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!isValidToken(accessToken)) {
          try {
            console.log('AccessToken expired !!');
            const refreshToken = localStorage.getItem('refreshToken');

            if (isValidToken(refreshToken)) {
              axios
                .post(`/api/auth/refresh`, {
                  refreshToken,
                })
                .then((response) => {
                  if (response.data.ok) {
                    setSession(response.data.accessToken, response.data.refreshToken);
                    resolve({ ok: true });

                    return;
                  }
                  setSession(null);
                  dispatch({ type: 'LOGOUT' });
                  resolve({ ok: false });
                });

              return;
            }
            setSession(null);
            dispatch({ type: 'LOGOUT' });
            resolve({ ok: false });
          } catch (e) {
            setSession(null);
            dispatch({ type: 'LOGOUT' });
            resolve({ ok: false });
            console.log(e);
          }
        }

        resolve({ ok: true });
      });

    initialize();

    return ()=> {}
  }, []);

  const login = async (username, password, code = '', captcha = '') => {
    const response = await API_AUTH.login({
      username,
      password,
      code,
      captcha,
      systemId: SYSTEM_ID,
    });
    if (response.data.ok && response.data.user) {
      const { accessToken, refreshToken, user } = response.data;
      setSession(accessToken, refreshToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    }

    return response.data;
  };

  const refresh = async (refreshToken) => {};

  const register = async (username, password, email, captcha) => {
    const response = await API_AUTH.register({
      username,
      password,
      email,
      captcha,
      systemId: SYSTEM_ID,
    });
    const { accessToken, refreshToken, user } = response.data;
    setSession(accessToken, refreshToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider2 };
