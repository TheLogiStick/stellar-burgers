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

    const handleMove = (direction: 'up' | 'down') => {
      dispatch(moveIngredient({ index, direction }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={() => handleMove('up')}
        handleMoveDown={() => handleMove('down')}
        handleClose={handleClose}
      />
    );
  }
);
