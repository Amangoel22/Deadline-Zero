import api from './api';

export const generatePlan = async (tasks: any[], routine: any) => {
  const response = await api.post('/plan', {
    tasks,
    routine,
  });

  return response.data.data;
};