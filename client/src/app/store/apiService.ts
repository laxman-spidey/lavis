import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import Axios, { AxiosError, AxiosRequestConfig } from "axios";
const HOST = "http://localhost:3002";
const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig<unknown>, unknown, AxiosError> =>
  async ({ url, method, data, params }) => {
    try {
      Axios.defaults.baseURL = HOST;
      const result = await Axios({
        url: url,
        method,
        data,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return {
        error,
      };
    }
  };

export const apiService = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  reducerPath: "apiService",
});

export default apiService;
