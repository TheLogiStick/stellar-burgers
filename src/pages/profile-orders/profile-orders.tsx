import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { getOrders } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.user.orders);

  useEffect(() => {
    if (!orders?.length) {
      dispatch(getOrders());
    }
  }, [dispatch, orders]);

  return <ProfileOrdersUI orders={orders ?? []} />;
};
