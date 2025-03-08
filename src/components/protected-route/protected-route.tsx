import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const isLoggedIn = useAppSelector((state) => state.user.isAuthenticated);
  const isAuthChecked = useAppSelector((state) => state.user.isAuthChecked);

  const location = useLocation();
  const from = location.state?.from || '/';

  if (!isAuthChecked) return <Preloader />;

  if (onlyUnAuth && isLoggedIn) return <Navigate to={from} />;

  if (!onlyUnAuth && !isLoggedIn)
    return <Navigate to='/login' state={{ from: location }} />;

  return children;
};
