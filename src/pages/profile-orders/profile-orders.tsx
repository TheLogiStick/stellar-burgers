import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { getOrders } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.user);
  // const orders: TOrder[] = [];
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders ?? []} />;
};
