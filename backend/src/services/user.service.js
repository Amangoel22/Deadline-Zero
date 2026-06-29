import prisma from '../config/prisma.js';

class UserService {
  async createUser(userData) {
    return await prisma.user.create({
      data: userData
    });
  }

  async getUsers() {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getStats(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      streak: true,
    },
  });

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
    xp,
    streak: user?.streak || 0,
    level,
    nextLevelXP,
  };
}
}

export default new UserService();
