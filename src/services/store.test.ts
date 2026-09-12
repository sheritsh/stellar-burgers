import { rootReducer } from './store';
import {
  authReducer,
  constructorReducer,
  feedReducer,
  ingredientsReducer,
  orderReducer,
  ordersReducer
} from './slices';

describe('root reducer', () => {
  it('returns the complete initial state for an unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      auth: authReducer(undefined, unknownAction),
      ingredients: ingredientsReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      orders: ordersReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction)
    });
  });
});
