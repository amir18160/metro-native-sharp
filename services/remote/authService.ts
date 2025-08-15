import apiClient from '~/api/apiClient';
import { ApiResult } from '~/types/common/ApiResult';
import { IAuthUserAccount } from '~/types/server/auth/IAuthUserAccount';

/*********** Login **************/
export interface LoginDTO {
  email: string;
  password: string;
}

export async function login(data: LoginDTO) {
  const url = 'account/login';
  const response = await apiClient.post<ApiResult<IAuthUserAccount>>(url, data);
  return response.data;
}

/*********** Register **************/
export interface RegisterDTO {
  name: string;
  username: string;
  email: string;
  password: string;
}

export async function register(data: RegisterDTO) {
  const url = 'account/register';
  const response = await apiClient.post<ApiResult<IAuthUserAccount>>(url, data);
  return response.data;
}
