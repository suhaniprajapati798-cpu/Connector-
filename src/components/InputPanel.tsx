import React, { useState } from 'react';
import {
  FileText,
  Link as LinkIcon,
  Video,
  Send,
  Sparkles,
  Sliders,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Radio,
  Youtube,
  Linkedin,
  Instagram,
  Twitter,
  Flame,
  Globe
} from 'lucide-react';
import { IngestionInput, PlatformType } from '../types';
import { PRESETS } from '../presets';

interface InputPanelProps {
  input: IngestionInput;
  onChange: (input: IngestionInput) => void;
  onGenerate: () => void;
  isProcessing: boolean;
  onApplyPreset: (presetIndex: number) => void;
}

const PLATFORMS: { id: PlatformType; name: string; icon: any; desc: string; color: string }[] = [
  { id: 'metricool', name: 'Metricool', icon: Radio, desc: 'Multi-network scheduler payload', color: 'text-amber-400' },
  { id: 'youtube', name: 'YouTube / Shorts', icon: Youtube, desc: 'Hook, SEO chapters, thumbnail', color: 'text-red-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, desc: 'High-retention B2B thought structure', color: 'text-blue-400' },
  { id: 'instagram', name: 'Instagram / Reels', icon: Instagram, desc: 'Scroll-stop caption & audio cue', color: 'text-pink-400' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, desc: 'Punchy thread or viral hook tweet', color: 'text-sky-400' },
  { id: 'tiktok', name: 'TikTok', icon: Flame, desc: '3s on-screen cue & viral hashtags', color: 'text-teal-400' },
  { id: 'omni', name: 'Omni Bundle', icon: Globe, desc: 'Universal cross-platform payload', color: 'text-purple-400' }
];

const TONE_OPTIONS = [
  { label: 'Punchy, engaging, professional', desc: 'Standard agent delivery tone' },
  { label: 'High-Energy & Viral', desc: 'Maximum emotional hook & tempo' },
  { label: 'Authoritative & Insightful', desc: 'Executive thought-leadership depth' },
  { label: 'Direct & Minimalist', desc: 'No filler, high signal-to-noise ratio' }
];

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onChange,
  onGenerate,
  isProcessing,
  onApplyPreset
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'script' | 'link'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const wordCount = input.rawScript.trim() ? input.rawScript.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Source Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-800/80">
        <div>
          <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Platform A Intake
          </span>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            Raw Material Ingestion
          </h2>
        </div>

        {/* Quick Presets Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => onApplyPreset(idx)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Target Delivery Platform */}
      <div className="mb-5">
        <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
          1. Target Platform (Platform B Destination)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isSelected = input.platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange({ ...input, platform: p.id })}
                className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all text-xs ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? p.color : 'text-zinc-500'}`} />
                <span className="font-medium text-[11px] truncate w-full">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Input Materials */}
      <div className="space-y-4">
        {/* Topic & Video Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1 flex items-center justify-between">
              <span>Core Topic / Idea</span>
              <span className="text-[10px] text-zinc-500">Required</span>
            </label>
            <input
              type="text"
              value={input.topic}
              onChange={(e) => onChange({ ...input, topic: e.target.value })}
              placeholder="e.g. AI-driven social content automation"
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-zinc-100 rounded-lg px-3 py-2 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1 flex items-center justify-between">
              <span>Video Title / Working Headline</span>
              <span className="text-[10px] text-zinc-500">Optional</span>
            </label>
            <input
              type="text"
              value={input.videoTitle}
              onChange={(e) => onChange({ ...input, videoTitle: e.target.value })}
              placeholder="e.g. Stop Posting Manually in 2026"
              className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-zinc-100 rounded-lg px-3 py-2 outline-none transition-all placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Raw Script or Transcript */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Raw Script / Video Transcript / Talking Points</span>
            </label>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
              {wordCount > 0 && <span>{wordCount} words</span>}
              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...input,
                    rawScript: `Hook: Most people spend 4 hours writing a post and 30 seconds thinking about how to distribute it.
Here is the exact framework we used to syndicate 42 pieces of content a week without burning out:
1. One source truth recording (15 min podcast or screen recording).
2. Automated extraction into zero-fluff delivery payloads.
3. Native platform tailoring (Metricool for scheduling, YouTube for long-tail SEO, LinkedIn for B2B authority).
Result: 3.2x reach with 80% less manual effort.
Drop a comment below and I'll send you our delivery agent prompt template.`
                  });
                }}
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Insert sample script
              </button>
            </div>
          </div>
          <textarea
            rows={5}
            value={input.rawScript}
            onChange={(e) => onChange({ ...input, rawScript: e.target.value })}
            placeholder="Paste your raw script, video transcript, rough bullet points, or recording speech-to-text here..."
            className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-zinc-100 rounded-lg p-3 outline-none transition-all placeholder:text-zinc-600 font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Source File / Video Link */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>File Link / Video Source / Reference URL</span>
          </label>
          <input
            type="text"
            value={input.fileLink}
            onChange={(e) => onChange({ ...input, fileLink: e.target.value })}
            placeholder="e.g. https://youtube.com/watch?v=... or https://loom.com/share/... or Google Drive URL"
            className="w-full bg-zinc-950/70 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-zinc-100 rounded-lg px-3 py-2 outline-none transition-all placeholder:text-zinc-600 font-mono text-xs"
          />
        </div>
      </div>

      {/* Advanced Persona & Tone Controls (Collapsible) */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-mono"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Agent Tuning: Target Audience, Tone & CTA ({showAdvanced ? 'Hide' : 'Configure'})</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs">
            {/* Tone selector */}
            <div>
              <label className="block font-mono text-zinc-400 mb-1 text-[11px]">Tone Profile</label>
              <select
                value={input.tone}
                onChange={(e) => onChange({ ...input, tone: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-md px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t.label} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block font-mono text-zinc-400 mb-1 text-[11px]">Target Audience</label>
              <input
                type="text"
                value={input.targetAudience}
                onChange={(e) => onChange({ ...input, targetAudience: e.target.value })}
                placeholder="Auto-detect or custom audience"
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-md px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs placeholder:text-zinc-600"
              />
            </div>

            {/* CTA Objective */}
            <div>
              <label className="block font-mono text-zinc-400 mb-1 text-[11px]">Primary Call-to-Action</label>
              <input
                type="text"
                value={input.ctaGoal}
                onChange={(e) => onChange({ ...input, ctaGoal: e.target.value })}
                placeholder="e.g. Comments, clicks, saves"
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-md px-2.5 py-1.5 outline-none focus:border-indigo-500 text-xs placeholder:text-zinc-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Autonomous Agent Execution Button */}
      <div className="mt-5">
        <button
          type="button"
          disabled={isProcessing || (!input.topic && !input.videoTitle && !input.rawScript && !input.fileLink)}
          onClick={onGenerate}
          className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Processing Ingestion & Generating Zero-Fluff Delivery Payload...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span>Generate Structured Delivery Payload</span>
              <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-zinc-500 mt-2 font-mono">
          Guaranteed zero conversational fluff • Direct copy-paste or API forwarding ready
        </p>
      </div>
    </div>
  );
};
