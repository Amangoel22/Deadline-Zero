import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import routineRoutes from './routes/routine.routes.js';
import planRoutes from './routes/plan.routes.js';
import missionRoutes from './routes/mission.routes.js';
import authRoutes from './routes/auth.routes.js';
import analyticsRoutes from "./routes/analytics.routes.js";
import achievementRoutes from "./routes/achievement.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Deadline Zero API Running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/missions', missionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/achievements", achievementRoutes);

export default app;
