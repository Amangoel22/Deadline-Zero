import prisma from '../config/prisma.js';

class RoutineService {
  async getRoutine(userId) {
    return await prisma.routine.findUnique({
      where: {
        userId
      },
      include: {
        commitments: true
      }
    });
  }

  async createOrUpdateRoutine(userId, routineData) {
const user = await prisma.user.findUnique({
  where: {
    id: userId,
  },
});

if (!user) {
  throw new Error("User not found");
}
    const {
      wakeTime,
      sleepTime,
      preferredWorkStart,
      preferredWorkEnd,
      timezone,
      commitments
    } = routineData;

    // Check if routine already exists
    let routine = await prisma.routine.findUnique({
      where: {
        userId
      }
    });

    if (routine) {
      // Update existing routine
      routine = await prisma.routine.update({
        where: {
          userId
        },
        data: {
          wakeTime,
          sleepTime,
          preferredWorkStart,
          preferredWorkEnd,
          timezone
        }
      });
    } else {
      // Create new routine
      routine = await prisma.routine.create({
        data: {
          userId,
          wakeTime,
          sleepTime,
          preferredWorkStart,
          preferredWorkEnd,
          timezone
        }
      });
    }

    // Delete old commitments
    await prisma.commitment.deleteMany({
      where: {
        routineId: routine.id
      }
    });

    // Insert new commitments
    if (commitments && commitments.length > 0) {
      await prisma.commitment.createMany({
        data: commitments.map(commitment => ({
          routineId: routine.id,
          title: commitment.title,
          startTime: commitment.startTime,
          endTime: commitment.endTime,
          daysOfWeek: commitment.daysOfWeek
        }))
      });
    }

    // Return updated routine with commitments
    return await prisma.routine.findUnique({
      where: {
        userId
      },
      include: {
        commitments: true
      }
    });
  }

  async deleteRoutine(userId) {
    return await prisma.routine.delete({
      where: {
        userId
      }
    });
  }
}

export default new RoutineService();