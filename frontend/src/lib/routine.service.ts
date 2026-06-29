import api from './api';

export const getRoutine = async () => {
  const userId = localStorage.getItem('userId');

  const response = await api.get('/routine', {
    params: { userId },
  });

  return response.data.data;
};

export const saveRoutine = async (routine: any) => {
  const userId = localStorage.getItem('userId');

  const response = await api.post('/routine', {
    ...routine,
    userId,
  });

  return response.data.data;
};