import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const { user, isAuthChecked } = useAppSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  if ((onlyUnAuth && user) || (!onlyUnAuth && !user)) {
    return <Navigate replace to={location.state?.from || '/'} />;
  }

  return children;
};
