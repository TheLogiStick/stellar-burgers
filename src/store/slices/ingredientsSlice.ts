import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface ingredientsSliceState {
  ingredients: TIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isIngredientsLoading: boolean;
}

const initialState: ingredientsSliceState = {
  ingredients: [],
  status: 'idle',
  isIngredientsLoading: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
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
        state.isIngredientsLoading = false;
      });
  }
});

export default ingredientsSlice.reducer;
