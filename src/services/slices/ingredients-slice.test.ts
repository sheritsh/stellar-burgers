import {
  fetchIngredients,
  ingredientsReducer
} from './ingredients-slice';
import { TIngredient } from '@utils-types';

const ingredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredients slice', () => {
  it('sets loading state when the request starts', () => {
    const state = ingredientsReducer(undefined, fetchIngredients.pending('id'));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores ingredients and stops loading after a successful request', () => {
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.fulfilled(ingredients, 'id')
    );

    expect(state.items).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
  });

  it('stores the error and stops loading after a failed request', () => {
    const error = new Error('Сервис недоступен');
    const state = ingredientsReducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.rejected(error, 'id')
    );

    expect(state.error).toBe(error.message);
    expect(state.isLoading).toBe(false);
  });
});
