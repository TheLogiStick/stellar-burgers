import { BurgerConstructorElementUI } from '@ui';
import { FC, memo } from 'react';
import {
  moveIngredient,
  removeIngredient
} from '../../store/slices/orderSlice';
import { useAppDispatch } from '../../store/store';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveUp = () =>
      dispatch(moveIngredient({ index, direction: 'up' }));
    const handleMoveDown = () =>
      dispatch(moveIngredient({ index, direction: 'down' }));
    const handleClose = () => dispatch(removeIngredient(index));

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
