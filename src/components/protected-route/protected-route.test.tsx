import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';

describe('ProtectedRoute', () => {
  it('redirects a guest from a private page to login', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path='/profile'
            element={
              <ProtectedRoute isAuthChecked user={null}>
                <div>Profile</div>
              </ProtectedRoute>
            }
          />
          <Route path='/login' element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('redirects an authenticated user from login to the app', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path='/login'
            element={
              <ProtectedRoute
                onlyUnAuth
                isAuthChecked
                user={{ name: 'Олег', email: 'oleg@example.com' }}
              >
                <div>Login</div>
              </ProtectedRoute>
            }
          />
          <Route path='/' element={<div>Constructor</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Constructor')).toBeInTheDocument();
  });
});
