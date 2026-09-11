import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  selectedOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetchUser', getOrdersApi);
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  getOrderByNumberApi
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload.orders[0] || null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказ';
      });
  }
});

export const { clearSelectedOrder } = ordersSlice.actions;
export const ordersReducer = ordersSlice.reducer;
