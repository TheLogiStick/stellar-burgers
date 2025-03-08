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

interface UserState {
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
    const response = await registerUserApi(userData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 });
});

export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUserDetails = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const getOrders = createAsyncThunk('user/getOrders', async () => {
  const orders = await getOrdersApi();
  return orders;
});

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
        state.error = (action.payload as string) || 'Registration failed';
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
        state.error = (action.payload as string) || 'Login failed';
        state.isAuthChecked = true;
      })

      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Получение пользователя
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthChecked = true;
      })

      // Обновление пользователя
      .addCase(updateUserDetails.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Получение заказов пользователя
      .addCase(getOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.error = null;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export default userSlice.reducer;
