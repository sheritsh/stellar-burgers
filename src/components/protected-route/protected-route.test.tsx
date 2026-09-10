import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';

describe('ProtectedRoute', () => {
  it('renders nothing until authentication is checked', () => {
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute isAuthChecked={false} user={null}>
          <div>Profile</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

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

  it('renders a private page for an authenticated user', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute
          isAuthChecked
          user={{ name: 'Олег', email: 'oleg@example.com' }}
        >
          <div>Profile</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders a guest page for an unauthenticated user', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute onlyUnAuth isAuthChecked user={null}>
          <div>Login</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
