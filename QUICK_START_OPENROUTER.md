# Quick Start: OpenRouter Email Generation

## ✅ Setup Complete

Your email generation feature now uses **OpenRouter with free models only**.

## What Changed?

1. **Old**: Used OpenAI (requires paid API key)
2. **New**: Uses OpenRouter (free models available)

## Configuration

Your `.env.local` already has the required API key:
```env
OPENROUTER_API_KEY=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
```

## Test It

Run the test script to verify everything works:
```bash
node scripts/test-openrouter.js
```

## How It Works

### Automatic Model Selection
The system automatically:
1. Fetches available free models from OpenRouter
2. Tries models in order (best first)
3. Falls back if a model is rate-limited
4. Uses hardcoded models if API is unavailable

### Current Free Models
- inclusionai/ling-2.6-1t:free (262k context)
- tencent/hy3-preview:free (262k context)
- google/gemma-4-26b-a4b-it:free (262k context)
- And more...

## Use in Your App

### Generate Email
```typescript
// In your components or API routes
import { generateEmailContent } from '@/lib/ai/openrouter';

const result = await generateEmailContent({
  purpose: 'Product launch announcement',
  tone: 'friendly',
  productDetails: 'AI-powered analytics platform',
  targetAudience: 'Tech-savvy business owners',
  callToAction: 'Sign up for early access',
  includePersonalization: true,
});

// Result includes:
// - result.subject: Email subject line
// - result.body: Email body with {{placeholders}}
// - result.placeholders: Array of placeholder names
```

### Refine Email
```typescript
import { refineEmailContent } from '@/lib/ai/openrouter';

const refined = await refineEmailContent(
  currentSubject,
  currentBody,
  'Make it more casual and add urgency'
);
```

## API Endpoints

### POST /api/generate-email
```json
{
  "purpose": "Product launch",
  "tone": "friendly",
  "productDetails": "New AI tool",
  "targetAudience": "Developers",
  "callToAction": "Try it now",
  "includePersonalization": true
}
```

Response:
```json
{
  "subject": "🚀 Introducing [ProductName]",
  "body": "Hi {{firstName}}, ...",
  "placeholders": ["firstName", "company"]
}
```

### POST /api/refine-email
```json
{
  "currentSubject": "Subject",
  "currentBody": "Body text",
  "instructions": "Make it shorter"
}
```

## Error Handling

The system handles:
- ✅ Rate limiting (429) - Automatic fallback
- ✅ Model unavailable - Try next model
- ✅ Network errors - Descriptive messages
- ✅ Invalid responses - Validation checks

## Monitoring

Check logs for:
- Model selection: Which model was used
- Fallback attempts: When rate limited
- Errors: Full error details with model info

## Benefits

1. **Zero Cost** - No charges for API calls
2. **High Availability** - Multiple fallback models
3. **Latest Models** - Automatically discovers new free models
4. **Rate Limit Resilience** - Handles 429 errors gracefully
5. **Simple Migration** - Drop-in replacement

## Need Help?

- 📚 Full documentation: `lib/ai/README.md`
- 📝 Migration details: `OPENROUTER_MIGRATION.md`
- 🧪 Test script: `scripts/test-openrouter.js`
- 🌐 OpenRouter Dashboard: https://openrouter.ai/dashboard

## What's Next?

Your email generation is ready to use! The feature will:
- Automatically select the best available free model
- Fall back if rate limited
- Cache model list to reduce API calls
- Handle errors gracefully

Just use the existing UI - everything works the same, but now with free OpenRouter models instead of paid OpenAI.
