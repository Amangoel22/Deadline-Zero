import prisma from '../config/prisma.js';

class MissionService {
  async startMission(userId, taskId) {
    return prisma.mission.create({
      data: {
        userId,
        taskId,
        status: 'ACTIVE'
      },
      include: {
        task: true
      }
    });
  }

  async getActiveMission(userId) {
    return prisma.mission.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      include: {
        task: true
      }
    });
  }

  async getMissionHistory(userId) {
  return await prisma.mission.findMany({
    where: {
      userId,
      status: "COMPLETED",
    },
    include: {
      task: true,
    },
    orderBy: {
      endedAt: "desc",
    },
    take: 5,
  });
}

async completeMission(id) {
  const mission = await prisma.mission.update({
    where: { id },
    data: {
      status: "COMPLETED",
      endedAt: new Date(),
    },
    include: {
      task: true,
    },
  });

  await prisma.task.update({
    where: {
      id: mission.taskId,
    },
    data: {
      status: "COMPLETED",
    },
  });

  const xpEarned =
    mission.task.priority === "CRITICAL"
      ? 100
      : mission.task.priority === "HIGH"
      ? 70
      : mission.task.priority === "MEDIUM"
      ? 50
      : 30;

  await prisma.user.update({
    where: {
      id: mission.userId,
    },
    data: {
      xp: {
        increment: xpEarned,
      },
    },
  });

  return mission;
}}

export default new MissionService();