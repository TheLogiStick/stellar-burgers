import { LoginUI } from '@ui-pages';
import { FC, SyntheticEvent, useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { loginUser } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const { error, isAuthenticated } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(loginUser({ email, password }));
    },
    [dispatch, email, password]
  );

  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
