import { Router } from "express";
import achievementController from "../controllers/achievement.controller.js";

const router = Router();

router.get("/", achievementController.getAchievements);

export default router;