import api from "./api";

export const getAnalytics = async () => {
  const userId = localStorage.getItem("userId");

  const response = await api.get("/analytics", {
    params: {
      userId,
    },
  });

  return response.data.data;
};