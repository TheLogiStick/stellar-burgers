import { FC, memo } from 'react';

import styles from './constructor-page.module.css';

import { BurgerConstructor, BurgerIngredients } from '@components';
import { Preloader } from '@ui';
import { ConstructorPageUIProps } from './type';

export const ConstructorPageUI: FC<ConstructorPageUIProps> = memo(
  ({ isIngredientsLoading }) => {
    if (isIngredientsLoading) {
      return <Preloader />;
    }

    return (
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
    );
  }
);
