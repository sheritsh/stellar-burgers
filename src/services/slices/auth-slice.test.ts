import {
  authReducer,
  fetchUser,
  loginUser,
  logoutUser,
  requestPasswordReset,
  updateUser
} from './auth-slice';

describe('auth slice', () => {
  const user = { name: 'Олег', email: 'oleg@example.com' };

  it('marks auth as checked for a guest', () => {
    const state = authReducer(
      undefined,
      fetchUser.fulfilled(null, 'request-id', undefined)
    );

    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toBeNull();
  });

  it('stores the user after login and clears it after logout', () => {
    let state = authReducer(
      undefined,
      loginUser.fulfilled(user, 'request-id', {
        email: user.email,
        password: 'password'
      })
    );
    expect(state.user).toEqual(user);

    state = authReducer(
      state,
      logoutUser.fulfilled(undefined, 'request-id', undefined)
    );
    expect(state.user).toBeNull();
  });

  it('marks an authentication request as loading', () => {
    const state = authReducer(
      {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: 'Предыдущая ошибка'
      },
      loginUser.pending('request-id', {
        email: user.email,
        password: 'password'
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores an authentication error and stops loading', () => {
    const state = authReducer(
      undefined,
      loginUser.rejected(new Error('Неверный пароль'), 'request-id', {
        email: user.email,
        password: 'password'
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Неверный пароль');
  });

  it('uses a default authentication error when no message is provided', () => {
    const state = authReducer(undefined, {
      type: loginUser.rejected.type,
      error: {}
    });

    expect(state.error).toBe('Ошибка авторизации');
  });

  it('handles a failed user request', () => {
    const state = authReducer(
      { user, isAuthChecked: false, isLoading: false, error: null },
      fetchUser.rejected(new Error('Ошибка'), 'request-id')
    );

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('stops loading after a password reset request', () => {
    const state = authReducer(
      { user: null, isAuthChecked: true, isLoading: true, error: null },
      requestPasswordReset.fulfilled(
        { success: true },
        'request-id',
        user.email
      )
    );

    expect(state.isLoading).toBe(false);
  });

  it('stores the updated user', () => {
    const state = authReducer(
      undefined,
      updateUser.fulfilled(user, 'request-id', { name: user.name })
    );

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });
});
