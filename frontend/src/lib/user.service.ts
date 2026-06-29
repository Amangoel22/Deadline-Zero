import api from "./api";

export const getUserStats = async () => {
  const { data } = await api.get("/users/stats", {
    params: {
      userId: localStorage.getItem("userId"),
    },
  });

  return data.data;
};