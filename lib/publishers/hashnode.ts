import { Publisher, PublishResult } from './types';
import { withRetry } from '../utils/retry';
import { createLogger } from '../utils/logger';

export class HashnodePublisher implements Publisher {
  name = 'Hashnode';
  private apiKey: string;
  private publicationId: string;
  private logger = createLogger('HashnodePublisher');

  constructor() {
    this.apiKey = process.env.HASHNODE_API_KEY || '';
    this.publicationId = process.env.HASHNODE_PUBLICATION_ID || '';
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
        error: 'Hashnode API key or publication ID not configured',
      };
    }

    try {
      const frontmatter = post.frontmatter as Record<string, unknown>;
      const slug = post.slug as string;
      const content = post.content as string;

      const mutation = `
        mutation CreatePublicationStory($input: CreatePublicationStoryInput!) {
          createPublicationStory(input: $input) {
            success
            message
            post {
              slug
              url
              cuid
            }
          }
        }
      `;

      const variables = {
        input: {
          publicationId: this.publicationId,
          title: frontmatter.title as string,
          contentMarkdown: content,
          coverImageURL: frontmatter.coverImage as string | undefined,
          tags: (frontmatter.tags as string[]).map((tag: string) => ({ name: tag })),
          canonicalUrl: `https://ankitmohanpandey.in/blog/${slug}`,
          meta: {
            title: frontmatter.title as string,
            description: frontmatter.description as string,
          },
        },
      };

      const response = await withRetry(
        () => fetch('https://gql.hashnode.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: this.apiKey,
          },
          body: JSON.stringify({ query: mutation, variables }),
        }),
        3,
        1000
      );

      const result = await response.json();

      if (result.errors) {
        this.logger.error('Publish failed', { errors: result.errors });
        return {
          success: false,
          platform: this.name,
          error: result.errors[0].message,
        };
      }

      this.logger.info('Publish successful', { url: result.data.createPublicationStory.post.url });
      return {
        success: true,
        platform: this.name,
        url: result.data.createPublicationStory.post.url,
        data: result.data.createPublicationStory.post,
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
