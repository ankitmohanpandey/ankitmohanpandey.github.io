import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Drops the cached Substack feed so a newly published essay shows up
 * immediately instead of waiting out the hourly revalidation window.
 *
 * Two callers are expected:
 *   - the Vercel cron defined in vercel.json (sends the cron secret header)
 *   - a manual curl with ?secret=... when you publish and don't want to wait
 */
export async function GET(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET is not configured' },
      { status: 500 }
    );
  }

  const provided =
    request.nextUrl.searchParams.get('secret') ??
    request.headers.get('authorization')?.replace('Bearer ', '');

  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidateTag('substack', { expire: 0 });
  revalidatePath('/');
  revalidatePath('/blog');

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
