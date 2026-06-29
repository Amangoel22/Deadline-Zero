import { GoogleGenAI } from "@google/genai";
import { calculateDecision } from "../utils/decisionEngine.js";
class PlanService {
  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateDailySchedule(tasks, routine) {
  const pendingTasks = tasks.filter(
    (task) => task.status !== "COMPLETED"
  );

  if (pendingTasks.length === 0) {
    return {
      schedule: [],
      missionTask: null,
      decision: null,
    };
  }

  // Rank every pending task using the Decision Engine
  const rankedTasks = pendingTasks
    .map((task) => ({
      task,
      decision: calculateDecision(task, routine),
    }))
    .sort((a, b) => b.decision.score - a.decision.score);

  const missionTask = rankedTasks[0].task;
  const decision = rankedTasks[0].decision;

  const prompt = `
You are an AI productivity planner.

Generate a realistic day schedule.

Rules:
- Respect the user's routine.
- Respect commitments.
- Place "${missionTask.title}" as the FIRST focus session.
- Return ONLY valid JSON array.

Routine:
${JSON.stringify(routine)}

Tasks:
${JSON.stringify(tasks)}
`;

  try {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const schedule = JSON.parse(response.text);

    return {
      schedule,
      missionTask,
      decision,
    };
  } catch (err) {
    console.error("Gemini unavailable:", err.message);

    const schedule = [
      {
        startTime: "09:00",
        endTime: "10:00",
        title: missionTask.title,
        type: "task",
        taskId: missionTask.id,
        notes: "Highest impact task selected by Decision Engine",
      },
    ];

    return {
      schedule,
      missionTask,
      decision,
    };
  }
}
}
export default new PlanService();