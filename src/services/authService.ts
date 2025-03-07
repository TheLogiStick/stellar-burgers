import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { setCookie } from 'src/utils/cookie';

export const register = async (userData: TRegisterData) => {
  try {
    const response = await registerUserApi(userData);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    console.log(response);
    return response.user;
  } catch (error) {
    console.error('Ошибка при регистрации ', error);
    throw error;
  }
};

export const login = async (loginData: TLoginData) => {
  try {
    const response = await loginUserApi(loginData);

    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);

    return response.user;
  } catch (error) {
    console.error('Ошибка при авторизации ', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    setCookie('accessToken', '', { expires: -1 });
  } catch (error) {
    console.error('Ошибка при авторизации ', error);
    throw error;
  }
};

export const getUser = async () => {
  const response = await getUserApi();
  return response.user;
};

export const updateUser = async (userData: Partial<TRegisterData>) => {
  const response = await updateUserApi(userData);
  return response.user;
};

export const forgotPassword = async (email: string) => {
  await forgotPasswordApi({ email });
};

export const resetPassword = async (password: string, token: string) => {
  await resetPasswordApi({ password, token });
};
