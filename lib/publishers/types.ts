export interface PublishResult {
  success: boolean;
  platform: string;
  url?: string;
  error?: string;
  data?: Record<string, unknown>;
}

export interface Publisher {
  name: string;
  publish(post: Record<string, unknown>): Promise<PublishResult>;
  validateConfig(): boolean;
}
