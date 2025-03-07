import { TIngredient } from '@utils-types';
import { forwardRef, useMemo } from 'react';
import { useAppSelector } from '../../store/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  /** TODO: взять переменную из стора */
  const { bun, ingredients: selectedIngredients } = useAppSelector(
    (state) => state.order
  );
  // const burgerConstructor = {
  //   bun: {
  //     _id: ''
  //   },
  //   ingredients: []
  // };

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    selectedIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [bun, selectedIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
