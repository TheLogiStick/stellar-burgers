import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { fetchFeed } from '../../store/slices/feedSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.feed);
  // const orders: TOrder[] = [];

  if (!orders || !orders.length) return <Preloader />;

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
