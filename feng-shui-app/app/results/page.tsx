"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FengShuiAnalysis } from "@/types/analysis";
import ScoreRing from "@/components/ScoreRing";
import BaguaMap from "@/components/BaguaMap";
import ElementBalance from "@/components/ElementBalance";
import ReportSection from "@/components/ReportSection";
import ShoppingCard from "@/components/ShoppingCard";

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<FengShuiAnalysis | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("fengShuiAnalysis");
    const img = sessionStorage.getItem("fengShuiImage");
    if (!stored) {
      router.push("/");
      return;
    }
    setAnalysis(JSON.parse(stored));
    setImageUrl(img);
    setIsDemo(sessionStorage.getItem("fengShuiDemo") === "true");
  }, [router]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-stone-400 text-sm">Loading your report...</div>
      </div>
    );
  }

  const chiColor =
    analysis.chiFlow.rating === "Good"
      ? "text-emerald-600 bg-emerald-50"
      : analysis.chiFlow.rating === "Fair"
        ? "text-amber-600 bg-amber-50"
        : "text-red-600 bg-red-50";

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
      {/* Header */}
      <header className="border-b border-amber-200/50 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              气
            </div>
            <span className="text-xl font-semibold text-stone-800">FengShui AI</span>
          </div>
          <Link
            href="/"
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-1"
          >
            ← Analyze another room
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {isDemo && (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 px-5 py-3 rounded-xl text-sm flex items-center gap-3">
            <span className="text-lg">🎭</span>
            <span><strong>Demo mode</strong> — no API key detected, showing sample analysis. Add <code className="bg-amber-100 px-1 rounded">ANTHROPIC_API_KEY</code> to <code className="bg-amber-100 px-1 rounded">.env.local</code> for real AI analysis.</span>
          </div>
        )}
        {/* Hero Score Banner */}
        <div className="bg-white/80 rounded-2xl border border-stone-200/60 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {imageUrl && (
              <div className="relative w-full md:w-72 aspect-video md:aspect-square rounded-xl overflow-hidden flex-shrink-0">
                <Image src={imageUrl} alt="Your room" fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-start gap-6">
                <ScoreRing score={analysis.overallScore} />
                <div>
                  <h1 className="text-2xl font-bold text-stone-900 mb-1">Your Feng Shui Report</h1>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${chiColor}`}>
                    Chi Flow: {analysis.chiFlow.rating}
                  </span>
                </div>
              </div>
              <p className="text-stone-600 leading-relaxed">{analysis.overallAssessment}</p>
              <p className="text-stone-500 text-sm">{analysis.chiFlow.description}</p>
              {analysis.chiFlow.blockages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                    Energy Blockages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.chiFlow.blockages.map((b, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Wins */}
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            ⚡ Quick Wins — Do These Today
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.quickWins.map((win, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-stone-700 leading-snug">{win}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bagua + Elements row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaguaMap zones={analysis.baguaAnalysis.activeZones} dominant={analysis.baguaAnalysis.dominantArea} />
          <ElementBalance balance={analysis.elementBalance} />
        </div>

        {/* Color Recommendations */}
        <ReportSection title="Color Recommendations" icon="🎨">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.colorRecommendations.map((rec, i) => {
              const urgencyStyle =
                rec.urgency === "High"
                  ? "bg-red-50 border-red-200"
                  : rec.urgency === "Medium"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-stone-50 border-stone-200";
              return (
                <div key={i} className={`border rounded-xl p-4 ${urgencyStyle}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-stone-200 shadow-sm"
                        style={{ backgroundColor: rec.recommendedColor }}
                      />
                      <span className="font-medium text-stone-800 text-sm">
                        {rec.recommendedColor}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${rec.urgency === "High" ? "bg-red-100 text-red-700" : rec.urgency === "Medium" ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"}`}
                    >
                      {rec.urgency} priority
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-1">
                    Replace: <span className="line-through">{rec.currentColor}</span> ·{" "}
                    {rec.element} element
                  </p>
                  <p className="text-sm text-stone-600">{rec.reasoning}</p>
                </div>
              );
            })}
          </div>
        </ReportSection>

        {/* Furniture Movement */}
        <ReportSection title="Furniture & Item Placement" icon="🪑">
          <div className="space-y-3">
            {analysis.furnitureArrangement.map((item, i) => {
              const actionStyle =
                item.recommendedAction === "Remove"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : item.recommendedAction === "Move"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700";
              return (
                <div
                  key={i}
                  className="border border-stone-200 bg-white/70 rounded-xl p-4 flex flex-col md:flex-row md:items-start gap-3"
                >
                  <div className="flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${actionStyle}`}
                    >
                      {item.recommendedAction}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-800 text-sm mb-0.5">{item.item}</p>
                    <p className="text-xs text-stone-400 mb-1">Currently: {item.currentPosition}</p>
                    {item.recommendedAction !== "Keep" && (
                      <p className="text-xs text-stone-500 mb-1">
                        {item.targetRoom && (
                          <span className="font-medium text-amber-700">→ {item.targetRoom}: </span>
                        )}
                        {item.targetPosition}
                      </p>
                    )}
                    <p className="text-sm text-stone-600">{item.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ReportSection>

        {/* Priority Recommendations */}
        <ReportSection title="Action Plan" icon="📋">
          <div className="space-y-3">
            {[...analysis.recommendations]
              .sort((a, b) => a.priority - b.priority)
              .map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white/70 border border-stone-200 rounded-xl p-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {rec.priority}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                        {rec.category}
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">↑ {rec.benefit}</span>
                    </div>
                    <p className="text-sm text-stone-700">{rec.action}</p>
                  </div>
                </div>
              ))}
          </div>
        </ReportSection>

        {/* Shopping Recommendations */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-lg font-semibold text-stone-800">
              🛍️ Complete Your Space
            </h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Curated for your room
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.shoppingRecommendations.map((item, i) => (
              <ShoppingCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Avoid List */}
        <div className="bg-red-50/60 border border-red-200/60 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-4">
            ⚠️ Feng Shui No-List — Avoid These
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {analysis.avoidList.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-red-700">
                <span className="text-red-400">✗</span> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center py-8 border-t border-stone-200/60">
          <p className="text-stone-400 text-sm mb-4">
            Ready to analyze another space?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-amber-600 hover:to-emerald-700 transition-all shadow-md"
          >
            Analyze Another Room ✦
          </Link>
        </div>
      </div>
    </main>
  );
}
