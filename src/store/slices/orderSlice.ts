import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  isLoading: boolean;
  orderModalData: any | null;
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
    addIngredient: (state, action) => {
      state.ingredients.push({
        ...action.payload,
        uniqueId: uuidv4()
      });
    },
    removeIngredient: (state, action) => {
      state.ingredients.splice(action.payload, 1);
    },
    openModalOrder: (state, action) => {
      state.orderModalData = action.payload;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
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
        state.isLoading = false;
        state.orderModalData = action.payload;
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
  openModalOrder,
  closeOrderModal,
  moveIngredient
} = orderSlice.actions;
export default orderSlice.reducer;
