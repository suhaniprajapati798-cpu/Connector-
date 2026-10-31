import { IngestionInput } from './types';

export const PRESETS: { name: string; description: string; icon: string; data: Partial<IngestionInput> }[] = [
  {
    name: 'YouTube Tech Breakdown',
    description: 'Transform a deep-dive coding/AI script into a high-retention video payload',
    icon: 'Youtube',
    data: {
      topic: 'Building Autonomous AI Agents with Local LLMs vs Cloud APIs',
      videoTitle: 'I Tested 10 Autonomous Coding Agents: Here is What Actually Works in Production',
      rawScript: `Most people think autonomous agents are just standard chat loops with extra tools. In reality, production agents fail 80% of the time because of state drift and hallucinated file paths.
Over the last 90 days, our team deployed 4 distinct agent architectures:
1. ReAct loop with sequential tool steps
2. Planner-Worker tree structure
3. Event-driven message bus
4. Direct LLM execution with AST linting

Here is the surprising takeaway: Model size wasn't the bottleneck. Tool schema precision and zero-fluff validation mattered 4x more than parameter count.
In this breakdown, I walk through the raw benchmarks, memory consumption, latency per token, and the exact production blueprint you can replicate.`,
      fileLink: 'https://github.com/production-agents/benchmarks-2026',
      platform: 'youtube',
      targetAudience: 'Software Engineers, AI Founders & System Architects',
      tone: 'Punchy, engaging, professional',
      ctaGoal: 'Watch full video and clone the open-source repo'
    }
  },
  {
    name: 'Metricool Multi-Channel Post',
    description: 'Format a viral founder lesson for unified cross-social distribution',
    icon: 'Radio',
    data: {
      topic: 'The 1-Person Micro-SaaS playbook to $25k MRR',
      videoTitle: 'How Solo Developers are Out-shipping 50-person Engineering Teams in 2026',
      rawScript: `Stop building features nobody asked for.
Here is the blueprint solo founders use to reach $25k MRR in under 6 months:
- Day 1-7: Find an acute B2B pain point in niche Slack groups.
- Day 8-14: Build a hyper-focused MVP solving exactly one workflow.
- Day 15-30: Ship automated content distribution across Metricool and LinkedIn.
- Never write custom billing from scratch; leverage modular payment infra.
- Automate support with deterministic triage bots.

The leverage isn't working 16 hours a day. The leverage is autonomous pipeline execution.`,
      fileLink: 'https://notes.metricool.com/micro-saas-playbook-v4',
      platform: 'metricool',
      targetAudience: 'Solo Founders, Indie Hackers & Tech Entrepreneurs',
      tone: 'Punchy, engaging, professional',
      ctaGoal: 'Save the post, comment for the playbook Notion link'
    }
  },
  {
    name: 'LinkedIn B2B Thought Leadership',
    description: 'Turn raw boardroom insight into an authoritative, white-spaced story',
    icon: 'Linkedin',
    data: {
      topic: 'Why Enterprise AI Pilots Fail to Reach Production',
      videoTitle: 'The $2M Enterprise AI Mistake Executives Keep Repeating',
      rawScript: `Last week, a Fortune 500 VP told me: "We spent $1.8M on generative AI POCs, but zero have made it into daily staff workflows."
Why?
Because they optimized for model benchmarks instead of payload delivery constraints.
If an AI output requires 3 human edits before being accepted by your ERP or CRM, adoption drops to zero within 14 days.
The real competitive advantage in 2026 isn't smarter models.
It's delivery agents that format outputs with 100% adherence to downstream API contracts.`,
      fileLink: 'https://delivery-agent.internal/whitepaper/enterprise-ai-2026',
      platform: 'linkedin',
      targetAudience: 'Enterprise VPs, CTOs & Transformation Leaders',
      tone: 'Punchy, engaging, professional',
      ctaGoal: 'Read the whitepaper, reshare with your engineering leads'
    }
  },
  {
    name: 'Instagram / Reel Viral Script',
    description: 'Transform quick talking points into a scroll-stopping visual hook',
    icon: 'Instagram',
    data: {
      topic: '3 Hidden Productivity Automations That Save 10 Hours a Week',
      videoTitle: '3 AI Automations I Wish I Knew Before Burning Out in Tech',
      rawScript: `Hook: If you are still manually copy-pasting customer notes between tools, watch this right now.
Automation 1: Automated voice-to-structured delivery payload. Speak for 60 seconds into your phone, get a formatted ticket with tags in your backlog.
Automation 2: Webhook-triggered social batching through Metricool so your content distributes while you sleep.
Automation 3: Automated calendar audit that flags duplicate status meetings and cancels them automatically.
Which of these would save you the most sanity? Comment below.`,
      fileLink: 'https://instagram.com/reels/draft-7718',
      platform: 'instagram',
      targetAudience: 'Creators, Remote Workers & High-Output Operators',
      tone: 'Punchy, engaging, professional',
      ctaGoal: 'Comment "AUTOMATE" to get the free setup links in your DMs'
    }
  }
];
