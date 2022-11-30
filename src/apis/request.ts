/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
import { message } from 'antd'
import axios from 'axios'
import { t } from 'i18next'
import { RefreshTokenResponse } from '@models'
import {
  clearTokens,
  getOrgId,
  getTokens,
  getTokensInSessionStorage,
  setTokens,
  setTokensInSessionStorage,
} from '@utils/storage'
// eslint-disable-next-line import/no-cycle
import Hooks from '../ExternalHooks'

const BASE_URL = process.env.REACT_APP_API_URL

let refreshing = false

// -----------------------------
// Utils
const refreshAccessToken = async (): Promise<string | undefined> => {
  const { refreshToken } = getTokens()
  try {
    refreshing = true
    if (!refreshToken) return

    const { data } = await axios
      .create({ baseURL: BASE_URL })
      .post<RefreshTokenResponse>('/refresh-token', { refreshToken })
    // @ts-ignore
    if (!data || !data.accessToken) return
    setTokens(data)
    return data.accessToken
  } catch (err) {
    return undefined
  } finally {
    refreshing = false
  }
}

const refreshAccessTokenInSesssionStorage = async (): Promise<
  string | undefined
> => {
  const { refreshToken } = getTokensInSessionStorage()
  try {
    refreshing = true
    if (!refreshToken) return

    const { data } = await axios
      .create({ baseURL: BASE_URL })
      .post<RefreshTokenResponse>('/refresh-token', {
        refreshToken,
      })
    // @ts-ignore
    if (!data || !data.accessToken) return
    setTokensInSessionStorage(data)
    return data.accessToken
  } catch (err) {
    return undefined
  } finally {
    refreshing = false
  }
}

// -----------------------------
// Common request
const request = axios.create({
  baseURL: BASE_URL,
})
// --------- check co access token o local va session khong ----------
request.interceptors.request.use(
  async config => {
    const { accessToken } = getTokens()
    const accessTokenInSessionStorage = getTokensInSessionStorage().accessToken
    const orgId = getOrgId()
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      }
      config.params = {
        ...config.params,
        orgId,
      }
    }
    if (accessTokenInSessionStorage) {
      config.headers = {
        Authorization: `Bearer ${accessTokenInSessionStorage}`,
      }
      config.params = {
        ...config.params,
        orgId,
      }
    }
    return config
  },
  error => Promise.reject(error)
)

request.interceptors.response.use(
  res => res,
  async error => {
    // alert('dont have access token')
    const originalRequest = error.config
    if (
      !refreshing &&
      [401, 403].includes(error?.response?.status) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      const accessTokenInSessionStorage =
        await refreshAccessTokenInSesssionStorage() // khi khong co acessToken tai Session Storage
      const accessToken = await refreshAccessToken() // khi khong co accessToken tai Local Storage

      // ------------ Case khong co token va local in storage ----------------------
      if (!accessToken && !accessTokenInSessionStorage) {
        clearTokens()
        // localStorage.removeItem('authStore')
        message.info({
          content: t('auth.error.expiredToken'),
        })
        Hooks.authStore?.logout()
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        Hooks.navigate && Hooks.navigate('/auth/login')
        throw error
      }
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      Hooks.navigate && Hooks.navigate(0)
    }

    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    if (response.data.success) return response.data.data
    return Promise.reject(response.data)
  },
  error => {
    return Promise.reject(new Error(error.response.data.message))
  }
)

export default request

// -----------------------------
// Auth request
const authRequest = axios.create({
  baseURL: BASE_URL,
})

authRequest.interceptors.request.use(
  async config => {
    const { accessToken } = getTokens()
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      }
    }
    return config
  },
  error => Promise.reject(error)
)

authRequest.interceptors.response.use(
  response => {
    if (
      Object.keys(response.data).includes('success') &&
      !response.data.success
    ) {
      return Promise.reject(response.data)
    }
    return response.data
  },
  error => Promise.reject(error)
)

export { authRequest }
