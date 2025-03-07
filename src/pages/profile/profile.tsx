import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { updateUserDetails } from '../../store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const initialFormState = {
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  };

  const [formValue, setFormValue] = useState(initialFormState);

  useEffect(() => {
    setFormValue(initialFormState);
  }, [user]);

  const isFormChanged =
    JSON.stringify({ name: formValue.name, email: formValue.email }) !==
      JSON.stringify({ name: user?.name || '', email: user?.email || '' }) ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    dispatch(updateUserDetails(formValue));
    if (formValue.password) {
      setFormValue((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue(initialFormState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
