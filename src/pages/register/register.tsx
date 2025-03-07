import { RegisterUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { registerUser } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      return;
    }

    dispatch(registerUser({ name: userName, email, password }));
  };

  if (isAuthenticated) return <Navigate to='/' />;

  return (
    <RegisterUI
      errorText={error || ''}
      userName={userName}
      email={email}
      password={password}
      setUserName={setUserName}
      setEmail={setEmail}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
