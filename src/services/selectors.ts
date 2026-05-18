import { RootState } from './store';

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;
export const selectConstructor = (state: RootState) => state.burgerConstructor;
export const selectFeed = (state: RootState) => state.feed;
export const selectUserOrders = (state: RootState) => state.orders.orders;
export const selectSelectedOrder = (state: RootState) =>
  state.orders.selectedOrder;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
