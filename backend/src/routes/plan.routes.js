import { Router } from 'express';
import planController from '../controllers/plan.controller.js';

const router = Router();

router.post('/', planController.generatePlan);

export default router;
