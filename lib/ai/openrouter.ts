// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODELS_API = 'https://openrouter.ai/api/v1/models';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Cache for available free models
let cachedFreeModels: string[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 3600000; // 1 hour

// Hardcoded fallback models (if API fetch fails)
const FALLBACK_FREE_MODELS = [
  'google/gemma-2-9b-it:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'meta-llama/llama-3.2-1b-instruct:free',
  'qwen/qwen-2-7b-instruct:free',
  'microsoft/phi-3-mini-128k-instruct:free',
];

export interface EmailGenerationInput {
  purpose: string;
  tone: 'formal' | 'casual' | 'persuasive' | 'friendly';
  productDetails?: string;
  targetAudience?: string;
  callToAction?: string;
  additionalInstructions?: string;
  includePersonalization?: boolean;
}

export interface EmailGenerationOutput {
  subject: string;
  body: string;
  placeholders: string[];
}

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
}

/**
 * Fetch available free models from OpenRouter API
 */
async function fetchFreeModels(): Promise<string[]> {
  // Return cached models if still valid
  const now = Date.now();
  if (cachedFreeModels && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedFreeModels;
  }

  try {
    const response = await fetch(OPENROUTER_MODELS_API, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();
    const models: OpenRouterModel[] = data.data || [];

    // Filter for free models (pricing.prompt === "0")
    const freeModels = models
      .filter((m) => parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0)
      .sort((a, b) => b.context_length - a.context_length) // Sort by context length (larger first)
      .map((m) => m.id);

    if (freeModels.length === 0) {
      console.warn('No free models found, using fallback list');
      return FALLBACK_FREE_MODELS;
    }

    // Cache the results
    cachedFreeModels = freeModels;
    cacheTimestamp = now;

    return freeModels;
  } catch (error) {
    console.error('Error fetching free models:', error);
    return FALLBACK_FREE_MODELS;
  }
}

/**
 * Generate email content using OpenRouter with automatic model fallback
 */
export async function generateEmailContent(
  input: EmailGenerationInput
): Promise<EmailGenerationOutput> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const freeModels = await fetchFreeModels();
  let lastError: any = null;

  // Try each model in the fallback chain
  for (let i = 0; i < freeModels.length; i++) {
    const model = freeModels[i];
    
    try {
      const prompt = buildPrompt(input);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': APP_URL,
          'X-Title': 'Email Agent',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: `You are an expert email copywriter. Generate professional, engaging email content that converts. Always include placeholders for personalization using {{placeholder}} syntax (e.g., {{firstName}}, {{lastName}}, {{company}}). Return a JSON object with "subject", "body", and "placeholders" array.`,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: any = new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.error = errorData.error;
        throw error;
      }

      const data = await response.json();
      const responseContent = data.choices?.[0]?.message?.content;

      if (!responseContent) {
        throw new Error('No response content from model');
      }

      const result = JSON.parse(responseContent);

      // Validate response structure
      if (!result.subject || !result.body) {
        throw new Error('Invalid response format from model');
      }

      return {
        subject: result.subject,
        body: result.body,
        placeholders: result.placeholders || [],
      };
    } catch (error: any) {
      lastError = error;

      // Log the attempt
      console.log(`Model ${model} failed (${i + 1}/${freeModels.length}):`, error.message);

      // If it's a rate limit error (429) and we have more models to try, continue
      if (error.status === 429 && i < freeModels.length - 1) {
        console.log('Rate limited, trying next model...');
        continue;
      }

      // If it's not a rate limit error and we have more models, still try next one
      if (i < freeModels.length - 1) {
        console.log('Error with model, trying next fallback...');
        continue;
      }

      // This was the last model, throw
      break;
    }
  }

  // If all models failed, throw a descriptive error
  console.error('All models failed. Last error:', lastError);
  
  const errorMessage = lastError?.error?.message || lastError?.message;
  throw new Error(
    errorMessage || 'All models are temporarily unavailable. Please try again in a few minutes.'
  );
}

/**
 * Build the prompt for email generation
 */
function buildPrompt(input: EmailGenerationInput): string {
  let prompt = `Generate a ${input.tone} email for ${input.purpose}.\n\n`;

  if (input.productDetails) {
    prompt += `Product/Service Details:\n${input.productDetails}\n\n`;
  }

  if (input.targetAudience) {
    prompt += `Target Audience:\n${input.targetAudience}\n\n`;
  }

  if (input.callToAction) {
    prompt += `Call to Action:\n${input.callToAction}\n\n`;
  }

  if (input.includePersonalization) {
    prompt += `Requirements:
- Include personalization placeholders like {{firstName}}, {{lastName}}, {{company}}
- Make the email feel personal and relevant
- Use the placeholders naturally in the text
`;
  }

  if (input.additionalInstructions) {
    prompt += `\nAdditional Instructions:\n${input.additionalInstructions}\n`;
  }

  prompt += `\nReturn the response as a JSON object with:
- subject: The email subject line
- body: The email body (can include HTML tags for formatting)
- placeholders: Array of placeholder names used (e.g., ["firstName", "company"])`;

  return prompt;
}

/**
 * Refine existing email content with fallback support
 */
export async function refineEmailContent(
  currentSubject: string,
  currentBody: string,
  instructions: string
): Promise<EmailGenerationOutput> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const freeModels = await fetchFreeModels();
  let lastError: any = null;

  // Try each model in the fallback chain
  for (let i = 0; i < freeModels.length; i++) {
    const model = freeModels[i];

    try {
      const prompt = `Current Email:
Subject: ${currentSubject}
Body: ${currentBody}

Refinement Instructions:
${instructions}

Please refine the email while maintaining any existing {{placeholders}}. Return as JSON with subject, body, and placeholders array.`;

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': APP_URL,
          'X-Title': 'Email Agent',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert email copywriter. Refine the email according to the instructions while keeping the same placeholders. Return JSON format with subject, body, and placeholders array.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: any = new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.error = errorData.error;
        throw error;
      }

      const data = await response.json();
      const responseContent = data.choices?.[0]?.message?.content;

      if (!responseContent) {
        throw new Error('No response content from model');
      }

      const result = JSON.parse(responseContent);

      return {
        subject: result.subject || currentSubject,
        body: result.body || currentBody,
        placeholders: result.placeholders || [],
      };
    } catch (error: any) {
      lastError = error;

      console.log(`Model ${model} failed (${i + 1}/${freeModels.length}):`, error.message);

      // If it's a rate limit error (429) and we have more models to try, continue
      if (error.status === 429 && i < freeModels.length - 1) {
        console.log('Rate limited, trying next model...');
        continue;
      }

      // If we have more models to try, continue
      if (i < freeModels.length - 1) {
        console.log('Error with model, trying next fallback...');
        continue;
      }

      break;
    }
  }

  console.error('All models failed. Last error:', lastError);
  
  const errorMessage = lastError?.error?.message || lastError?.message;
  throw new Error(
    errorMessage || 'All models are temporarily unavailable. Please try again in a few minutes.'
  );
}
