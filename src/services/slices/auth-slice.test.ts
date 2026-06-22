import { authReducer, fetchUser, loginUser, logoutUser } from './auth-slice';

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
});
