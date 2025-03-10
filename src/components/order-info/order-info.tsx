import { TIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const location = useLocation();

  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const feedOrders = useAppSelector((state) => state.feed.orders);
  const userOrders = useAppSelector((state) => state.user.orders);

  const isProfileOrder = location.pathname.includes('/profile');
  const orders = isProfileOrder ? userOrders : feedOrders;

  const orderData = useMemo(
    () => orders?.find((item) => item.number === Number(number)),
    [orders, number]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const ingredientsMap = new Map(ingredients.map((ing) => [ing._id, ing]));

    const ingredientsInfo = orderData.ingredients.reduce<
      Record<string, TIngredient & { count: number }>
    >((acc, id) => {
      const ingredient = ingredientsMap.get(id);
      if (ingredient) {
        acc[id] = acc[id]
          ? { ...acc[id], count: acc[id].count + 1 }
          : { ...ingredient, count: 1 };
      }
      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
