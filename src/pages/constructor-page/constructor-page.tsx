import styles from './constructor-page.module.css';

import { FC } from 'react';
import { BurgerConstructor, BurgerIngredients } from '../../components';
import { Preloader } from '../../components/ui';
import { useAppSelector } from '../../store/store';

export const ConstructorPage: FC = () => {
  /** TODO: взять переменную из стора */
  const { isIngredientsLoading } = useAppSelector((state) => state.data);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
