import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${location.pathname === '/' ? styles.link_active : ''}`}
          >
            <>
              <BurgerIcon type={'primary'} />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} ${location.pathname.startsWith('/feed') ? styles.link_active : ''}`}
          >
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className={`${styles.link} ${location.pathname === '/login' || location.pathname === '/profile' ? styles.link_active : ''}`}
          >
            <ProfileIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
