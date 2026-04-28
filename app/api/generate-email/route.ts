import { NextRequest, NextResponse } from 'next/server';
import { generateEmailContent, EmailGenerationInput } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const body: EmailGenerationInput = await request.json();

    // Validate required fields
    if (!body.purpose || !body.tone) {
      return NextResponse.json(
        { error: 'Missing required fields: purpose and tone' },
        { status: 400 }
      );
    }

    const result = await generateEmailContent(body);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in generate-email API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate email' },
      { status: 500 }
    );
  }
}
