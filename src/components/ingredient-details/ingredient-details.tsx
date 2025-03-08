import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Preloader } from '../ui/preloader';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredientData = useAppSelector((state) =>
    state.ingredients.ingredients.find((item) => item._id === id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
