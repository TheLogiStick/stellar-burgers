import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface FeedState {
  orders: TOrder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isLoading: boolean;
  error: string | null;
  total: number | null;
  totalToday: number | null;
}

const initialState: FeedState = {
  orders: [],
  status: 'idle',
  isLoading: false,
  error: null,
  total: null,
  totalToday: null
};

export const fetchFeed = createAsyncThunk('feed/fetchFeed', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;
