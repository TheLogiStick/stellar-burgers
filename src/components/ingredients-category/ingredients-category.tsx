import { TIngredient } from '@utils-types';
import { forwardRef, useMemo } from 'react';
import { useAppSelector } from '../../store/store';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { TIngredientsCategoryProps } from './type';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: selectedIngredients } = useAppSelector(
    (state) => state.order
  );

  const ingredientsCounters = useMemo(() => {
    if (!selectedIngredients.length && !bun) return {};

    const counters: Record<string, number> = {};

    selectedIngredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] ??= 0;
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
