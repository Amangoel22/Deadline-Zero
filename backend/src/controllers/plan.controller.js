import planService from '../services/plan.service.js';

class PlanController {
  async generatePlan(req, res) {
    try {
      const { tasks, routine } = req.body;
      
      if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({
          success: false,
          message: 'Tasks are required and must be an array'
        });
      }

      if (!routine) {
        return res.status(400).json({
          success: false,
          message: 'Routine is required'
        });
      }

      const plan = await planService.generateDailySchedule(tasks, routine);

return res.status(200).json({
  success: true,
  message: 'Plan generated successfully',
  data: plan,
});
    } catch (error) {
      console.error('Error generating plan:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while generating plan'
      });
    }
  }
}

export default new PlanController();
