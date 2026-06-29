import authService from '../services/auth.service.js';

class AuthController {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      const user = await authService.signup({
        name,
        email,
        password
      });

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await authService.login({
        email,
        password
      });

      res.json({
        success: true,
        data: user
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default new AuthController();