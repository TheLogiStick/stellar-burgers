import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface DataState {
  orders: TOrder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isFeedLoading: boolean;
  error: undefined | null | string;
  total: null | number;
  totalToday: null | number;
}

const initialState: DataState = {
  orders: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  isFeedLoading: false,
  error: null,
  total: null,
  totalToday: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const feed = await getFeedsApi();
  return feed;
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = 'loading';
        state.isFeedLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isFeedLoading = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isFeedLoading = false;
      });
  }
});

export default feedSlice.reducer;
