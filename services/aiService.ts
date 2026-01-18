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

const FALLBACK_MESSAGES = {
  offline: "I can't connect right now. Please check your internet connection and try again.",
  apiError: "I'm having trouble responding right now. Please try again in a moment.",
  noApiKey: "The app isn't fully configured yet. Please contact support.",
};

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

export function isAIConfigured(): boolean {
  return Boolean(OPENAI_API_KEY && OPENAI_API_KEY.length > 10);
}

async function makeOpenAIRequest(
  messages: { role: string; content: string }[],
  maxTokens: number = 1000
): Promise<string> {
  if (!isAIConfigured()) {
    throw new Error(FALLBACK_MESSAGES.noApiKey);
  }

  let response: Response;
  
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
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
  } catch (networkError) {
    console.error('Network error:', networkError);
    throw new Error(FALLBACK_MESSAGES.offline);
  }

  if (!response.ok) {
    let errorMessage = 'Failed to get response';
    try {
      const error = await response.json();
      errorMessage = error.error?.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    
    console.error('OpenAI API Error:', errorMessage);
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      throw new Error('Service temporarily unavailable. Please try again later.');
    }
    if (errorMessage.includes('invalid_api_key') || errorMessage.includes('Incorrect API key')) {
      throw new Error(FALLBACK_MESSAGES.noApiKey);
    }
    
    throw new Error(FALLBACK_MESSAGES.apiError);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(FALLBACK_MESSAGES.apiError);
  }
  
  return data.choices?.[0]?.message?.content || '';
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
    if (error instanceof Error) {
      return error.message;
    }
    return FALLBACK_MESSAGES.apiError;
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
    
    let title = result.trim();
    title = title.replace(/^["']|["']$/g, '');
    title = title.replace(/[.!?]$/, '');
    
    return title || 'New Chat';
  } catch (error) {
    console.error('Title Generation Error:', error);
    return 'New Chat';
  }
}
