import routineService from '../services/routine.service.js';

class RoutineController {
  async getRoutine(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      const routine = await routineService.getRoutine(userId);

      return res.status(200).json({
        success: true,
        message: 'Routine retrieved successfully',
        data: routine,
      });
    } catch (error) {
      console.error('ROUTINE ERROR:', error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async createOrUpdateRoutine(req, res) {
    try {
      const {
        userId,
        wakeTime,
        sleepTime,
        preferredWorkStart,
        preferredWorkEnd,
        timezone,
        commitments = [],
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
        });
      }

      if (!wakeTime || !sleepTime) {
        return res.status(400).json({
          success: false,
          message: 'Wake time and sleep time are required',
        });
      }

      const routineData = {
        wakeTime,
        sleepTime,
        preferredWorkStart,
        preferredWorkEnd,
        timezone: timezone || 'Asia/Kolkata',
        commitments,
      };

      const routine = await routineService.createOrUpdateRoutine(
        userId,
        routineData
      );

      return res.status(200).json({
        success: true,
        message: 'Routine saved successfully',
        data: routine,
      });
    } catch (error) {
      console.error('ROUTINE ERROR:', error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RoutineController();