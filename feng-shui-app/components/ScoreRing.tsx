interface Props {
  score: number;
}

export default function ScoreRing({ score }: Props) {
  const clampedScore = Math.max(0, Math.min(10, score));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clampedScore / 10) * circumference;

  const color =
    clampedScore >= 7
      ? "#10b981"
      : clampedScore >= 5
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
      <svg width="96" height="96" className="-rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-stone-800">{clampedScore}</span>
        <span className="text-xs text-stone-400">/10</span>
      </div>
    </div>
  );
}
