import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Code,
  FileText,
  Eye,
  Send,
  Sparkles,
  ShieldCheck,
  Clock,
  Hash,
  Image as ImageIcon,
  MessageSquare,
  Radio,
  ExternalLink,
  Layers,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DeliveryPayload, WebhookDispatchResult } from '../types';
import { SocialPreview } from './SocialPreview';

interface PayloadViewerProps {
  payload: DeliveryPayload;
}

export const PayloadViewer: React.FC<PayloadViewerProps> = ({ payload }) => {
  const [viewMode, setViewMode] = useState<'structured' | 'json' | 'markdown' | 'preview' | 'webhook'>('structured');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Webhook dispatch state
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<WebhookDispatchResult | null>(null);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDispatchWebhook = async () => {
    setIsDispatching(true);
    setDispatchResult(null);
    try {
      const res = await fetch('/api/dispatch-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookUrl.trim() || undefined,
          targetPlatform: payload.platform,
          payload: {
            hook: payload.hook,
            caption: payload.caption,
            hashtags: payload.hashtags,
            recommendedPostingTime: payload.recommendedPostingTime,
            platformCategory: payload.platformCategory,
            visualNote: payload.visualNote,
            metricoolPayload: payload.metricoolPayload
          }
        })
      });
      const data = await res.json();
      setDispatchResult(data);
    } catch (err: any) {
      setDispatchResult({
        success: false,
        error: err.message || 'Dispatch failed',
        dispatchedAt: new Date().toISOString()
      });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xl relative">
      {/* Top Bar with Platform Badge, Zero Fluff Check & Instant Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Platform B Delivery Payload
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
              {payload.platform}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight mt-0.5">
            Platform-Ready Deliverables
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Copy Clean JSON */}
          <button
            onClick={() => copyToClipboard(payload.rawJson, 'json')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 hover:text-white border border-zinc-700 transition-all"
            title="Copy RFC8259 JSON"
          >
            {copiedKey === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedKey === 'json' ? 'JSON Copied!' : 'Copy JSON'}</span>
          </button>

          {/* Copy Clean Markdown */}
          <button
            onClick={() => copyToClipboard(payload.cleanMarkdown, 'md')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 hover:text-white border border-zinc-700 transition-all"
            title="Copy Clean Markdown"
          >
            {copiedKey === 'md' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copiedKey === 'md' ? 'Markdown Copied!' : 'Copy Markdown'}</span>
          </button>

          {/* Download dropdown */}
          <div className="flex items-center rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden text-xs">
            <button
              onClick={() => downloadFile(payload.rawJson, `payload-${payload.platform}.json`, 'application/json')}
              className="px-2.5 py-1.5 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Download .json file"
            >
              .JSON
            </button>
            <span className="text-zinc-600">|</span>
            <button
              onClick={() => downloadFile(payload.cleanMarkdown, `payload-${payload.platform}.md`, 'text/markdown')}
              className="px-2.5 py-1.5 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Download .md file"
            >
              .MD
            </button>
          </div>
        </div>
      </div>

      {/* Mode View Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('structured')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'structured'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Delivery Breakdown</span>
          </button>

          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'json'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Clean JSON</span>
          </button>

          <button
            onClick={() => setViewMode('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'markdown'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Clean Markdown</span>
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'preview'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Platform Simulation</span>
          </button>

          <button
            onClick={() => setViewMode('webhook')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'webhook'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>API / Webhook Dispatch</span>
          </button>
        </div>

        {/* Fluff Verification Tag */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/50">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Fluff Verified</span>
        </div>
      </div>

      {/* Content View 1: Structured Atomic Cards */}
      {viewMode === 'structured' && (
        <div className="space-y-4">
          {/* Deliverable 1: Catchy Hook */}
          <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 transition-all hover:border-zinc-700">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Catchy Hook (First 3 Seconds / Headline)
              </span>
              <button
                onClick={() => copyToClipboard(payload.hook, 'hook')}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
              >
                {copiedKey === 'hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hook' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-zinc-100 leading-snug">
              {payload.hook}
            </p>
          </div>

          {/* Deliverable 2: Caption / Description */}
          <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 transition-all hover:border-zinc-700">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Caption / Description (Formatted Spacing & Call-to-Action)
              </span>
              <button
                onClick={() => copyToClipboard(payload.caption, 'caption')}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
              >
                {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'caption' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
              {payload.caption}
            </div>
          </div>

          {/* Deliverable 3: 5 Highly Targeted Hashtags */}
          <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 transition-all hover:border-zinc-700">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                5 Highly Targeted Hashtags
              </span>
              <button
                onClick={() => copyToClipboard(payload.hashtags.join(' '), 'hashtags')}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
              >
                {copiedKey === 'hashtags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hashtags' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {payload.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-indigo-950/60 border border-indigo-800/60 text-indigo-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Deliverable 4 & 5 Grid: Recommended Posting Time & Visual/Thumbnail Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timing & Category */}
            <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recommended Time & Category
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `Time: ${payload.recommendedPostingTime}\nCategory: ${payload.platformCategory}`,
                      'time'
                    )
                  }
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  {copiedKey === 'time' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'time' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase block">Optimal Posting Slot</span>
                  <span className="font-medium text-zinc-200">{payload.recommendedPostingTime}</span>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase block">Platform Category</span>
                  <span className="font-medium text-zinc-300">{payload.platformCategory}</span>
                </div>
              </div>
            </div>

            {/* Visual / Thumbnail Note */}
            <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-xl p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Visual / Thumbnail Note
                </span>
                <button
                  onClick={() => copyToClipboard(payload.visualNote, 'visual')}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 transition-colors"
                >
                  {copiedKey === 'visual' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'visual' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                "{payload.visualNote}"
              </p>
              <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                Direct instruction for graphic designer or image generation model.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content View 2: Clean RFC8259 JSON */}
      {viewMode === 'json' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>RFC8259 Compliant JSON Output</span>
            <button
              onClick={() => copyToClipboard(payload.rawJson, 'json-tab')}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline"
            >
              {copiedKey === 'json-tab' ? 'Copied!' : 'Copy Raw JSON'}
            </button>
          </div>
          <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed">
            {payload.rawJson}
          </pre>
        </div>
      )}

      {/* Content View 3: Pristine Markdown */}
      {viewMode === 'markdown' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Fluff-Free Clean Markdown (Ready for Copy-Paste)</span>
            <button
              onClick={() => copyToClipboard(payload.cleanMarkdown, 'md-tab')}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 underline"
            >
              {copiedKey === 'md-tab' ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>
          <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[500px] whitespace-pre-wrap leading-relaxed">
            {payload.cleanMarkdown}
          </pre>
        </div>
      )}

      {/* Content View 4: Live Social Simulation */}
      {viewMode === 'preview' && (
        <SocialPreview payload={payload} />
      )}

      {/* Content View 5: Webhook & API Dispatcher */}
      {viewMode === 'webhook' && (
        <div className="space-y-4 bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 sm:p-5">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              Direct API / Webhook Forwarding Pipeline
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Forward this structured payload directly to your Metricool webhook, Zapier, Make.com, or internal backend endpoint.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Target Webhook URL (Leave blank to run built-in simulator test)
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.metricool.com/v1/posts or https://hooks.zapier.com/hooks/catch/..."
                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <button
              onClick={handleDispatchWebhook}
              disabled={isDispatching}
              className="py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-medium text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              {isDispatching ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Forwarding Payload...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{webhookUrl ? 'Dispatch to Webhook' : 'Simulate Instant Pipeline Dispatch'}</span>
                </>
              )}
            </button>
          </div>

          {dispatchResult && (
            <div
              className={`p-3.5 rounded-lg border text-xs font-mono ${
                dispatchResult.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {dispatchResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {dispatchResult.success ? 'Dispatch Successful' : 'Dispatch Failed'}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-300">
                {dispatchResult.message || dispatchResult.error}
              </p>
              {dispatchResult.dispatchId && (
                <div className="text-[10px] text-zinc-400 mt-1">
                  ID: {dispatchResult.dispatchId} • At: {dispatchResult.dispatchedAt}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
