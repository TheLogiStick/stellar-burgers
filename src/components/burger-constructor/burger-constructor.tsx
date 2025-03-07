import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFeed } from '../../store/slices/feedSlice';
import { closeOrderModal, fetchOrder } from '../../store/slices/orderSlice';
import { getOrders } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { bun, ingredients, orderRequest, orderModalData } = useAppSelector(
    (state) => state.order
  );
  const { isAuthenticated } = useAppSelector((state) => state.user);

  const onOrderClick = async () => {
    if (!bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    await dispatch(fetchOrder(ingredientIds));
    dispatch(getOrders());
    dispatch(fetchFeed());
  };

  const closeOrderModalHandler = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModalHandler}
    />
  );
};
