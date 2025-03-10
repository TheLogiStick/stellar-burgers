import { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
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
import { fetchUser, getOrders } from '../../store/slices/userSlice';
import store, { useAppDispatch } from '../../store/store';

// Инициализация данных при загрузке приложения
const useInitializeApp = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);
};

const AppContent = () => {
  useInitializeApp();
  const location = useLocation();
  const background = location.state && location.state.background;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Запросы данных при переходе на страницу по вставному маршруту
  useEffect(() => {
    const path = location.pathname;
    if (!background) {
      if (path.startsWith('/feed/')) {
        dispatch(fetchFeed());
      } else if (path.startsWith('/profile/orders/')) {
        dispatch(getOrders());
      }
    }
  }, [background, dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
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
        {/* 4. Детальная информация */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        {/* 5. 404 Страница */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {background && (
        /* 6. Модальные окна */
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title='Детали ингредиента'
                onClose={() => {
                  navigate('/');
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Заказ'
                onClose={() => {
                  navigate('/feed');
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title='Заказ'
                  onClose={() => {
                    navigate('/profile/orders');
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
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
