import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('cs_guest_token')
  if (token && config.headers) {
    config.headers.Authorization = token
  }
  return config
})

api.interceptors.response.use(
  (res) => res.data,
  (err: AxiosError) => {
    const msg = (err.response?.data as any)?.msg || err.message || '网络错误'
    return Promise.reject(msg)
  }
)

export interface ApiResult<T = any> {
  code: number
  msg: string
  data: T
}

export default api
