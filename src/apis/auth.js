// import axios from '../utils/axios';
import axiosWeb from '../utils/axios_web'

/// auth user
export const getProfile = async () => {
  const response = await axiosWeb.get('/api/auth/profile')

  return response
}

export const login = async data => {
  const response = await axiosWeb.post('/api/auth/login', data)

  return response
}

export const register = async data => {
  const response = await axiosWeb.post('/api/auth/register', data)

  return response
}

export const changePassword = async (currentPassword, newPassword) => {
  const response = await axiosWeb.post('/api/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword
  })

  return response
}

export const checkUsername = async username => {
  const response = await axiosWeb.get(`/api/auth/check-username/${username.toLowerCase()}`)

  return response
}

export const getRecoveryCodeForgotPass = async username => {
  const response = await axiosWeb.get(`/api/auth/forgot-pass/${username}`)

  return response
}

export const postResetPassword = async e => {
  const response = await axiosWeb.post(`/api/auth/forgot-pass`, e)

  return response
}

export const updateEmail = async e => {
  const response = await axiosWeb.post(`/api/auth/update-email`, e)

  return response
}

export const generateAndGetQrCode = async () => {
  const response = await axiosWeb.get('/api/auth/generate-secret-key')

  return response
}

export const active2FAMode = async (secretKey, code, password) => {
  const response = await axiosWeb.post('/api/auth/active-2fa', {
    secret_key: secretKey,
    code,
    password
  })

  return response
}

export const deactive2FAMode = async (code, password) => {

  const response = await axiosWeb.post('/api/auth/deactive-2fa', {
    code,
    password
  })

  return response
}
