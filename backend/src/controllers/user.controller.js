import userService from '../services/user.service.js';

class UserController {
  async createUser(req, res) {
    try {
      const { name, email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const userData = {
        name,
        email
      };

      const user = await userService.createUser(userData);
      
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await userService.getUsers();
      
      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  async getStats(req, res) {
  try {
    const { userId } = req.query;

    const stats = await userService.getStats(userId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error retrieving user stats:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
}


export default new UserController();
