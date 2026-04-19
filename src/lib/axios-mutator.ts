import type { AxiosError, AxiosRequestConfig } from "axios"

import { axiosInstance } from "@/lib/axios"

export const api = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  return axiosInstance({
    ...config,
    ...options,
  }).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
