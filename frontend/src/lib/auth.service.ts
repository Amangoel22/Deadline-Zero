import api from './api';

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post('/auth/signup', data);
  return response.data.data;
};

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post('/auth/login', data);
  return response.data.data;
};