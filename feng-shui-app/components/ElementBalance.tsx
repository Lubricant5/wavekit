import { ElementBalance as ElementBalanceType } from "@/types/analysis";

interface Props {
  balance: ElementBalanceType;
}

const ELEMENTS = [
  { key: "wood", label: "Wood", emoji: "🌿", color: "#16a34a", bg: "bg-green-50" },
  { key: "fire", label: "Fire", emoji: "🔥", color: "#ef4444", bg: "bg-red-50" },
  { key: "earth", label: "Earth", emoji: "🏔️", color: "#d97706", bg: "bg-amber-50" },
  { key: "metal", label: "Metal", emoji: "⚙️", color: "#94a3b8", bg: "bg-slate-50" },
  { key: "water", label: "Water", emoji: "💧", color: "#3b82f6", bg: "bg-blue-50" },
] as const;

export default function ElementBalance({ balance }: Props) {
  return (
    <div className="bg-white/80 border border-stone-200/60 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-4">
        ☯️ Five Elements Balance
      </h2>
      <div className="space-y-3">
        {ELEMENTS.map((el) => {
          const status = balance[el.key];
          const barWidth =
            status === "Balanced" ? "w-3/5" : status === "Excess" ? "w-full" : "w-1/5";
          const statusColor =
            status === "Balanced"
              ? "text-emerald-600 bg-emerald-50"
              : status === "Excess"
                ? "text-red-600 bg-red-50"
                : "text-amber-600 bg-amber-50";

          return (
            <div key={el.key} className="flex items-center gap-3">
              <span className="text-base w-6">{el.emoji}</span>
              <span className="text-xs font-medium text-stone-600 w-10">{el.label}</span>
              <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barWidth}`}
                  style={{ backgroundColor: el.color, opacity: 0.8 }}
                />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
                {status}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-stone-400 mt-4 leading-relaxed">
        Balanced elements support smooth chi flow. Excess or deficiency disrupts harmony.
      </p>
    </div>
  );
}
