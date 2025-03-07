import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface DataState {
  ingredients: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isIngredientsLoading: boolean;
  error: undefined | null | string;
}

const initialState: DataState = {
  ingredients: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  isIngredientsLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'data/fetchIngredients',
  async (): Promise<TIngredient[]> => {
    const ingredients = await getIngredientsApi();
    return ingredients;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = 'loading';
        state.isIngredientsLoading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ingredients = action.payload;
        state.isIngredientsLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isIngredientsLoading = false;
      });
  }
});

export default dataSlice.reducer;
