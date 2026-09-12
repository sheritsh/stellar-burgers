import { fetchFeed, feedReducer } from './feed-slice';
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

describe('feed slice', () => {
  it('sets loading state when the request starts', () => {
    const state = feedReducer(
      {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: 'Предыдущая ошибка'
      },
      fetchFeed.pending('request-id')
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores feed data after a successful request', () => {
    const state = feedReducer(
      undefined,
      fetchFeed.fulfilled(
        { success: true, orders: [order], total: 10, totalToday: 2 },
        'request-id'
      )
    );

    expect(state.orders).toEqual([order]);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
    expect(state.isLoading).toBe(false);
  });

  it('stores an error after a failed request', () => {
    const state = feedReducer(
      undefined,
      fetchFeed.rejected(new Error('Лента недоступна'), 'request-id')
    );

    expect(state.error).toBe('Лента недоступна');
    expect(state.isLoading).toBe(false);
  });

  it('uses a default error when the request has no message', () => {
    const state = feedReducer(undefined, {
      type: fetchFeed.rejected.type,
      error: {}
    });

    expect(state.error).toBe('Не удалось загрузить ленту');
  });
});
