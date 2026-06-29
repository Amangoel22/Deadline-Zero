export function calculateFocusTime(routine: any) {
  if (!routine) return "--";

  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  const [sleepHour, sleepMinute] =
    routine.sleepTime.split(":").map(Number);

  const sleepMinutes =
    sleepHour * 60 + sleepMinute;

  let available = sleepMinutes - currentMinutes;

  if (available < 0)
    available += 24 * 60;

  if (routine.commitments) {
    for (const c of routine.commitments) {
      const [sH, sM] =
        c.startTime.split(":").map(Number);

      const [eH, eM] =
        c.endTime.split(":").map(Number);

      available -=
        eH * 60 +
        eM -
        (sH * 60 + sM);
    }
  }

  available = Math.max(0, available);

  const hours = Math.floor(available / 60);
  const mins = available % 60;

  return `${hours}h ${mins}m`;
}