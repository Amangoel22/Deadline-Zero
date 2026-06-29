import missionService from '../services/mission.service.js';

class MissionController {
  async startMission(req, res) {
    try {
      const { userId, taskId } = req.body;

      const mission = await missionService.startMission(
        userId,
        taskId
      );

      return res.status(201).json({
        success: true,
        data: mission
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message: 'Failed to start mission'
      });
    }
  }

  async getActiveMission(req, res) {
    try {
      const { userId } = req.query;

      const mission = await missionService.getActiveMission(userId);

      return res.json({
        success: true,
        data: mission
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false
      });
    }
  }
  async getMissionHistory(req, res) {
  try {
    const { userId } = req.query;

    const missions =
      await missionService.getMissionHistory(userId);

    res.json({
      success: true,
      data: missions,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
}

  async completeMission(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const mission = await missionService.completeMission(
        id,
        userId
      );

      return res.json({
        success: true,
        data: mission
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false
      });
    }
  }
}

export default new MissionController();