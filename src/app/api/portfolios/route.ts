import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-server';
import { createPortfolio, getUserPortfolios } from '@/lib/store';
import { TemplateId } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = getServerUser(request);
    const portfolios = getUserPortfolios(user.id);
    return NextResponse.json({ portfolios });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list portfolios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getServerUser(request);
    const body = await request.json();
    const template: TemplateId = body.template || 'minimal';
    const title: string | undefined = body.title;

    const newPortfolio = createPortfolio(user.id, template, title);
    return NextResponse.json({ portfolio: newPortfolio }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create portfolio' }, { status: 500 });
  }
}
