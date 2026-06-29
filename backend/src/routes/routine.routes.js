import express from 'express';
import routineController from '../controllers/routine.controller.js';

const router = express.Router();

router.get('/', routineController.getRoutine);
router.post('/', routineController.createOrUpdateRoutine);

export default router;