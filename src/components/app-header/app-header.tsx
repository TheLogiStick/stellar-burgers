import { AppHeaderUI } from '@ui';
import { memo } from 'react';
import { useAppSelector } from '../../store/store';

export const AppHeader = memo(() => {
  const user = useAppSelector((state) => state.user.user);

  return <AppHeaderUI userName={user?.name ?? ''} />;
});
