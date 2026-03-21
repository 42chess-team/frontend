import Axios from "axios"
import type { AxiosError, AxiosRequestConfig } from "axios"

import { useAuthStore } from "@/features/auth/stores/auth-store"

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

// ATK를 헤더에 첨부
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 401 시 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await Axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true },
        )
        useAuthStore.getState().setAuth(data.accessToken, useAuthStore.getState().user!)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axiosInstance(originalRequest)
      } catch {
        useAuthStore.getState().clearAuth()
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)

export const api = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance({
    ...config,
    ...options,
  }).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
