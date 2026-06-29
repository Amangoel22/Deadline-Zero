export function calculateDecision(task, routine) {
  let score = 0;
  const reasoning = [];

  // -------------------------
  // Priority
  // -------------------------
  const priority = (task.priority || "").toLowerCase();

  switch (priority) {
    case "critical":
      score += 40;
      reasoning.push("Critical priority task.");
      break;

    case "high":
      score += 30;
      reasoning.push("High priority task.");
      break;

    case "medium":
      score += 20;
      reasoning.push("Medium priority.");
      break;

    default:
      score += 10;
      reasoning.push("Low priority.");
  }

  // -------------------------
  // Deadline Urgency
  // -------------------------
  if (task.deadline) {
    const hoursLeft =
      (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursLeft <= 3) {
      score += 40;
      reasoning.push("Deadline within 3 hours.");
    } else if (hoursLeft <= 12) {
      score += 30;
      reasoning.push("Deadline today.");
    } else if (hoursLeft <= 24) {
      score += 20;
      reasoning.push("Deadline within 24 hours.");
    } else if (hoursLeft <= 72) {
      score += 10;
      reasoning.push("Upcoming deadline.");
    }
  }

  // -------------------------
  // Duration
  // -------------------------
  const duration = Number(task.estimatedDuration || 60);

  if (duration <= 45) {
    score += 15;
    reasoning.push("Quick win.");
  } else if (duration <= 90) {
    score += 10;
    reasoning.push("Fits a focus session.");
  } else {
    score += 5;
    reasoning.push("Long task requiring multiple sessions.");
  }

  // -------------------------
  // Routine Match
  // -------------------------
  if (routine?.preferredWorkStart && routine?.preferredWorkEnd) {
    reasoning.push("Matches your daily routine.");
    score += 10;
  }

  // -------------------------
  // Clamp Score
  // -------------------------
  score = Math.max(5, Math.min(95, score));

  return {
    score,

    successNow: score,

    afterCollege: Math.max(
      5,
      score - (duration > 90 ? 15 : 10)
    ),

    tonight: Math.max(
      5,
      score - 25
    ),

    tomorrow: Math.max(
      5,
      score - 45
    ),

    reasoning,
  };
}