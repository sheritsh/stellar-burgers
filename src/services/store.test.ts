import { rootReducer } from './store';

describe('root reducer', () => {
  it('returns the complete initial state for an unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      auth: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null
      },
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      orders: {
        orders: [],
        selectedOrder: null,
        isLoading: false,
        error: null
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        error: null
      }
    });
  });
});
