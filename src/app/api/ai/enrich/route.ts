import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, personName, website } = body;

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const prompt = `
      You are an expert SDR (Sales Development Representative).
      Write a short, personalized cold outreach email to ${personName || 'the prospect'} at ${companyName}.
      
      Context:
      - Prospect Company: ${companyName}
      - Website: ${website || 'Not provided'}
      - My Product: Bitscale Data Grid (a high-performance data enrichment tool for GTM teams).
      
      Goal: Book a demo to show how we can help them automate their outbound workflows.
      
      Keep it under 100 words. Be professional but conversational.
      Subject line included as the first line.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const content = completion.choices[0]?.message?.content || 'Failed to generate email.';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI Enrichment Error:', error);
    return NextResponse.json(
      { error: 'Failed to process enrichment request' },
      { status: 500 }
    );
  }
}
