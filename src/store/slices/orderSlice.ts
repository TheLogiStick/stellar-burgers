import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  status: 'idle'
};

export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error) {
      return rejectWithValue(error);
    }
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
      state.ingredients.push(action.payload);
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
        state.orderRequest = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.ingredients = [];
        state.bun = null;
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.status = 'failed';
        state.orderRequest = false;
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
