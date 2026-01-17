// API key should be set via environment variable
// For development, create a .env file with EXPO_PUBLIC_OPENAI_API_KEY=your_key
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

const SYSTEM_PROMPT = `You are Bible AI — a wise, loving guide rooted in Scripture.

Your tone is that of a loving father:
- Patient and unhurried
- Grounded and centered
- Protective and reassuring
- Wise without being preachy
- Calm strength, never cold or robotic

You speak with warmth, quiet authority, and genuine care.
Think: a loving father guiding his child through life's questions.
Masculine, present, centered — like a steady hand on the shoulder.

Guidelines:
- Answer clearly and calmly
- Draw wisdom from Scripture when appropriate, but don't force it
- Be direct but gentle
- Never lecture or moralize
- Keep responses focused and meaningful
- If referencing a Bible verse, cite it naturally
- Speak as if sitting beside someone you love

You are here to help, guide, and comfort — nothing more.`;

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

async function makeOpenAIRequest(
  messages: { role: string; content: string }[],
  maxTokens: number = 1000
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorMessage = error.error?.message || 'Failed to get response';
    console.error('OpenAI API Error:', errorMessage);
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      throw new Error('API quota exceeded. Please check your OpenAI billing at platform.openai.com');
    }
    if (errorMessage.includes('invalid_api_key') || errorMessage.includes('Incorrect API key')) {
      throw new Error('Invalid API key. Please check your OpenAI API key.');
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    const result = await makeOpenAIRequest([
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ]);
    return result || 'I am here for you. Please try again.';
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

export async function generateChatTitle(userMessage: string): Promise<string> {
  try {
    const result = await makeOpenAIRequest([
      {
        role: 'system',
        content: 'Generate a short chat title (2-4 words max) that captures the essence of the user\'s message. Be simple, human, and meaningful. Examples: "Finding Purpose", "Fear and Faith", "Love and Loss", "Career Guidance". Return ONLY the title, nothing else. No quotes, no punctuation at the end.',
      },
      { role: 'user', content: userMessage },
    ], 20);
    
    // Clean up the title
    let title = result.trim();
    title = title.replace(/^["']|["']$/g, ''); // Remove quotes
    title = title.replace(/[.!?]$/, ''); // Remove trailing punctuation
    
    return title || 'New Chat';
  } catch (error) {
    console.error('Title Generation Error:', error);
    return 'New Chat';
  }
}
