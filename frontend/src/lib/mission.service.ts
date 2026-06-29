import api from './api';

const getUserId = () => localStorage.getItem("userId");

export const startMission = async (taskId: string) => {
  const response = await api.post('/missions/start', {
    taskId,
    userId: getUserId(),
  });

  return response.data.data;
};

export const getActiveMission = async () => {
  const response = await api.get('/missions/active', {
    params: {
      userId: getUserId(),
    },
  });

  return response.data.data;
};

export const completeMission = async (id: string) => {
  const response = await api.patch(`/missions/${id}/complete`, {
    userId: getUserId(),
  });

  return response.data.data;
};