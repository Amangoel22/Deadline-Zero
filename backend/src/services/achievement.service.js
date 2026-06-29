import prisma from "../config/prisma.js";

class AchievementService {
  async getAchievements(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const completedTasks = await prisma.task.count({
      where: {
        userId,
        status: "COMPLETED",
      },
    });

    return [
      {
        id: "first-task",
        title: "First Mission",
        icon: "🚀",
        unlocked: completedTasks >= 1,
      },
      {
        id: "ten-tasks",
        title: "Task Slayer",
        icon: "🏆",
        unlocked: completedTasks >= 10,
      },
      {
        id: "hundred-xp",
        title: "100 XP Club",
        icon: "⭐",
        unlocked: (user?.xp || 0) >= 100,
      },
      {
        id: "week-streak",
        title: "7 Day Streak",
        icon: "🔥",
        unlocked: (user?.streak || 0) >= 7,
      },
    ];
  }
}

export default new AchievementService();