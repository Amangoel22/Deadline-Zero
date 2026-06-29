import analyticsService from "../services/analytics.service.js";

class AnalyticsController {
  async getAnalytics(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const analytics = await analyticsService.getAnalytics(userId);

      return res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (err) {
      console.error("===== ANALYTICS ERROR =====");
      console.error(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default new AnalyticsController();