import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { fetchFeed } from '../../store/slices/feedSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.feed);

  if (!orders?.length) return <Preloader />;

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
      }}
    />
  );
};
