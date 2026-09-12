import {
  clearSelectedOrder,
  fetchOrderByNumber,
  fetchOrders,
  ordersReducer
} from './orders-slice';
import { TOrder } from '@utils-types';

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2026-09-10T10:00:00.000Z',
  updatedAt: '2026-09-10T10:00:00.000Z',
  number: 42,
  ingredients: ['bun-1']
};

describe('orders slice', () => {
  it('sets loading state when user orders request starts', () => {
    const state = ordersReducer(undefined, fetchOrders.pending('request-id'));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user orders after a successful request', () => {
    const state = ordersReducer(
      undefined,
      fetchOrders.fulfilled([order], 'request-id')
    );

    expect(state.orders).toEqual([order]);
    expect(state.isLoading).toBe(false);
  });

  it('stores an error when user orders request fails', () => {
    const state = ordersReducer(
      undefined,
      fetchOrders.rejected(new Error('Заказы недоступны'), 'request-id')
    );

    expect(state.error).toBe('Заказы недоступны');
    expect(state.isLoading).toBe(false);
  });

  it('uses a default error for a failed user orders request', () => {
    const state = ordersReducer(undefined, {
      type: fetchOrders.rejected.type,
      error: {}
    });

    expect(state.error).toBe('Не удалось загрузить заказы');
  });

  it('sets loading state when an order details request starts', () => {
    const state = ordersReducer(
      undefined,
      fetchOrderByNumber.pending('request-id', 42)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores the selected order after a successful request', () => {
    const state = ordersReducer(
      undefined,
      fetchOrderByNumber.fulfilled(
        { success: true, orders: [order] },
        'request-id',
        42
      )
    );

    expect(state.selectedOrder).toEqual(order);
    expect(state.isLoading).toBe(false);
  });

  it('stores null when an order is not found', () => {
    const state = ordersReducer(
      undefined,
      fetchOrderByNumber.fulfilled(
        { success: true, orders: [] },
        'request-id',
        42
      )
    );

    expect(state.selectedOrder).toBeNull();
  });

  it('stores an error when order details request fails', () => {
    const state = ordersReducer(
      undefined,
      fetchOrderByNumber.rejected(
        new Error('Заказ недоступен'),
        'request-id',
        42
      )
    );

    expect(state.error).toBe('Заказ недоступен');
    expect(state.isLoading).toBe(false);
  });

  it('uses a default error for a failed order details request', () => {
    const state = ordersReducer(undefined, {
      type: fetchOrderByNumber.rejected.type,
      error: {}
    });

    expect(state.error).toBe('Не удалось загрузить заказ');
  });

  it('clears the selected order', () => {
    const state = ordersReducer(
      {
        orders: [order],
        selectedOrder: order,
        isLoading: false,
        error: null
      },
      clearSelectedOrder()
    );

    expect(state.selectedOrder).toBeNull();
  });
});
