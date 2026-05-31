import { ShoppingRecommendation } from "@/types/analysis";

interface Props {
  item: ShoppingRecommendation;
}

const ELEMENT_COLORS: Record<string, string> = {
  Wood: "bg-green-100 text-green-700",
  Fire: "bg-red-100 text-red-700",
  Earth: "bg-amber-100 text-amber-700",
  Metal: "bg-slate-100 text-slate-700",
  Water: "bg-blue-100 text-blue-700",
};

const PRICE_BADGE: Record<string, string> = {
  Budget: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Mid-range": "bg-amber-50 text-amber-700 border-amber-200",
  Premium: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function ShoppingCard({ item }: Props) {
  const elementStyle = ELEMENT_COLORS[item.element] || "bg-stone-100 text-stone-600";
  const priceStyle =
    PRICE_BADGE[item.priceRange] || "bg-stone-50 text-stone-600 border-stone-200";

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(item.searchKeywords + " feng shui")}`;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-amber-300 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-800 text-sm leading-snug">{item.item}</h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${priceStyle}`}>
          {item.priceRange}
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed">{item.purpose}</p>

      <div className="flex flex-wrap gap-1.5">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${elementStyle}`}>
          {item.element} element
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
          ↑ {item.lifeAreaBenefit}
        </span>
      </div>

      <div className="text-xs text-stone-400 flex items-start gap-1">
        <span className="mt-0.5">📍</span>
        <span>{item.placement}</span>
      </div>

      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full text-center py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 text-xs font-medium
          hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 transition-all group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-700"
      >
        Find This Item →
      </a>
    </div>
  );
}
