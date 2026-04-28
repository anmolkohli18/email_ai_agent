# OpenRouter AI Integration

This directory contains the OpenRouter AI integration for email generation functionality.

## Overview

The email generation feature uses **OpenRouter** to access multiple free AI models with automatic fallback. OpenRouter provides access to 300+ language models including free tier models from Google, Meta, Microsoft, and others.

## Files

- **`openrouter.ts`** - Main OpenRouter integration module with email generation functions

## Features

### Dynamic Model Discovery
- Automatically fetches available free models from OpenRouter API
- Caches model list for 1 hour to reduce API calls
- Falls back to hardcoded list if API is unavailable

### Intelligent Fallback System
- Tries multiple free models automatically if one fails
- Handles rate limiting gracefully
- Prioritizes models by context length (larger first)

### Email Generation Functions

1. **`generateEmailContent(input)`** - Generate new email content
2. **`refineEmailContent(subject, body, instructions)`** - Refine existing emails

## Setup

### 1. Get OpenRouter API Key
Visit https://openrouter.ai/settings/keys and create a free account to get your API key.

### 2. Add to Environment Variables
Add to `.env.local`:
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 3. Configure App URL (optional)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Free Models

The system automatically discovers free models. Current fallback models include:
- `google/gemma-2-9b-it:free` - Google's Gemma 2 (9B parameters)
- `meta-llama/llama-3.2-3b-instruct:free` - Meta's Llama 3.2 (3B)
- `meta-llama/llama-3.2-1b-instruct:free` - Meta's Llama 3.2 (1B)
- `qwen/qwen-2-7b-instruct:free` - Alibaba's Qwen 2
- `microsoft/phi-3-mini-128k-instruct:free` - Microsoft's Phi-3

## Usage Example

```typescript
import { generateEmailContent } from '@/lib/ai/openrouter';

const result = await generateEmailContent({
  purpose: 'Product launch announcement',
  tone: 'professional',
  productDetails: 'New AI-powered analytics platform',
  targetAudience: 'Tech-savvy business owners',
  callToAction: 'Sign up for early access',
  includePersonalization: true,
});

console.log(result.subject);
console.log(result.body);
console.log(result.placeholders); // ['firstName', 'company', ...]
```

## Error Handling

The module includes comprehensive error handling:
- **Rate Limiting**: Automatically tries next model
- **Model Unavailable**: Falls back to other free models
- **API Errors**: Returns descriptive error messages
- **Network Issues**: Graceful degradation

## API Endpoints

The following Next.js API routes use this module:
- `/api/generate-email` - Generate new email
- `/api/refine-email` - Refine existing email

## Benefits of OpenRouter

1. **No Cost** - Uses only free models
2. **High Availability** - Multiple fallback models
3. **Latest Models** - Access to newest free AI models
4. **Unified API** - Single API for multiple providers
5. **Rate Limit Handling** - Automatic fallback on 429 errors

## Monitoring

The module logs:
- Model selection and fallback attempts
- Rate limiting occurrences
- API errors with full details
- Cache hits/misses for model list

## Performance

- **Model List Caching**: 1-hour TTL reduces API calls
- **JSON Response Format**: Enforced for reliable parsing
- **Max Tokens**: 1500 tokens for balanced speed/quality
- **Temperature**: 0.7 for creative but consistent output

## Security

- API keys stored in environment variables only
- HTTP-Referer header includes app URL
- No API keys exposed to client
- Server-side only execution

## Resources

- OpenRouter Docs: https://openrouter.ai/docs
- Models API: https://openrouter.ai/api/v1/models
- Browse Models: https://openrouter.ai/models
- Get API Key: https://openrouter.ai/settings/keys
