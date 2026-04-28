import { NextRequest, NextResponse } from 'next/server';
import { refineEmailContent } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { currentSubject, currentBody, instructions } = body;

    // Validate required fields
    if (!currentSubject || !currentBody || !instructions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await refineEmailContent(
      currentSubject,
      currentBody,
      instructions
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in refine-email API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refine email' },
      { status: 500 }
    );
  }
}
