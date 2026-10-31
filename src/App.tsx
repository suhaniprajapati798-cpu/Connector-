import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { PayloadViewer } from './components/PayloadViewer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { IngestionInput, DeliveryPayload } from './types';
import { PRESETS } from './presets';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Radio,
  Share2,
  CheckCircle2,
  Terminal,
  Zap,
  Clock
} from 'lucide-react';

const INITIAL_INPUT: IngestionInput = {
  topic: 'Autonomous Content Delivery Agent Pipeline',
  videoTitle: 'How to Automate Multi-Platform Social Distribution with Zero Fluff in 2026',
  rawScript: `Most creators and marketing teams spend 80% of their energy formatting posts for different platforms instead of creating high-leverage ideas.
Here is the production framework we built:
1. Ingest raw notes, video drafts, or audio transcripts into an autonomous delivery agent.
2. Automatically extract a 3-second attention hook and clean, formatted caption with line breaks and high-converting CTA.
3. Generate exactly 5 targeted hashtags and compute optimal scheduling windows.
4. Provide immediate visual/thumbnail instructions for the creative team.
5. Ensure 100% zero conversational fluff so the output can be directly copy-pasted or piped through Metricool and Zapier webhooks.`,
  fileLink: 'https://delivery-agent.internal/docs/pipeline-v2',
  platform: 'metricool',
  targetAudience: 'Digital Creators, Founders & Agency Operations Leads',
  tone: 'Punchy, engaging, professional',
  ctaGoal: 'Save this blueprint & drop "DELIVER" to test our automated agent',
  additionalContext: 'Ensure output is ready for direct Metricool scheduling and instant copy.'
};

const INITIAL_PAYLOAD: DeliveryPayload = {
  platform: 'metricool',
  targetAudience: 'Digital Creators, Founders & Agency Operations Leads',
  tone: 'Punchy, engaging, professional',
  title: 'How to Automate Multi-Platform Social Distribution with Zero Fluff in 2026',
  hook: '93% of content creators burn out not from writing ideas, but from manually reformatting them for 5 different algorithms. Here is the fix:',
  caption: `93% of content creators burn out not from writing ideas, but from manually reformatting them for 5 different algorithms. Here is the fix:

The old playbook:
- Spend 3 hours recording a video.
- Spend 4 hours re-writing descriptions, guessing hashtags, and tweaking thumbnails for each platform.

The autonomous agent playbook:
1. Record once into a centralized intake stream.
2. Ingest raw transcript into an autonomous delivery agent.
3. Automatically generate zero-fluff, platform-ready payloads (First 3s hook, structured whitespace caption, and graphic directives).
4. Direct one-click copy or webhook dispatch into your Metricool queue.

Result: 42 published distribution assets per week with under 15 minutes of operational overhead.

Save this system for your next content sprint. Drop "DELIVER" in the comments and I will send you the complete agent schema.`,
  hashtags: [
    '#ContentDistribution',
    '#AutonomousAgents',
    '#Metricool',
    '#CreatorEconomy',
    '#SocialMediaAutomation'
  ],
  recommendedPostingTime: 'Tuesday & Thursday 14:00 - 16:30 EST (Peak B2B Social Window)',
  platformCategory: 'Technology / Media Automation',
  visualNote: 'Split-screen graphic: Left shows cluttered manual copy-paste tabs with red alert badge; Right shows a clean glowing terminal window outputting structured JSON payload ready for Metricool dispatch.',
  firstComment: 'Get the full autonomous agent documentation & webhook templates here: https://delivery-agent.internal/docs #Automation',
  metricoolPayload: {
    postText: `93% of content creators burn out not from writing ideas, but from manually reformatting them for 5 different algorithms. Here is the fix:\n\nThe old playbook:\n- Spend 3 hours recording a video.\n- Spend 4 hours re-writing descriptions, guessing hashtags, and tweaking thumbnails for each platform.\n\nThe autonomous agent playbook:\n1. Record once into a centralized intake stream.\n2. Ingest raw transcript into an autonomous delivery agent.\n3. Automatically generate zero-fluff, platform-ready payloads.\n\nSave this system for your next content sprint. Drop "DELIVER" in the comments.\n\n#ContentDistribution #AutonomousAgents #Metricool #CreatorEconomy #SocialMediaAutomation`,
    providers: ['all'],
    publishDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16).replace('T', ' '),
    firstCommentText: 'Get the full autonomous agent documentation here: https://delivery-agent.internal/docs #Automation',
    status: 'scheduled',
    mediaNote: 'Split-screen graphic showing messy tabs vs pristine structured terminal payload.'
  },
  cleanMarkdown: `### Catchy Hook (First 3s / Headline)
93% of content creators burn out not from writing ideas, but from manually reformatting them for 5 different algorithms. Here is the fix:

### Caption / Description
93% of content creators burn out not from writing ideas, but from manually reformatting them for 5 different algorithms. Here is the fix:

The old playbook:
- Spend 3 hours recording a video.
- Spend 4 hours re-writing descriptions, guessing hashtags, and tweaking thumbnails for each platform.

The autonomous agent playbook:
1. Record once into a centralized intake stream.
2. Ingest raw transcript into an autonomous delivery agent.
3. Automatically generate zero-fluff, platform-ready payloads (First 3s hook, structured whitespace caption, and graphic directives).
4. Direct one-click copy or webhook dispatch into your Metricool queue.

Result: 42 published distribution assets per week with under 15 minutes of operational overhead.

Save this system for your next content sprint. Drop "DELIVER" in the comments and I will send you the complete agent schema.

### 5 Highly Targeted Hashtags
#ContentDistribution #AutonomousAgents #Metricool #CreatorEconomy #SocialMediaAutomation

### Recommended Posting Time & Category
- **Recommended Posting Time:** Tuesday & Thursday 14:00 - 16:30 EST (Peak B2B Social Window)
- **Platform Category:** Technology / Media Automation

### Visual / Thumbnail Note
Split-screen graphic: Left shows cluttered manual copy-paste tabs with red alert badge; Right shows a clean glowing terminal window outputting structured JSON payload ready for Metricool dispatch.`,
  rawJson: ''
};

