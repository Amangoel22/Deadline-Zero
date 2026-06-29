export function calculateDecision(task: any, routine: any) {  let score = 50;

  // Priority
  switch ((task.priority || "").toLowerCase()) {
    case "critical":
      score += 30;
      break;
    case "high":
      score += 20;
      break;
    case "medium":
      score += 10;
      break;
    default:
      score += 5;
  }

  // Deadline
  if (task.deadline) {
    const hoursLeft =
      (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursLeft <= 6) score += 30;
    else if (hoursLeft <= 24) score += 20;
    else if (hoursLeft <= 48) score += 10;
  }

  // Estimated duration
let duration = 60;

if (task.duration) {
  duration = parseInt(task.duration);
} else if (task.estimatedDuration) {
  duration = Number(task.estimatedDuration);
}

if (duration <= 60) score += 10;
else if (duration <= 120) score += 5;

  // Cap
  score = Math.min(95, Math.max(5, score));

  return {
    successNow: score,
    afterCollege: Math.max(5, score - 20),
    tonight: Math.max(5, score - 40),
    tomorrow: Math.max(5, score - 70),

    reasoning: [
  `${task.priority || "Medium"} priority task.`,
  task.deadline
    ? `Deadline: ${new Date(task.deadline).toLocaleDateString()}.`
    : "No deadline set.",
  `Estimated duration: ${duration} minutes.`,
  "Starting now gives the highest chance of completing it on time."
]
  };
}