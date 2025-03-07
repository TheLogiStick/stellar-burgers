import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import dataReducer from './slices/dataSlice';
import feedReducer from './slices/feedSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  data: dataReducer,
  feed: feedReducer,
  user: userReducer,
  order: orderReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default store;