INITIAL_PAYLOAD.rawJson = JSON.stringify(
  {
    platform: INITIAL_PAYLOAD.platform,
    targetAudience: INITIAL_PAYLOAD.targetAudience,
    tone: INITIAL_PAYLOAD.tone,
    title: INITIAL_PAYLOAD.title,
    hook: INITIAL_PAYLOAD.hook,
    caption: INITIAL_PAYLOAD.caption,
    hashtags: INITIAL_PAYLOAD.hashtags,
    recommendedPostingTime: INITIAL_PAYLOAD.recommendedPostingTime,
    platformCategory: INITIAL_PAYLOAD.platformCategory,
    visualNote: INITIAL_PAYLOAD.visualNote,
    metricoolReadyPayload: INITIAL_PAYLOAD.metricoolPayload
  },
  null,
  2
);

export default function App() {
  const [input, setInput] = useState<IngestionInput>(INITIAL_INPUT);
  const [currentPayload, setCurrentPayload] = useState<DeliveryPayload>(INITIAL_PAYLOAD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<DeliveryPayload[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [agentStep, setAgentStep] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('payload_agent_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Seed initial example into history
        setHistory([{ ...INITIAL_PAYLOAD, id: 'seed_1', timestamp: Date.now() }]);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  // Save history
  const saveToHistory = (newPayload: DeliveryPayload) => {
    try {
      const payloadWithMeta = {
        ...newPayload,
        id: `payload_${Date.now()}`,
        timestamp: Date.now()
      };
      const updated = [payloadWithMeta, ...history.slice(0, 24)];
      setHistory(updated);
      localStorage.setItem('payload_agent_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleApplyPreset = (index: number) => {
    const preset = PRESETS[index];
    if (preset) {
      setInput((prev) => ({
        ...prev,
        ...preset.data
      }));
      setNotice(`Applied preset: "${preset.name}"`);
      setTimeout(() => setNotice(null), 3000);
      setShowPresetModal(false);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    setNotice(null);
    setAgentStep('1/4 Ingesting Platform A Raw Materials...');

    const timer1 = setTimeout(() => {
      setAgentStep('2/4 Identifying Audience & Calibrating Tone...');
    }, 450);

    const timer2 = setTimeout(() => {
      setAgentStep('3/4 Formulating Hook, Caption, 5 Hashtags & Timing...');
    }, 900);

    const timer3 = setTimeout(() => {
      setAgentStep('4/4 Enforcing Zero-Fluff RFC8259 Compliance...');
    }, 1400);

    try {
      const res = await fetch('/api/generate-payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.payload) {
        setCurrentPayload(data.payload);
        saveToHistory(data.payload);
        if (data.fallbackUsed) {
          setNotice('Payload structured via offline deterministic rule engine.');
        } else {
          setNotice('Payload successfully generated by Autonomous Delivery Agent (Gemini 3.8 Flash).');
        }
        setTimeout(() => setNotice(null), 4000);
      } else {
        throw new Error(data.error || 'Failed to synthesize payload');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setNotice(`Error: ${err.message || 'Failed to generate payload'}`);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsProcessing(false);
      setAgentStep('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('payload_agent_history');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* App Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onQuickPreset={() => setShowPresetModal(true)}
        isProcessing={isProcessing}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Agent Role & Mission Banner */}
        <div className="bg-gradient-to-r from-zinc-900/90 via-indigo-950/40 to-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Autonomous Digital Content Delivery Agent Active</span>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Sole Responsibility: Take raw ideas, video topics, or transcripts from <span className="text-cyan-400 font-mono">Platform A</span> and transform into structured, platform-ready delivery payloads for <span className="text-emerald-400 font-mono">Platform B (Metricool / Social / YouTube)</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-[11px]">
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Rule: Zero Conversational Fluff
            </span>
            <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Output: JSON / Markdown
            </span>
          </div>
        </div>

        {/* Live Notification Toast */}
        {notice && (
          <div className="bg-indigo-950/80 border border-indigo-700/80 text-indigo-200 px-4 py-2.5 rounded-xl text-xs flex items-center justify-between shadow-lg animate-in fade-in duration-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {notice}
            </span>
            <button onClick={() => setNotice(null)} className="text-zinc-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Active agent step indicator during run */}
        {isProcessing && agentStep && (
          <div className="bg-zinc-900 border border-indigo-500/50 p-3 rounded-xl flex items-center gap-3 text-xs font-mono text-cyan-300 shadow-lg animate-pulse">
            <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>AGENT EXECUTING: {agentStep}</span>
          </div>
        )}

        {/* Core 2-Column Workflow Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Platform A Ingestion Panel (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <InputPanel
              input={input}
              onChange={setInput}
              onGenerate={handleGenerate}
              isProcessing={isProcessing}
              onApplyPreset={handleApplyPreset}
            />

            {/* Platform Constraints Quick Reference */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-xs space-y-2">
              <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider font-semibold block">
                Platform B Delivery Constraints Enforced
              </span>
              <ul className="text-[11px] text-zinc-400 space-y-1.5 list-disc list-inside">
                <li><strong className="text-zinc-300">Catchy Hook:</strong> First 3-seconds or headline designed to halt scrolling immediately.</li>
                <li><strong className="text-zinc-300">Formatted Caption:</strong> Clean whitespace spacing, structured bullet insights, and clear high-converting CTA.</li>
                <li><strong className="text-zinc-300">Hashtags:</strong> Strictly 5 targeted, high-intent tags.</li>
                <li><strong className="text-zinc-300">Posting Window:</strong> Day/hour window calibrated to platform demographics.</li>
                <li><strong className="text-zinc-300">Thumbnail & Visual:</strong> Actionable prompt instruction for design team.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Platform B Deliverables Deck (7 cols on lg) */}
          <div className="lg:col-span-7">
            <PayloadViewer payload={currentPayload} />
          </div>
        </div>
      </main>

      {/* Quick Presets Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-semibold text-white">
                  Load Production Content Preset
                </h3>
              </div>
              <button
                onClick={() => setShowPresetModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Select a pre-configured raw material bundle to test the Autonomous Delivery Agent:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {PRESETS.map((p, idx) => (
                <div
                  key={p.name}
                  onClick={() => handleApplyPreset(idx)}
                  className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-indigo-500/80 hover:bg-zinc-800/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                      {p.data.platform}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectPayload={(item) => setCurrentPayload(item)}
        onClearHistory={clearHistory}
      />
    </div>
  );
}
