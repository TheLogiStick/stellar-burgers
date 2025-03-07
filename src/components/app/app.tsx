import { ReactNode, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

import { fetchFeed } from '../../store/slices/feedSlice';
import { fetchIngredients } from '../../store/slices/ingredientsSlice';
import { closeOrderModal } from '../../store/slices/orderSlice';
import { fetchUser } from '../../store/slices/userSlice';
import store, { useAppDispatch, useAppSelector } from '../../store/store';

// Инициализация данных при загрузке приложения
const useInitializeApp = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
    dispatch(fetchFeed());
  }, [dispatch]);
};

// Компонент для модального окна
interface ModalRouteProps {
  element: ReactNode;
  title: string;
  closePath: string;
}

const ModalWrapper = ({ element, title, closePath }: ModalRouteProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const number = useAppSelector((state) => state.order.orderModalData?.number);

  const handleClose = useCallback(() => {
    dispatch(closeOrderModal());
    navigate(closePath);
  }, [dispatch, navigate, closePath]);

  return (
    <Modal
      title={`${title}${number ? ` #${number}` : ''}`}
      onClose={handleClose}
    >
      {element}
    </Modal>
  );
};

const AppContent = () => {
  useInitializeApp();

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* 1. Страницы аутентификации */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* 2. Основные страницы */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* 3. Профиль и заказы */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* 4. Модальные окна */}
        <Route
          path='/ingredients/:id'
          element={
            <ModalWrapper
              element={<IngredientDetails />}
              title='Детали ингредиента'
              closePath='/'
            />
          }
        />
        <Route
          path='/feed/:number'
          element={
            <ModalWrapper
              element={<OrderInfo />}
              title='Заказ'
              closePath='/feed'
            />
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <ModalWrapper
                element={<OrderInfo />}
                title='Заказ'
                closePath='/profile/orders'
              />
            </ProtectedRoute>
          }
        />

        {/* 5. 404 Страница */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </Provider>
);

export default App;
