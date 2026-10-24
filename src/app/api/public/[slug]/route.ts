import { NextRequest, NextResponse } from 'next/server';
import { getPublishedPortfolioBySlug } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const result = getPublishedPortfolioBySlug(params.slug);

    if (!result) {
      return NextResponse.json(
        { error: 'Portfolio not found or is currently private' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: result.portfolio.settings.title,
      seoTitle: result.portfolio.settings.seoTitle,
      seoDescription: result.portfolio.settings.seoDescription,
      socialImage: result.portfolio.settings.socialImage,
      slug: result.portfolio.publishedSlug,
      publishedAt: result.portfolio.publishedAt,
      content: result.content,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load public portfolio' }, { status: 500 });
  }
}
