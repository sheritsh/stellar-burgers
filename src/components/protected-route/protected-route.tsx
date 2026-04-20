import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { TUser } from '@utils-types';

type TProtectedRouteProps = {
  children: ReactElement;
  isAuthChecked: boolean;
  user: TUser | null;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  isAuthChecked,
  user,
  onlyUnAuth = false
}) => {
  const location = useLocation();

  if (!isAuthChecked) return null;

  if (onlyUnAuth && user) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate replace to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
