import axios, { AxiosError, AxiosResponse } from 'axios';
import appConfig from '../../config';
import { ApiResult } from './sharedModels';

const client = axios.create({
  baseURL: appConfig.api.baseUrl,
});

export const setAxiosTokenInterceptor = async (
  getAccessTokenSilently: any
): Promise<void> => {
  const accessToken = await getAccessTokenSilently();
  client.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      config.headers.common.delete('Authorization');
    }
    return config;
  });
};

export default client;
export interface DataAccessConfig {
  baseUrl: string;
}

const ofResponse = <T>(response: AxiosResponse<T>): ApiResult<T> => {
  if (response.status >= 200 && response.status < 300) {
    return {
      kind: 'ok',
      value: response.data,
    };
  } else {
    return {
      kind: 'error',
      error: {
        kind: 'api-response-error',
        status: response.status,
        statusText: response.statusText,
      },
    };
  }
};

const ofError = <T>(err: AxiosError): ApiResult<T> => {
  const response = err.response;
  if (response && response.status) {
    return {
      kind: 'error',
      error: {
        kind: 'api-response-error',
        status: response.status,
        statusText: response.statusText,
      },
    };
  } else {
    return {
      kind: 'error',
      error: { kind: 'api-network-error' },
    };
  }
};

export const get = async <T>(
  config: DataAccessConfig,
  path: string
): Promise<ApiResult<T>> => {
  const url = `${config.baseUrl}/${path}`;
  try {
    const response = await client.get<T>(url);
    return ofResponse(response);
  } catch (err) {
    console.log('***', err);
    console.error(err);
    return ofError(err as any);
  }
};

export const post = async <T>(
  config: DataAccessConfig,
  path: string,
  data: any
): Promise<ApiResult<T>> => {
  const url = `${config.baseUrl}/${path}`;
  try {
    const response = await client.post<T>(url, data);
    return ofResponse(response);
  } catch (err) {
    console.error(err);
    return ofError(err as any);
  }
};

export const remove = async <T>(
  config: DataAccessConfig,
  path: string
): Promise<ApiResult<T>> => {
  const url = `${config.baseUrl}/${path}`;
  try {
    const response = await client.delete<T>(url);
    return ofResponse(response);
  } catch (err) {
    console.error(err);
    return ofError(err as any);
  }
};

export const dataAccess = {
  get: <T>(path: string) => get<T>(appConfig.api, path),
  post: <T>(path: string, data: any) => post<T>(appConfig.api, path, data),
  remove: <T>(path: string) => remove<T>(appConfig.api, path),
};
