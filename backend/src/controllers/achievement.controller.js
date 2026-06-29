import achievementService from "../services/achievement.service.js";

class AchievementController {
  async getAchievements(req, res) {
    try {
      const { userId } = req.query;

      const achievements =
        await achievementService.getAchievements(userId);

      res.json({
        success: true,
        data: achievements,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Failed to load achievements",
      });
    }
  }
}

export default new AchievementController();