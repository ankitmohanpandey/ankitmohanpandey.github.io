import { Publisher } from './types';
import { HashnodePublisher } from './hashnode';
import { BeehiivPublisher } from './beehiiv';

export const publishers: Publisher[] = [
  new HashnodePublisher(),
  new BeehiivPublisher(),
];

export async function publishToAllPlatforms(post: Record<string, unknown>) {
  const results = [];

  for (const publisher of publishers) {
    try {
      const result = await publisher.publish(post);
      results.push(result);
      
      if (!result.success) {
        console.error(`Failed to publish to ${publisher.name}:`, result.error);
      }
    } catch (error) {
      console.error(`Error publishing to ${publisher.name}:`, error);
      results.push({
        success: false,
        platform: publisher.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}
