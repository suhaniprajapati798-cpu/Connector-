import React, { useState } from 'react';
import {
  Youtube,
  Linkedin,
  Instagram,
  Twitter,
  Radio,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { DeliveryPayload } from '../types';

interface SocialPreviewProps {
  payload: DeliveryPayload;
}

export const SocialPreview: React.FC<SocialPreviewProps> = ({ payload }) => {
  const [activePlatform, setActivePlatform] = useState<string>(
    payload.platform === 'omni' ? 'metricool' : payload.platform
  );

  return (
    <div className="space-y-4">
      {/* Platform Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'metricool', label: 'Metricool View', icon: Radio },
          { id: 'youtube', label: 'YouTube View', icon: Youtube },
          { id: 'linkedin', label: 'LinkedIn View', icon: Linkedin },
          { id: 'instagram', label: 'Instagram View', icon: Instagram },
          { id: 'twitter', label: 'X (Twitter) View', icon: Twitter }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePlatform === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePlatform(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Metricool Card Simulation */}
      {activePlatform === 'metricool' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5 text-zinc-200 font-sans shadow-md">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white">Metricool Multi-Network Publisher</span>
                <p className="text-[10px] text-zinc-400">Delivery Payload Ready for Scheduled Dispatch</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Post Content (Formatted with Spacing & Hashtags)
                </label>
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3 text-xs leading-relaxed text-zinc-200 whitespace-pre-wrap font-sans">
                  {payload.caption}
                  {'\n\n'}
                  <span className="text-indigo-400 font-medium">{payload.hashtags.join(' ')}</span>
                </div>
              </div>

              {payload.firstComment && (
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    First Comment (Automated Link / Engagement Trigger)
                  </label>
                  <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5 text-xs text-zinc-300 font-mono">
                    {payload.firstComment}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/60 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Scheduled Time Slot</span>
                <span className="text-white font-medium text-xs flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {payload.recommendedPostingTime}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Category</span>
                <span className="text-zinc-200 text-xs">{payload.platformCategory}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Visual Instruction</span>
                <p className="text-zinc-300 text-[11px] leading-snug mt-1 italic bg-zinc-950 p-2 rounded border border-zinc-800">
                  {payload.visualNote}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Target Audience</span>
                <span className="text-zinc-300 text-xs">{payload.targetAudience}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Simulation */}
      {activePlatform === 'youtube' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-md">
          {/* Mock Video player bar */}
          <div className="bg-zinc-900 aspect-video max-h-56 w-full flex flex-col items-center justify-center p-4 relative border-b border-zinc-800">
            <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center text-white mb-2 shadow-lg">
              <Youtube className="w-6 h-6" />
            </div>
            <p className="text-xs font-mono text-zinc-300 text-center max-w-md bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <span className="text-red-400 font-bold mr-1">Thumbnail Concept:</span> {payload.visualNote}
            </p>
          </div>

          <div className="p-4 sm:p-5 space-y-3">
            <h3 className="text-base font-bold text-white leading-snug">
              {payload.title || payload.hook}
            </h3>

            {/* Hook highlight box */}
            <div className="bg-red-950/30 border border-red-800/40 rounded-lg p-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 block mb-1 font-semibold">
                First 3-Second Hook / Audio Cue
              </span>
              <p className="text-xs text-red-200 font-medium">"{payload.hook}"</p>
            </div>

            {/* Description box */}
            <div className="bg-zinc-900/90 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans border border-zinc-800">
              <div className="font-semibold text-zinc-200 mb-1">Description:</div>
              {payload.caption}
              {'\n\n'}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {payload.hashtags.map((h) => (
                  <span key={h} className="text-blue-400 hover:underline">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-1">
              <span>Category: {payload.platformCategory}</span>
              <span>Peak Drop: {payload.recommendedPostingTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn Simulation */}
      {activePlatform === 'linkedin' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5 text-zinc-200 shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-blue-400 text-sm">
                DL
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  Delivery Agent Operator <span className="text-zinc-500">• 1st</span>
                </div>
                <div className="text-[11px] text-zinc-400">Head of Distribution & Systems • Automated</div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <span>Just now</span> • <Clock className="w-2.5 h-2.5" />
                </div>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-zinc-500" />
          </div>

          {/* Hook headline */}
          <div className="text-sm font-semibold text-white mb-2 leading-relaxed">
            {payload.hook}
          </div>

          {/* Body */}
          <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap mb-3 font-sans">
            {payload.caption}
            {'\n\n'}
            <span className="text-blue-400 font-medium">{payload.hashtags.join(' ')}</span>
          </div>

          {/* Visual attachment note */}
          <div className="border border-zinc-800 bg-zinc-900/60 rounded-lg p-3 text-xs mb-3">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold block mb-1">
              Carousel / Graphic Slide Note:
            </span>
            <p className="text-zinc-300 text-[11px] italic">{payload.visualNote}</p>
          </div>

          {/* Social action icons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-zinc-400 text-xs">
            <button className="flex items-center gap-1.5 hover:text-blue-400">
              <Heart className="w-3.5 h-3.5" /> Like
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-400">
              <MessageCircle className="w-3.5 h-3.5" /> Comment
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-400">
              <Share2 className="w-3.5 h-3.5" /> Repost
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-400">
              <Bookmark className="w-3.5 h-3.5" /> Send
            </button>
          </div>
        </div>
      )}

      {/* Instagram Simulation */}
      {activePlatform === 'instagram' && (
        <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
          {/* IG Header */}
          <div className="flex items-center justify-between p-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  D
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">content_delivery_agent</span>
                <span className="text-[10px] text-zinc-400">{payload.platformCategory}</span>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
          </div>

          {/* IG Image/Cover Mock */}
          <div className="bg-zinc-900 aspect-square flex flex-col items-center justify-center p-6 text-center border-b border-zinc-800 relative">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
              <Instagram className="w-6 h-6" />
            </div>
            <p className="text-xs text-zinc-200 font-medium max-w-xs leading-snug">
              {payload.visualNote}
            </p>
            <span className="absolute bottom-3 left-3 text-[10px] font-mono bg-zinc-950/80 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800">
              Hook: {payload.hook.slice(0, 45)}...
            </span>
          </div>

          {/* IG Engagement row */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2 text-zinc-200">
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <MessageCircle className="w-5 h-5" />
                <Share2 className="w-5 h-5" />
              </div>
              <Bookmark className="w-5 h-5" />
            </div>

            {/* Caption */}
            <div className="text-xs text-zinc-300 leading-relaxed font-sans">
              <span className="font-semibold text-white mr-1.5">content_delivery_agent</span>
              <span className="font-bold text-white block mb-1">{payload.hook}</span>
              <div className="whitespace-pre-wrap">{payload.caption}</div>
              <div className="mt-2 text-indigo-400 font-medium">
                {payload.hashtags.join(' ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* X / Twitter Simulation */}
      {activePlatform === 'twitter' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 sm:p-5 text-zinc-200 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-200 text-sm">
              <Twitter className="w-5 h-5 text-sky-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-white">Delivery Agent</span>
                <span className="text-zinc-500">@deliveryagent • 1m</span>
              </div>

              <div className="text-sm font-semibold text-white mt-1 mb-2">
                {payload.hook}
              </div>

              <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans mb-3">
                {payload.caption}
              </div>

              <div className="text-xs text-sky-400 font-mono mb-3">
                {payload.hashtags.join(' ')}
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-400 italic">
                <span className="text-[10px] font-mono text-zinc-500 uppercase not-italic block">Image Attachment Brief:</span>
                {payload.visualNote}
              </div>

              <div className="flex items-center justify-between text-zinc-500 text-xs mt-3 pt-2 border-t border-zinc-800/80">
                <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 48</span>
                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> 182</span>
                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 1.2k</span>
                <span className="flex items-center gap-1"><Bookmark className="w-3.5 h-3.5" /> 490</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
