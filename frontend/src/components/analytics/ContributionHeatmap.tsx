const weeks = Array.from({ length: 12 }, () =>
  Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * 5)
  )
);

const colors = [
  "bg-white/5",
  "bg-emerald-900",
  "bg-emerald-700",
  "bg-emerald-500",
  "bg-emerald-300",
];

export default function ContributionHeatmap() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
      <h3 className="font-semibold mb-4">
        Productivity Heatmap
      </h3>

      <div className="flex gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.map((value, j) => (
              <div
                key={j}
                className={`w-3 h-3 rounded-sm ${colors[value]}`}
              />
            ))}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Last 12 weeks of productivity
      </p>
    </div>
  );
}