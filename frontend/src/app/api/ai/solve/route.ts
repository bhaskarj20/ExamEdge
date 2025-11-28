// route.ts (Next.js App Router, server-side)
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body should contain: { question: string, context?: string, reasoning?: boolean }
    const { question, context = '', reasoning = false } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Do NOT put your OpenRouter key in client code.
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'Server: OPENROUTER_API_KEY not configured' }, { status: 500 });
    }

    // Build messages (adaptable)
    const messages = [
      {
        role: 'system',
        content:
          "You are a helpful exam-prep assistant. Provide clear step-by-step solutions for problems, explain mistakes, and give short final answer. If the user asks for hints only, provide hints, not full answers."
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nContext: ${context}`
      }
    ];

    // Model & params
    const payload: any = {
      model: "x-ai/grok-4.1-fast:free",      // the model on OpenRouter
      messages,
      max_tokens: 1200,
      temperature: 0.2,
      // enable reasoning tokens if requested (OpenRouter supports reasoning param)
      reasoning: { enabled: Boolean(reasoning) },
    };

    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        // Optional OpenRouter headers (appearance on leaderboards) - remove if unwanted:
        // 'HTTP-Referer': 'https://your-site.com',
        // 'X-Title': 'ExamEdge',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: 'OpenRouter error', detail: errText }, { status: 502 });
    }

    const data = await resp.json();

    // OpenRouter returns choices similar to OpenAI chat completions
    // We'll extract the assistant text safely
    const assistantText =
      data?.choices?.[0]?.message?.content ??
      (typeof data?.choices?.[0]?.delta?.content === 'string' ? data.choices[0].delta.content : null) ??
      null;

    return NextResponse.json({ success: true, raw: data, answer: assistantText });
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error', detail: err.message || String(err) }, { status: 500 });
  }
}
