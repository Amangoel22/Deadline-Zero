import { Router } from 'express';
import missionController from '../controllers/mission.controller.js';

const router = Router();

router.post('/start', missionController.startMission);
router.get('/active', missionController.getActiveMission);
router.patch('/:id/complete', missionController.completeMission);
router.get("/history", missionController.getMissionHistory);

export default router;