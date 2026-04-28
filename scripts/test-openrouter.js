#!/usr/bin/env node

/**
 * Test script for OpenRouter email generation
 * Run with: node scripts/test-openrouter.js
 * 
 * Note: Make sure OPENROUTER_API_KEY is set in your environment
 */

const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

async function testEmailGeneration() {
  console.log('🧪 Testing OpenRouter Email Generation\n');

  // Verify API key is set
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENROUTER_API_KEY not found in environment');
    process.exit(1);
  }
  console.log('✅ OpenRouter API key found\n');

  try {
    // Test 1: Fetch available free models
    console.log('📋 Test 1: Fetching available free models...');
    const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    if (!modelsResponse.ok) {
      throw new Error(`Models API failed: ${modelsResponse.status}`);
    }

    const modelsData = await modelsResponse.json();
    const freeModels = modelsData.data
      .filter(m => parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0)
      .slice(0, 5);

    console.log(`✅ Found ${freeModels.length} free models (showing first 5):`);
    freeModels.forEach(m => {
      console.log(`   - ${m.id} (context: ${m.context_length})`);
    });

    if (freeModels.length === 0) {
      console.warn('⚠️  No free models found, will use fallback list\n');
    } else {
      console.log('');
    }

    // Test 2: Generate a test email
    console.log('📧 Test 2: Generating test email...');
    const testModel = freeModels[0]?.id || 'google/gemma-2-9b-it:free';
    
    const emailResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Email Agent Test',
      },
      body: JSON.stringify({
        model: testModel,
        messages: [
          {
            role: 'system',
            content: 'You are an expert email copywriter. Generate professional email content. Return a JSON object with "subject", "body", and "placeholders" array.',
          },
          {
            role: 'user',
            content: 'Generate a friendly email for a product launch announcement. Include personalization placeholders.',
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      throw new Error(`Email generation failed: ${JSON.stringify(errorData, null, 2)}`);
    }

    const emailData = await emailResponse.json();
    const content = emailData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content received');
    }

    const result = JSON.parse(content);
    
    console.log(`✅ Email generated successfully with model: ${testModel}`);
    console.log(`\n📨 Generated Email:\n`);
    console.log(`Subject: ${result.subject}`);
    console.log(`\nBody:\n${result.body}`);
    console.log(`\nPlaceholders: ${JSON.stringify(result.placeholders || [])}`);
    console.log('\n✅ All tests passed! OpenRouter integration is working correctly.\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testEmailGeneration();
