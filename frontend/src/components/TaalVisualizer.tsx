import React, { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Taal, TaalBeat } from "../types";

const TaalVisualizer: React.FC<{ taals: Taal[] }> = ({ taals }) => {
  const [selectedSlug, setSelectedSlug] = useState<string>(taals[0]?.slug || "teentaal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [activeBeat, setActiveBeat] = useState<number>(0);

  useEffect(() => {
    if (taals.length > 0 && !taals.find((t) => t.slug === selectedSlug)) {
      setSelectedSlug(taals[0].slug);
    }
  }, [taals, selectedSlug]);

  const currentTaal = taals.find((t) => t.slug === selectedSlug) || taals[0];
  let beats: TaalBeat[] = [];
  try { beats = currentTaal ? JSON.parse(currentTaal.theka_bols) : []; } catch { beats = []; }

  useEffect(() => {
    if (!isPlaying || beats.length === 0) return;
    const intervalMs = Math.round(60000 / bpm);
    const timer = setInterval(() => {
      setActiveBeat((prev) => (prev >= beats.length ? 1 : prev + 1));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, bpm, beats.length]);

  if (!currentTaal) return null;

  const handleTogglePlay = () => {
    if (!isPlaying && activeBeat === 0) setActiveBeat(1);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="archival-card p-6 bg-gradient-to-br from-white to-parchment/70">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">Interactive Taal & Matra Visualiser</span>
          <h3 className="font-display text-2xl font-bold text-stone-900 mt-0.5">
            {currentTaal.name} {currentTaal.hindi_name ? `(${currentTaal.hindi_name})` : ""} — {currentTaal.matras} Matras
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Vibhag: <strong>{currentTaal.vibhag_structure}</strong> • Tali: <strong>{currentTaal.tali_positions}</strong> • Khali: <strong>{currentTaal.khali_positions}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {taals.map((t) => (
            <button key={t.slug} onClick={() => { setIsPlaying(false); setActiveBeat(0); setSelectedSlug(t.slug); }} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${t.slug === currentTaal.slug ? "bg-crimson-700 text-white" : "bg-white border border-stone-300 text-stone-700 hover:bg-parchment"}`}>
              {t.name} ({t.matras})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 my-4 bg-white/80 p-3 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2">
          <button onClick={handleTogglePlay} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-crimson-700 text-white text-sm font-medium hover:bg-crimson-800">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause Laya" : "Play Cycle"}
          </button>
          <button onClick={() => { setIsPlaying(false); setActiveBeat(0); }} className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-stone-700">Laya Tempo: <strong>{bpm} BPM</strong></label>
          <input type="range" min={50} max={180} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="accent-crimson-700 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 my-5">
        {beats.map((b) => {
          const isCurrent = activeBeat === b.beat;
          const isSam = b.marker.includes("Sam");
          const isKhali = b.marker.includes("Khali");
          const isTali = b.marker.includes("Tali");
          return (
            <div key={b.beat} onClick={() => setActiveBeat(b.beat)} className={`cursor-pointer rounded-lg p-3 border text-center transition-all ${isCurrent ? "bg-crimson-700 text-white border-crimson-800 scale-105 shadow-md" : isSam ? "bg-amber-50 border-amber-400 text-stone-900" : isKhali ? "bg-stone-100 border-stone-300 text-stone-700" : "bg-white border-stone-200 text-stone-800"}`}>
              <div className="flex items-center justify-between text-[11px] opacity-80">
                <span>#{b.beat}</span>
                <span className="font-bold">{isSam ? "X" : isKhali ? "0" : isTali ? "•" : ""}</span>
              </div>
              <div className="font-display text-xl font-bold my-1">{b.bol}</div>
              <div className={`text-[10px] truncate ${isCurrent ? "text-amber-200" : "text-stone-500"}`}>{b.marker || `Vibhag ${b.vibhag}`}</div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-stone-700 space-y-1 bg-white/70 p-4 rounded-lg border border-stone-200/80">
        <p>{currentTaal.explanation}</p>
        {currentTaal.performance_usage && <p className="text-xs text-stone-600 pt-1"><strong>Performance Context:</strong> {currentTaal.performance_usage}</p>}
      </div>
    </div>
  );
};

export default TaalVisualizer;
