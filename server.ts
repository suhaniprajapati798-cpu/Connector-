import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Strip any inadvertent conversational fluff
function stripConversationalFluff(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();
  // Remove markdown code fences if wrapped entirely in ```json or ```
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  } else if (cleaned.startsWith('```markdown')) {
    cleaned = cleaned.replace(/^```markdown\s*/i, '').replace(/\s*```$/i, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // Remove standard conversational openings
  const fluffPatterns = [
    /^(Sure!|Sure,|Here is your|Here's your|Here is the|Certainly!|Below is|I've generated|Hope you like it|Hope this helps|As an autonomous agent|Here are your)[^\n]*\n+/i,
    /\n+(Hope this helps!|Let me know if you need anything else!|Enjoy!|Feel free to tweak it!)[^\n]*$/i
  ];

  for (const pattern of fluffPatterns) {
    cleaned = cleaned.replace(pattern, '').trim();
  }

  return cleaned;
}

// Fallback generator when API key is missing or offline
function generateLocalFallback(input: any) {
  const topic = input.topic || input.videoTitle || 'Content Delivery Payload';
  const targetAudience = input.targetAudience || 'Digital Creators, Founders & Marketing Leads';
  const tone = input.tone || 'Punchy, engaging, professional';
  const platform = input.platform || 'metricool';

  const hashtags = [
    '#ContentStrategy',
    '#DigitalGrowth',
    '#CreatorEconomy',
    '#SocialMediaAutomation',
    '#PayloadDelivery'
  ];

  const hook = `93% of creators fail because they publish without an automated distribution pipeline. Here is the fix:`;
  const caption = `${hook}\n\nMost teams spend 8 hours creating content and 8 minutes distributing it.\n\nHere is how to reverse that equation today:\n1. Capture the raw insight immediately from source.\n2. Standardize into a zero-friction delivery payload.\n3. Ship natively across high-yield distribution channels.\n\nSave this for your next sprint. Drop "DELIVERY" below and get our production workflow cheat sheet.`;
  const recommendedPostingTime = 'Tuesday / Thursday 14:30 - 16:00 UTC (Peak Engagement Window)';
  const platformCategory = 'Business / Education & Technology';
  const visualNote = 'High-contrast split visual: Left side showing messy raw notepad draft; Right side showing pristine structured JSON delivery terminal with neon cyan glowing metrics.';

  const cleanMarkdown = `### Catchy Hook
${hook}

### Caption / Description
${caption}

### 5 Highly Targeted Hashtags
${hashtags.join(' ')}

### Recommended Posting Time & Category
- **Optimal Time:** ${recommendedPostingTime}
- **Platform Category:** ${platformCategory}

### Visual / Thumbnail Note
${visualNote}`;

  const payloadObj = {
    platform,
    targetAudience,
    tone,
    hook,
    caption,
    hashtags,
    recommendedPostingTime,
    platformCategory,
    visualNote,
    title: topic.slice(0, 90),
    firstComment: `Read the full breakdown & system architecture here: https://delivery.agent/workflow #Payload`,
    metricoolPayload: {
      postText: `${caption}\n\n${hashtags.join(' ')}`,
      providers: [platform === 'metricool' ? 'all' : platform],
      publishDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16).replace('T', ' '),
      firstCommentText: `Automated via Delivery Agent. Link in bio!`,
      status: 'scheduled',
      mediaNote: visualNote
    },
    cleanMarkdown,
    rawJson: ''
  };
  payloadObj.rawJson = JSON.stringify(payloadObj, null, 2);
  return payloadObj;
}

