import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { useAppSelector } from '../../store/store';

export const AppHeader: FC = () => {
  const { user } = useAppSelector((state) => state.user);

  return <AppHeaderUI userName={user?.name ?? ''} />;
};
