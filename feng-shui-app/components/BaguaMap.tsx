import { BaguaZone } from "@/types/analysis";

interface Props {
  zones: BaguaZone[];
  dominant: string;
}

const BAGUA_GRID = [
  { pos: "NW", label: "Helpful People", element: "Metal", color: "#94a3b8" },
  { pos: "N", label: "Career", element: "Water", color: "#3b82f6" },
  { pos: "NE", label: "Knowledge", element: "Earth", color: "#d97706" },
  { pos: "W", label: "Children", element: "Metal", color: "#94a3b8" },
  { pos: "Center", label: "Health", element: "Earth", color: "#fbbf24" },
  { pos: "E", label: "Family", element: "Wood", color: "#22c55e" },
  { pos: "SW", label: "Love", element: "Earth", color: "#ec4899" },
  { pos: "S", label: "Fame", element: "Fire", color: "#ef4444" },
  { pos: "SE", label: "Wealth", element: "Wood", color: "#16a34a" },
];

export default function BaguaMap({ zones, dominant }: Props) {
  const zoneMap = new Map(zones.map((z) => [z.direction, z]));

  return (
    <div className="bg-white/80 border border-stone-200/60 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-1">
        🧭 Bagua Map
      </h2>
      <p className="text-xs text-stone-400 mb-4">
        Dominant zone: <span className="text-amber-600 font-medium">{dominant}</span>
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {BAGUA_GRID.map((cell) => {
          const zone = zoneMap.get(cell.pos);
          const rating = zone?.energyRating;
          const borderColor =
            rating === "Strong"
              ? "border-emerald-400"
              : rating === "Weak"
                ? "border-red-300"
                : "border-stone-200";
          const isDominant = dominant
            .toLowerCase()
            .includes(cell.pos.toLowerCase()) || dominant.toLowerCase().includes(cell.label.toLowerCase());

          return (
            <div
              key={cell.pos}
              title={zone ? `${zone.currentState} · ${zone.energyRating}` : cell.label}
              className={`border-2 rounded-lg p-2 text-center transition-all ${borderColor}
                ${isDominant ? "ring-2 ring-amber-400 ring-offset-1" : ""}
                ${zone ? "bg-white" : "bg-stone-50/50"}`}
            >
              <div
                className="w-4 h-4 rounded-full mx-auto mb-1 opacity-80"
                style={{ backgroundColor: cell.color }}
              />
              <p className="text-[10px] font-bold text-stone-500">{cell.pos}</p>
              <p className="text-[9px] text-stone-400 leading-tight">{cell.label}</p>
              {rating && (
                <p
                  className={`text-[8px] font-semibold mt-0.5 ${
                    rating === "Strong"
                      ? "text-emerald-600"
                      : rating === "Weak"
                        ? "text-red-500"
                        : "text-amber-600"
                  }`}
                >
                  {rating}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-3 justify-center">
        {[
          { color: "bg-emerald-400", label: "Strong" },
          { color: "bg-amber-400", label: "Balanced" },
          { color: "bg-red-300", label: "Weak" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${l.color}`} />
            <span className="text-[10px] text-stone-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
