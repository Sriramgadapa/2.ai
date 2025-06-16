import OpenAI from 'openai';

class OpenAIClient {
  private client: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Try to get API key from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (this.apiKey && this.apiKey !== 'your_openai_api_key_here') {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true
      });
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  async generateContent(prompt: string, options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not configured. Please set your API key.');
    }

    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt
    } = options;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    try {
      const completion = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: false
      });

      return completion.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async generateStreamContent(prompt: string, options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    onChunk?: (chunk: string) => void;
  } = {}): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not configured. Please set your API key.');
    }

    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 2000,
      systemPrompt,
      onChunk
    } = options;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    try {
      const stream = await this.client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true
      });

      let fullContent = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          if (onChunk) {
            onChunk(content);
          }
        }
      }

      return fullContent;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }
}

export const openaiClient = new OpenAIClient();