import api from "./api";

export const getMissionHistory = async () => {
  const userId = localStorage.getItem("userId");

  const response = await api.get("/missions/history", {
    params: {
      userId,
    },
  });

  return response.data.data;
};