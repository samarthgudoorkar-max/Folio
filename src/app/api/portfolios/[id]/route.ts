import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from '@/lib/auth-server';
import { deletePortfolio, duplicatePortfolio, getPortfolioById, updatePortfolioDraft } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getServerUser(request);
    const portfolio = getPortfolioById(params.id, user.id);

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getServerUser(request);
    const body = await request.json();
    const { draftData, settings } = body;

    if (!draftData) {
      return NextResponse.json({ error: 'Missing draftData' }, { status: 400 });
    }

    const updated = updatePortfolioDraft(params.id, user.id, draftData, settings);
    if (!updated) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolio: updated });
  } catch (err: any) {
    const status = err.message?.includes('Forbidden') ? 403 : 400;
    return NextResponse.json({ error: err.message || 'Failed to update portfolio' }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getServerUser(request);
    const success = deletePortfolio(params.id, user.id);

    if (!success) {
      return NextResponse.json({ error: 'Portfolio not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    const status = err.message?.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to delete portfolio' }, { status });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getServerUser(request);
    const body = await request.json();

    if (body.action === 'duplicate') {
      const duplicated = duplicatePortfolio(params.id, user.id);
      if (!duplicated) {
        return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
      }
      return NextResponse.json({ portfolio: duplicated }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    const status = err.message?.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: err.message || 'Failed to process request' }, { status });
  }
}
