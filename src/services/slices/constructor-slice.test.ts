import {
  addIngredient,
  clearConstructor,
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
  it('adds a bun to the constructor', () => {
    const state = constructorReducer(
      undefined,
      addIngredient(ingredient({ _id: 'bun-1', type: 'bun' }))
    );

    expect(state.bun?._id).toBe('bun-1');
    expect(state.ingredients).toHaveLength(0);
  });

  it('adds a filling to the constructor', () => {
    const state = constructorReducer(
      undefined,
      addIngredient(ingredient({ _id: 'main-1' }))
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject({
      _id: 'main-1',
      id: 'generated-id-2'
    });
  });

  it('removes a filling from the constructor', () => {
    const filledState = constructorReducer(
      undefined,
      addIngredient(ingredient({ _id: 'main-1' }))
    );
    const state = constructorReducer(
      filledState,
      removeIngredient(filledState.ingredients[0].id)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  it('changes the order of fillings', () => {
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
  });

  it('clears all constructor ingredients', () => {
    const filledState = constructorReducer(
      undefined,
      addIngredient(ingredient({ _id: 'bun-1', type: 'bun' }))
    );
    const state = constructorReducer(filledState, clearConstructor());

    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
