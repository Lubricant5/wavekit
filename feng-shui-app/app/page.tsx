"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Analysis failed");

      sessionStorage.setItem("fengShuiAnalysis", JSON.stringify(data.analysis));
      sessionStorage.setItem("fengShuiImage", preview!);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
      <header className="border-b border-amber-200/50 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            气
          </div>
          <h1 className="text-xl font-semibold text-stone-800 tracking-wide">FengShui AI</h1>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium ml-1">
            Beta
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            <span>✦</span> Traditional Feng Shui · AI-Powered Analysis
          </div>
          <h2 className="text-4xl font-bold text-stone-900 mb-4 leading-tight">
            Harmonize Your Space
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600">
              with Ancient Wisdom
            </span>
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Upload a photo of any room to receive a personalized Feng Shui report — covering chi
            flow, Bagua analysis, color harmony, and curated items to complete your space.
          </p>
        </div>

        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
            ${dragActive ? "border-amber-500 bg-amber-50/80 scale-[1.01]" : "border-stone-300 bg-white/70 hover:border-amber-400 hover:bg-amber-50/40"}
            ${preview ? "border-solid border-emerald-400 bg-emerald-50/30" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !preview && document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {preview ? (
            <div className="relative">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image src={preview} alt="Room preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                  setFile(null);
                }}
                className="absolute top-3 right-3 bg-white/90 text-stone-600 rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-white transition-colors shadow-sm"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs px-3 py-1.5 rounded-full">
                {file?.name}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-emerald-100 flex items-center justify-center mb-4 text-3xl">
                🏠
              </div>
              <p className="text-stone-700 font-medium mb-1">
                Drop your room photo here or{" "}
                <span className="text-amber-600 underline underline-offset-2">browse</span>
              </p>
              <p className="text-stone-400 text-sm">Supports JPG, PNG, WebP · Any room or space</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {preview && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 w-full py-4 rounded-xl font-semibold text-white text-lg
              bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700
              disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200
              shadow-lg shadow-amber-200/50 hover:shadow-amber-300/50 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Reading the energy of your space...
              </span>
            ) : (
              "Analyze My Space ✦"
            )}
          </button>
        )}

        <div className="mt-20 grid grid-cols-3 gap-6">
          {[
            {
              icon: "📸",
              title: "Upload a Photo",
              desc: "Any room — living room, bedroom, office, or kitchen",
            },
            {
              icon: "🧭",
              title: "AI Reads the Chi",
              desc: "Claude analyzes energy flow, Bagua zones, and elemental balance",
            },
            {
              icon: "📋",
              title: "Get Your Report",
              desc: "Personalized fixes, color guidance, and items to complete your space",
            },
          ].map((step) => (
            <div key={step.title} className="text-center">
              <div className="text-3xl mb-3">{step.icon}</div>
              <p className="font-semibold text-stone-800 text-sm mb-1">{step.title}</p>
              <p className="text-stone-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
