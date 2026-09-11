import {
  addIngredient,
  constructorReducer,
  moveIngredient,
  removeIngredient
} from './constructor-slice';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => {
  let id = 0;
  return { v4: () => `generated-id-${++id}` };
});

const ingredient = (overrides: Partial<TIngredient>): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Ингредиент',
  type: 'main',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: '',
  ...overrides
});

describe('constructor slice', () => {
  it('stores a bun separately and replaces the previous bun', () => {
    let state = constructorReducer(
      undefined,
      addIngredient(ingredient({ _id: 'bun-1', type: 'bun' }))
    );
    state = constructorReducer(
      state,
      addIngredient(ingredient({ _id: 'bun-2', type: 'bun' }))
    );

    expect(state.bun?._id).toBe('bun-2');
    expect(state.ingredients).toHaveLength(0);
  });

  it('adds, reorders and removes fillings', () => {
    let state = constructorReducer(
      undefined,
      addIngredient(ingredient({ _id: 'main-1' }))
    );
    state = constructorReducer(
      state,
      addIngredient(ingredient({ _id: 'main-2' }))
    );
    state = constructorReducer(state, moveIngredient({ from: 1, to: 0 }));

    expect(state.ingredients.map((item) => item._id)).toEqual([
      'main-2',
      'main-1'
    ]);

    state = constructorReducer(
      state,
      removeIngredient(state.ingredients[0].id)
    );
    expect(state.ingredients.map((item) => item._id)).toEqual(['main-1']);
  });
});