// API endpoint to transform raw content into platform delivery payload
app.post('/api/generate-payload', async (req, res) => {
  try {
    const {
      topic = '',
      videoTitle = '',
      rawScript = '',
      fileLink = '',
      platform = 'metricool',
      targetAudience = '',
      tone = 'Punchy, engaging, professional',
      outputMode = 'both', // 'json', 'markdown', 'both'
      ctaGoal = 'Engagement & Link Clicks',
      additionalContext = ''
    } = req.body;

    const combinedInput = [
      topic ? `Topic: ${topic}` : '',
      videoTitle ? `Video Title: ${videoTitle}` : '',
      rawScript ? `Raw Script / Transcript:\n${rawScript}` : '',
      fileLink ? `File / Source Link: ${fileLink}` : '',
      additionalContext ? `Context / Constraints: ${additionalContext}` : ''
    ].filter(Boolean).join('\n\n');

    if (!combinedInput.trim()) {
      return res.status(400).json({ error: 'Please provide at least a Topic, Video Title, Raw Script, or File Link.' });
    }

    if (!ai) {
      console.warn('GEMINI_API_KEY missing, using local payload architect fallback');
      const fallback = generateLocalFallback(req.body);
      return res.json({ payload: fallback, fallbackUsed: true });
    }

    const systemInstruction = `You are an Autonomous Digital Content Delivery Agent.
Your sole responsibility is to take raw ideas, video topics, or file transcripts from Platform A and transform them into structured, platform-ready delivery payloads for Platform B (Social Media / Metricool / YouTube).

CRITICAL RULES:
1. Target audience and tone: Punchy, engaging, professional, calibrated to "${tone}".
2. ZERO CONVERSATIONAL FLUFF: Never include conversational phrases (e.g. "Sure, here is your post", "I hope you like it", "Certainly!"). Deliver ONLY the requested structured payload.
3. Deliverables required:
   - Catchy Hook (First 3 seconds / Headline) that stops scroll immediately.
   - Caption / Description (Formatted with clean spacing, line breaks, bullet structures if needed, and clear Call-to-Action).
   - EXACTLY 5 Highly Targeted Hashtags (starting with #, no spaces).
   - Recommended Posting Time / Platform Category (realistic data-backed optimal time window and category for the specified platform).
   - Visual / Thumbnail Note (Short, crystal-clear, high-converting instruction for the graphic designer or AI image generator).
4. Platform tailoring for: "${platform.toUpperCase()}":
   - If "youtube": Deliver YouTube video title, punchy 3s hook, SEO-optimized description with timestamp structure & CTA, 5 tags, YouTube category, and thumbnail concept.
   - If "metricool": Deliver Metricool multi-channel ready payload with clean postText, firstComment, and scheduling guidance.
   - If "linkedin": High-retention headline hook, readable 1-2 line white-spaced paragraphs, professional yet punchy takeaway, 5 targeted hashtags.
   - If "instagram": Visual trigger + audio hook, punchy copy tailored for the "...more" tap, 5 targeted hashtags, aesthetic cover brief.
   - If "twitter": Viral hook tweet with punchy pacing, concise body, 5 hashtags.
   - If "tiktok": First 3 seconds on-screen text + verbal hook, short punchy caption with high-retention CTA, 5 tags.
   - If "omni": Universal cross-platform delivery payload compatible with Metricool and all major socials.
5. All outputs must be 100% ready for instant direct copy-paste or API forwarding without any editing required.`;

    const prompt = `Ingest the following source material and generate the delivery payload:

${combinedInput}

Target Platform: ${platform}
User-Specified Target Audience: ${targetAudience || 'Detect and specify the optimal high-value target audience'}
User-Specified Tone: ${tone}
Goal / CTA: ${ctaGoal}

Provide the output strictly matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            platform: { type: Type.STRING },
            targetAudience: { type: Type.STRING, description: 'Identified target audience' },
            tone: { type: Type.STRING, description: 'Tone applied (Punchy, engaging, professional)' },
            title: { type: Type.STRING, description: 'Optimized title or headline' },
            hook: { type: Type.STRING, description: 'Catchy Hook (First 3 seconds / Headline)' },
            caption: { type: Type.STRING, description: 'Caption / Description with clean spacing and clear CTA' },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 5 highly targeted hashtags'
            },
            recommendedPostingTime: { type: Type.STRING, description: 'Recommended posting time window' },
            platformCategory: { type: Type.STRING, description: 'Platform category' },
            visualNote: { type: Type.STRING, description: 'Visual / Thumbnail Note' },
            firstComment: { type: Type.STRING, description: 'Recommended first comment or link placement note' }
          },
          required: [
            'platform',
            'targetAudience',
            'tone',
            'hook',
            'caption',
            'hashtags',
            'recommendedPostingTime',
            'platformCategory',
            'visualNote'
          ]
        }
      }
    });

    const rawResponseText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(rawResponseText);
    } catch (e) {
      const sanitized = stripConversationalFluff(rawResponseText);
      parsed = JSON.parse(sanitized);
    }

    // Ensure hashtags is strictly 5 items
    let hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];
    if (hashtags.length > 5) {
      hashtags = hashtags.slice(0, 5);
    } else if (hashtags.length < 5) {
      const defaultTags = ['#ContentStrategy', '#DigitalGrowth', '#CreatorEconomy', '#ViralContent', '#DeliveryAgent'];
      while (hashtags.length < 5) {
        hashtags.push(defaultTags[hashtags.length]);
      }
    }
    hashtags = hashtags.map((t: string) => t.startsWith('#') ? t : `#${t.replace(/\s+/g, '')}`);

    // Build pristine Markdown output
    const cleanMarkdown = `### Catchy Hook (First 3s / Headline)
${parsed.hook || ''}

### Caption / Description
${parsed.caption || ''}

### 5 Highly Targeted Hashtags
${hashtags.join(' ')}

### Recommended Posting Time & Category
- **Recommended Posting Time:** ${parsed.recommendedPostingTime || 'Optimal Peak Hours (14:00 - 16:00 Local)'}
- **Platform Category:** ${parsed.platformCategory || 'General'}

### Visual / Thumbnail Note
${parsed.visualNote || ''}`;

    // Metricool compatible payload object
    const metricoolPayload = {
      postText: `${parsed.caption || ''}\n\n${hashtags.join(' ')}`,
      providers: [platform === 'omni' || platform === 'metricool' ? 'all' : platform],
      publishDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16).replace('T', ' '),
      firstCommentText: parsed.firstComment || undefined,
      status: 'scheduled',
      mediaNote: parsed.visualNote,
      targetAudience: parsed.targetAudience,
      meta: {
        agent: 'Payload Autonomous Digital Content Delivery Agent',
        version: '2.0.0',
        timestamp: new Date().toISOString()
      }
    };

    const deliveryPayload = {
      platform: parsed.platform || platform,
      targetAudience: parsed.targetAudience || targetAudience || 'Digital Creators & Business Leads',
      tone: parsed.tone || tone,
      title: parsed.title || topic || 'Content Delivery Payload',
      hook: parsed.hook || '',
      caption: parsed.caption || '',
      hashtags,
      recommendedPostingTime: parsed.recommendedPostingTime || 'Weekdays 14:00 - 16:00 EST',
      platformCategory: parsed.platformCategory || 'Technology / Education',
      visualNote: parsed.visualNote || '',
      firstComment: parsed.firstComment || '',
      metricoolPayload,
      cleanMarkdown,
      rawJson: ''
    };

    deliveryPayload.rawJson = JSON.stringify(
      {
        platform: deliveryPayload.platform,
        targetAudience: deliveryPayload.targetAudience,
        tone: deliveryPayload.tone,
        title: deliveryPayload.title,
        hook: deliveryPayload.hook,
        caption: deliveryPayload.caption,
        hashtags: deliveryPayload.hashtags,
        recommendedPostingTime: deliveryPayload.recommendedPostingTime,
        platformCategory: deliveryPayload.platformCategory,
        visualNote: deliveryPayload.visualNote,
        metricoolReadyPayload: deliveryPayload.metricoolPayload
      },
      null,
      2
    );

    return res.json({ payload: deliveryPayload });
  } catch (error: any) {
    console.error('Error generating payload:', error);
    // Graceful fallback to maintain zero interruptions
    const fallback = generateLocalFallback(req.body);
    return res.json({
      payload: fallback,
      fallbackUsed: true,
      errorNotice: error.message || 'Processed using resilient offline delivery rule engine.'
    });
  }
});

// Simulated Webhook Dispatcher
app.post('/api/dispatch-webhook', async (req, res) => {
  const { webhookUrl, payload, targetPlatform } = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'No payload provided for dispatch.' });
  }

  // If a real external webhook URL is provided, attempt post with timeout
  if (webhookUrl && webhookUrl.startsWith('http')) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Payload-Agent/1.0'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      return res.json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        dispatchedAt: new Date().toISOString(),
        target: webhookUrl
      });
    } catch (e: any) {
      return res.json({
        success: false,
        simulated: false,
        error: `External webhook call failed: ${e.message}`,
        dispatchedAt: new Date().toISOString()
      });
    }
  }

  // Simulated instant webhook dispatch for testing Metricool / Zapier / Make pipelines
  return res.json({
    success: true,
    simulated: true,
    message: `Payload successfully packaged & queued for ${targetPlatform.toUpperCase()} delivery pipeline.`,
    dispatchId: `disp_${Math.random().toString(36).substring(2, 10)}`,
    dispatchedAt: new Date().toISOString(),
    status: 200
  });
});

// Mount Vite or static dist
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Autonomous Content Delivery Agent listening on port ${PORT}`);
  });
}

startServer();
