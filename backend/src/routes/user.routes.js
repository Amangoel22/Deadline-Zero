import { Router } from 'express';
import userController from '../controllers/user.controller.js';

const router = Router();

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/stats', userController.getStats);

export default router;