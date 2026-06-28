import { Publisher, PublishResult } from './types';
import { withRetry } from '../utils/retry';
import { createLogger } from '../utils/logger';

export class BeehiivPublisher implements Publisher {
  name = 'Beehiiv';
  private apiKey: string;
  private publicationId: string;
  private logger = createLogger('BeehiivPublisher');

  constructor() {
    this.apiKey = process.env.BEEHIIV_API_KEY || '';
    this.publicationId = process.env.BEEHIIV_PUBLICATION_ID || '';
  }

  validateConfig(): boolean {
    return !!(this.apiKey && this.publicationId);
  }

  async publish(post: Record<string, unknown>): Promise<PublishResult> {
    this.logger.info('Starting publish process', { slug: post.slug });

    if (!this.validateConfig()) {
      this.logger.error('Configuration validation failed');
      return {
        success: false,
        platform: this.name,
        error: 'Beehiiv API key or publication ID not configured',
      };
    }

    try {
      const frontmatter = post.frontmatter as Record<string, unknown>;
      const slug = post.slug as string;
      const content = post.content as string;

      const subject = `${frontmatter.title as string} - New Article`;
      const previewText = (frontmatter.description as string).substring(0, 150);
      
      const articleContent = `
        <h2>${frontmatter.title as string}</h2>
        <p>${frontmatter.description as string}</p>
        <p><a href="https://ankitmohanpandey.in/blog/${slug}">Read the full article</a></p>
        <hr>
        ${content}
      `;

      const response = await withRetry(
        () => fetch(
          `https://api.beehiiv.com/v2/publications/${this.publicationId}/posts`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
              subject,
              preview_text: previewText,
              content: articleContent,
              publish: true,
            }),
          }
        ),
        3,
        1000
      );

      const result = await response.json();

      if (!response.ok) {
        this.logger.error('Publish failed', { result });
        return {
          success: false,
          platform: this.name,
          error: result.error || 'Failed to publish to Beehiiv',
        };
      }

      this.logger.info('Publish successful');
      return {
        success: true,
        platform: this.name,
        data: result,
      };
    } catch (error) {
      this.logger.error('Publish error', { error });
      return {
        success: false,
        platform: this.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
