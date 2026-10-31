export type PlatformType =
  | 'metricool'
  | 'youtube'
  | 'linkedin'
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'omni';

export interface DeliveryPayload {
  platform: PlatformType | string;
  targetAudience: string;
  tone: string;
  title?: string;
  hook: string; // Catchy Hook (First 3 seconds / Headline)
  caption: string; // Formatted with clean spacing, line breaks, and clear Call-to-Action
  hashtags: string[]; // Exactly 5 highly targeted hashtags
  recommendedPostingTime: string; // Recommended Posting Time
  platformCategory: string; // Platform Category
  visualNote: string; // Visual / Thumbnail Note (Short instruction for the graphic)
  firstComment?: string;
  metricoolPayload?: {
    postText: string;
    providers: string[];
    publishDate: string;
    firstCommentText?: string;
    status: string;
    mediaNote?: string;
    meta?: Record<string, any>;
  };
  cleanMarkdown: string;
  rawJson: string;
  timestamp?: number;
  id?: string;
}

export interface IngestionInput {
  topic: string;
  videoTitle: string;
  rawScript: string;
  fileLink: string;
  platform: PlatformType;
  targetAudience: string;
  tone: string;
  ctaGoal: string;
  additionalContext: string;
}

export interface WebhookDispatchResult {
  success: boolean;
  simulated?: boolean;
  message?: string;
  error?: string;
  dispatchId?: string;
  dispatchedAt: string;
  target?: string;
}
