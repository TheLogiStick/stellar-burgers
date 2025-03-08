import { FC } from 'react';

import { TOrder } from '@utils-types';
import { useAppSelector } from '../../store/store';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .slice(0, 20)
    .map((order) => order.number);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useAppSelector((state) => state.feed);

  return (
    <FeedInfoUI
      readyOrders={getOrders(orders, 'done')}
      pendingOrders={getOrders(orders, 'pending')}
      feed={{ total, totalToday }}
    />
  );
};
