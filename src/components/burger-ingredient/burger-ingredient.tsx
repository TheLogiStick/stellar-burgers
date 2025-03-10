import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { addIngredient, setBun } from '../../store/slices/orderSlice';
import { useAppDispatch } from '../../store/store';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const handleAdd = () =>
      dispatch(
        ingredient.type === 'bun'
          ? setBun(ingredient)
          : addIngredient(ingredient)
      );

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
