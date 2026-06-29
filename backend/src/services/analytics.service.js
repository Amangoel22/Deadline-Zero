import prisma from "../config/prisma.js";

class AnalyticsService {
  async getAnalytics(userId) {
    const [user, tasks, missions] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
      }),

      prisma.task.findMany({
        where: { userId },
      }),

      prisma.mission.findMany({
        where: { userId },
      }),
    ]);

    const completedTasks = tasks.filter(
      (task) => task.status === "COMPLETED"
    );

    const completedMissions = missions.filter(
      (mission) => mission.status === "COMPLETED"
    );

    const totalFocusMinutes = completedTasks.reduce(
      (sum, task) => sum + (task.estimatedDuration || 0),
      0
    );

    const categoryBreakdown = {};
    const priorityBreakdown = {};

    tasks.forEach((task) => {
      categoryBreakdown[task.category] =
        (categoryBreakdown[task.category] || 0) + 1;

      priorityBreakdown[task.priority] =
        (priorityBreakdown[task.priority] || 0) + 1;
    });

const today = new Date();

const todayCompleted = completedTasks.filter((task) => {
  const completedDate = new Date(task.updatedAt);

  return (
    completedDate.getDate() === today.getDate() &&
    completedDate.getMonth() === today.getMonth() &&
    completedDate.getFullYear() === today.getFullYear()
  );
}).length;

const todayGoal = 5;

const last30Days = [];

for (let i = 29; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);

  const completed = completedTasks.filter((task) => {
    const completedDate = new Date(task.updatedAt);

    return (
      completedDate.getDate() === date.getDate() &&
      completedDate.getMonth() === date.getMonth() &&
      completedDate.getFullYear() === date.getFullYear()
    );
  }).length;

  last30Days.push({
    date: date.toISOString(),
    count: completed,
  });
}

    const xp = user?.xp || 0;

    let level = 1;
    let nextLevelXP = 100;

    if (xp >= 100) {
      level = 2;
      nextLevelXP = 250;
    }

    if (xp >= 250) {
      level = 3;
      nextLevelXP = 500;
    }

    if (xp >= 500) {
      level = 4;
      nextLevelXP = 900;
    }

    if (xp >= 900) {
      level = 5;
      nextLevelXP = 1500;
    }

    if (xp >= 1500) {
      level = 6;
      nextLevelXP = 2500;
    }
    return {
      // User Stats
      xp: user?.xp || 0,
      streak: user?.streak || 0,

      // Task Stats
      totalTasks: tasks.length,

      completedTasks: completedTasks.length,

      pendingTasks: tasks.length - completedTasks.length,

      completionRate:
        tasks.length === 0
          ? 0
          : Math.round(
            (completedTasks.length / tasks.length) * 100
          ),
      todayCompleted,
      todayGoal,

      // Mission Stats
      totalMissions: missions.length,

      completedMissions: completedMissions.length,

      missionSuccessRate:
        missions.length === 0
          ? 0
          : Math.round(
            (completedMissions.length / missions.length) * 100
          ),

      // Productivity
      totalFocusHours:
        Math.round((totalFocusMinutes / 60) * 10) / 10,

      // Breakdowns
      categoryBreakdown,
      priorityBreakdown,


      xp,
      level,
      nextLevelXP,

      last30Days,
    };
  }
}

export default new AnalyticsService();