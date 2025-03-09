import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isLoading: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  bun: null,
  ingredients: [],
  status: 'idle',
  isLoading: false,
  orderModalData: null,
  error: null
};

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: {
      prepare: (ingredient) => ({
        payload: {
          ...ingredient,
          uniqueId: uuidv4()
        }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      }
    },
    removeIngredient: (state, action) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredient: (state, action) => {
      const { index, direction } = action.payload;
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex >= 0 && newIndex < state.ingredients.length) {
        [state.ingredients[index], state.ingredients[newIndex]] = [
          state.ingredients[newIndex],
          state.ingredients[index]
        ];
      }
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderModalData = action.payload;
        state.isLoading = false;
        state.ingredients = [];
        state.bun = null;
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = 'Failed to create order';
      });
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrderModalData
} = orderSlice.actions;
export default orderSlice.reducer;
