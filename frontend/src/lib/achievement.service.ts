import api from "./api";

export const getAchievements = async () => {
  const userId = localStorage.getItem("userId");

  const response = await api.get("/achievements", {
    params: {
      userId,
    },
  });

  return response.data.data;
};