import taskService from '../services/task.service.js';

class TaskController {
  async createTask(req, res) {
    try {
      const {
  title,
  description,
  category,
  priority,
  deadline,
  estimatedDuration,
  status,
  userId,
} = req.body;
      
      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Title is required'
        });
      }

      const taskData = {
        title,
        description,
        category,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : null,
        status,
        userId
      };
      const task = await taskService.createTask(taskData);
      
      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getTasks(req, res) {
  try {
    const { priority, status, category, userId } = req.query;

    const filters = {
      userId,
      priority,
      status,
      category,
    };

    const tasks = await taskService.getTasks(filters);

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error retrieving tasks:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
const { userId } = req.query;

const task = await taskService.getTaskById(id, userId);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      console.error('Error retrieving task:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const {
  title,
  description,
  category,
  priority,
  deadline,
  estimatedDuration,
  status,
  userId,
} = req.body;
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (priority !== undefined) updateData.priority = priority;
      if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
      if (estimatedDuration !== undefined) updateData.estimatedDuration = parseInt(estimatedDuration);
      if (status !== undefined) updateData.status = status;

      const task = await taskService.updateTask(id, userId, updateData);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async deleteTask(req, res) {
    try {
      const { id } = req.params;
const { userId } = req.query;

const task = await taskService.deleteTask(id, userId);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: task
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

export default new TaskController();
