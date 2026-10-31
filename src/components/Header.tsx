import React from 'react';
import { Cpu, History, Zap, ShieldCheck, Radio, Sparkles } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onQuickPreset: () => void;
  isProcessing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  historyCount,
  onOpenHistory,
  onQuickPreset,
  isProcessing
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Persona */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                PAYLOAD
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                  AGENT v2.5
                </span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AUTONOMOUS ENGINE
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Platform A Ingestion <span className="text-zinc-600">➔</span> Zero-Fluff Structuring <span className="text-zinc-600">➔</span> Platform B Delivery
            </p>
          </div>
        </div>

        {/* Action Controls & Pipeline Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero Conversational Fluff Guard Active</span>
          </div>

          <button
            onClick={onQuickPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
            title="Load sample content"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Presets</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-all"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Payload History</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-indigo-600 text-white text-[10px] rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Live processing progress line */}
      {isProcessing && (
        <div className="h-0.5 w-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 animate-[shimmer_1.5s_infinite] w-full" />
        </div>
      )}
    </header>
  );
};
