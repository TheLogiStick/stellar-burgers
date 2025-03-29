import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { setCookie } from '../../utils/cookie';

export interface UserState {
  user: TUser | null;
  orders: TOrder[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isLoading: boolean;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  orders: null,
  status: 'idle',
  isLoading: false,
  isAuthChecked: false,
  isAuthenticated: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => {
    const { refreshToken, accessToken, user } = await registerUserApi(userData);
    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);
    return user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const { refreshToken, accessToken, user } = await loginUserApi(loginData);
    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);
    return user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 });
});

export const fetchUser = createAsyncThunk('user/fetch', getUserApi);

export const updateUserDetails = createAsyncThunk(
  'user/update',
  (userData: Partial<TRegisterData>) => updateUserApi(userData)
);

export const getOrders = createAsyncThunk('user/getOrders', getOrdersApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message || null;
        state.isAuthChecked = true;
      })

      // Авторизация
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message || null;
        state.isAuthChecked = true;
      })

      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message || null;
        state.isAuthChecked = true;
      })

      // Получение пользователя
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message || null;
        state.isAuthChecked = true;
      })

      // Обновление пользователя
      .addCase(updateUserDetails.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message || null;
      })

      // Получение заказов пользователя
      .addCase(getOrders.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.error.message || null;
      });
  }
});

export default userSlice.reducer;
