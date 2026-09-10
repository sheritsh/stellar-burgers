import { closeOrderModal, createOrder, orderReducer } from './order-slice';

const orderResponse = {
  success: true,
  name: 'Тестовый бургер',
  order: {
    _id: 'order-1',
    status: 'done',
    name: 'Тестовый бургер',
    owner: {
      name: 'Олег',
      email: 'oleg@example.com',
      createdAt: '2026-09-10T10:00:00.000Z',
      updatedAt: '2026-09-10T10:00:00.000Z'
    },
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
    number: 42,
    price: 1000
  }
};

describe('order slice', () => {
  it('sets request state while an order is being created', () => {
    const state = orderReducer(
      {
        orderRequest: false,
        orderModalData: null,
        error: 'Предыдущая ошибка'
      },
      createOrder.pending('request-id', ['bun-1'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores the order number after a successful request', () => {
    const state = orderReducer(
      undefined,
      createOrder.fulfilled(orderResponse, 'request-id', ['bun-1'])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual({ number: 42 });
  });

  it('stores an error after a failed request', () => {
    const state = orderReducer(
      undefined,
      createOrder.rejected(new Error('Заказ не создан'), 'request-id', [
        'bun-1'
      ])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Заказ не создан');
  });

  it('closes the order modal and clears its error', () => {
    const state = orderReducer(
      {
        orderRequest: false,
        orderModalData: { number: 42 },
        error: 'Ошибка'
      },
      closeOrderModal()
    );

    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });
});
