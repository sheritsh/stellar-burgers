import {
  fetchWithRefresh,
  forgotPasswordApi,
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  refreshToken,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from './burger-api';
import { deleteCookie, getCookie, setCookie } from './cookie';
import { TIngredient, TOrder } from './types';

const fetchMock = jest.fn<
  Promise<Response>,
  [RequestInfo | URL, RequestInit?]
>();
global.fetch = fetchMock as typeof fetch;

const response = (body: unknown, ok = true) =>
  ({
    ok,
    json: jest.fn().mockResolvedValue(body)
  }) as unknown as Response;

const ingredient: TIngredient = {
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
};

const order: TOrder = {
  _id: 'order-1',
  status: 'done',
  name: 'Тестовый бургер',
  createdAt: '2026-09-10T10:00:00.000Z',
  updatedAt: '2026-09-10T10:00:00.000Z',
  number: 42,
  ingredients: ['bun-1']
};

const user = { name: 'Олег', email: 'oleg@example.com' };
const authResponse = {
  success: true,
  accessToken: 'Bearer access-token',
  refreshToken: 'refresh-token',
  user
};

describe('burger API', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    localStorage.clear();
    deleteCookie('accessToken');
  });

  describe('response handling and token refresh', () => {
    it('returns a successful response without refreshing tokens', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: true }));

      await expect(fetchWithRefresh('/test', {})).resolves.toEqual({
        success: true
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('refreshes expired tokens and repeats the original request', async () => {
      localStorage.setItem('refreshToken', 'old-refresh-token');
      fetchMock
        .mockResolvedValueOnce(response({ message: 'jwt expired' }, false))
        .mockResolvedValueOnce(
          response({
            success: true,
            accessToken: 'Bearer new-access-token',
            refreshToken: 'new-refresh-token'
          })
        )
        .mockResolvedValueOnce(response({ success: true, value: 42 }));
      const options = {
        headers: { authorization: 'Bearer old-access-token' }
      };

      await expect(fetchWithRefresh('/private', options)).resolves.toEqual({
        success: true,
        value: 42
      });

      expect(options.headers.authorization).toBe('Bearer new-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
      expect(getCookie('accessToken')).toBe('Bearer new-access-token');
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it('passes through an error unrelated to token expiration', async () => {
      const error = { message: 'Сервис недоступен' };
      fetchMock.mockResolvedValueOnce(response(error, false));

      await expect(fetchWithRefresh('/private', {})).rejects.toEqual(error);
    });

    it('rejects an unsuccessful token refresh response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(refreshToken()).rejects.toEqual({ success: false });
    });
  });

  describe('ingredients and orders', () => {
    it('loads ingredients', async () => {
      fetchMock.mockResolvedValueOnce(
        response({ success: true, data: [ingredient] })
      );

      await expect(getIngredientsApi()).resolves.toEqual([ingredient]);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/ingredients')
      );
    });

    it('rejects an unsuccessful ingredients response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false, data: [] }));

      await expect(getIngredientsApi()).rejects.toEqual({
        success: false,
        data: []
      });
    });

    it('loads the public orders feed', async () => {
      const feed = {
        success: true,
        orders: [order],
        total: 10,
        totalToday: 2
      };
      fetchMock.mockResolvedValueOnce(response(feed));

      await expect(getFeedsApi()).resolves.toEqual(feed);
    });

    it('rejects an unsuccessful feed response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(getFeedsApi()).rejects.toEqual({ success: false });
    });

    it('loads authenticated user orders', async () => {
      setCookie('accessToken', 'Bearer access-token');
      fetchMock.mockResolvedValueOnce(
        response({ success: true, orders: [order] })
      );

      await expect(getOrdersApi()).resolves.toEqual([order]);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            authorization: 'Bearer access-token'
          })
        })
      );
    });

    it('rejects an unsuccessful user orders response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false, orders: [] }));

      await expect(getOrdersApi()).rejects.toEqual({
        success: false,
        orders: []
      });
    });

    it('creates an authenticated order', async () => {
      setCookie('accessToken', 'Bearer access-token');
      const createdOrder = {
        success: true,
        name: 'Тестовый бургер',
        order: { ...order, owner: user, price: 200 }
      };
      fetchMock.mockResolvedValueOnce(response(createdOrder));

      await expect(orderBurgerApi(['bun-1'])).resolves.toEqual(createdOrder);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ingredients: ['bun-1'] }),
          headers: expect.objectContaining({
            authorization: 'Bearer access-token'
          })
        })
      );
    });

    it('rejects an unsuccessful order creation response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(orderBurgerApi(['bun-1'])).rejects.toEqual({
        success: false
      });
    });

    it('loads an order by number', async () => {
      fetchMock.mockResolvedValueOnce(
        response({ success: true, orders: [order] })
      );

      await expect(getOrderByNumberApi(42)).resolves.toEqual({
        success: true,
        orders: [order]
      });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/orders/42'),
        expect.objectContaining({ method: 'GET' })
      );
    });
  });

  describe('authentication', () => {
    it('registers a user', async () => {
      const credentials = { ...user, password: 'password' };
      fetchMock.mockResolvedValueOnce(response(authResponse));

      await expect(registerUserApi(credentials)).resolves.toEqual(authResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({ body: JSON.stringify(credentials) })
      );
    });

    it('rejects an unsuccessful registration response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(
        registerUserApi({ ...user, password: 'password' })
      ).rejects.toEqual({ success: false });
    });

    it('logs a user in', async () => {
      const credentials = { email: user.email, password: 'password' };
      fetchMock.mockResolvedValueOnce(response(authResponse));

      await expect(loginUserApi(credentials)).resolves.toEqual(authResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({ body: JSON.stringify(credentials) })
      );
    });

    it('rejects an unsuccessful login response', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(
        loginUserApi({ email: user.email, password: 'password' })
      ).rejects.toEqual({ success: false });
    });

    it('requests a password reset', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: true }));

      await expect(forgotPasswordApi({ email: user.email })).resolves.toEqual({
        success: true
      });
    });

    it('rejects an unsuccessful password reset request', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(forgotPasswordApi({ email: user.email })).rejects.toEqual({
        success: false
      });
    });

    it('resets a password', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: true }));

      await expect(
        resetPasswordApi({ password: 'new-password', token: 'reset-token' })
      ).resolves.toEqual({ success: true });
    });

    it('rejects an unsuccessful password reset', async () => {
      fetchMock.mockResolvedValueOnce(response({ success: false }));

      await expect(
        resetPasswordApi({ password: 'new-password', token: 'reset-token' })
      ).rejects.toEqual({ success: false });
    });

    it('loads the current user', async () => {
      setCookie('accessToken', 'Bearer access-token');
      fetchMock.mockResolvedValueOnce(response({ success: true, user }));

      await expect(getUserApi()).resolves.toEqual({ success: true, user });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/user'),
        expect.objectContaining({
          headers: { authorization: 'Bearer access-token' }
        })
      );
    });

    it('updates the current user', async () => {
      setCookie('accessToken', 'Bearer access-token');
      fetchMock.mockResolvedValueOnce(response({ success: true, user }));

      await expect(updateUserApi({ name: user.name })).resolves.toEqual({
        success: true,
        user
      });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/user'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: user.name })
        })
      );
    });

    it('logs the current user out', async () => {
      localStorage.setItem('refreshToken', 'refresh-token');
      fetchMock.mockResolvedValueOnce(response({ success: true }));

      await expect(logoutApi()).resolves.toEqual({ success: true });
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: 'refresh-token' })
        })
      );
    });
  });
});
