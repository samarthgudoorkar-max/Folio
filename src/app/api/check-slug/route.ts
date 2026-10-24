import { NextRequest, NextResponse } from 'next/server';
import { isSlugAvailable } from '@/lib/store';
import { validateSlug } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');
  const currentId = searchParams.get('currentId') || undefined;

  if (!slug) {
    return NextResponse.json({ available: false, error: 'Slug is required' }, { status: 400 });
  }

  const formatValidation = validateSlug(slug);
  if (!formatValidation.valid) {
    return NextResponse.json({
      available: false,
      error: formatValidation.error,
    });
  }

  const available = isSlugAvailable(slug, currentId);
  return NextResponse.json({
    available,
    error: available ? undefined : 'This URL slug is already taken. Please pick another one.',
  });
}
