import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-server';
import { publishPortfolio, unpublishPortfolio } from '@/lib/store';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getServerUser(request);
    const body = await request.json();
    const action = body.action || 'publish';

    if (action === 'publish') {
      const published = publishPortfolio(params.id, user.id);
      if (!published) {
        return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
      }
      return NextResponse.json({
        portfolio: published,
        publicUrl: `/p/${published.publishedSlug}`,
        message: 'Portfolio successfully published!',
      });
    }

    if (action === 'unpublish') {
      const unpublished = unpublishPortfolio(params.id, user.id);
      if (!unpublished) {
        return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
      }
      return NextResponse.json({
        portfolio: unpublished,
        message: 'Portfolio unpublished. It is no longer accessible via public URL.',
      });
    }

    return NextResponse.json({ error: 'Invalid publish action' }, { status: 400 });
  } catch (err: any) {
    const status = err.message?.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Publishing operation failed' }, { status });
  }
}
