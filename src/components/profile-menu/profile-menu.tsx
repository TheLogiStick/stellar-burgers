import { ProfileMenuUI } from '@ui';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/slices/userSlice';
import { useAppDispatch } from '../../store/store';

export const ProfileMenu: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
