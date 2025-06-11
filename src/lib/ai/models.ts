import { AIModel } from '../../types/ai';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model for complex reasoning and creative tasks',
    category: 'language',
    capabilities: ['text-generation', 'reasoning', 'analysis', 'creative-writing'],
    parameters: {
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
      frequencyPenalty: 0.1
    }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Excellent for nuanced writing and complex analysis',
    category: 'language',
    capabilities: ['text-generation', 'analysis', 'creative-writing', 'code-generation'],
    parameters: {
      temperature: 0.6,
      maxTokens: 4096,
      topP: 0.8,
      frequencyPenalty: 0.0
    }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced multimodal AI model',
    category: 'multimodal',
    capabilities: ['text-generation', 'image-analysis', 'reasoning', 'code-generation'],
    parameters: {
      temperature: 0.8,
      maxTokens: 2048,
      topP: 0.95,
      frequencyPenalty: 0.2
    }
  },
  {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'Specialized for creative and narrative content',
    category: 'creative',
    capabilities: ['creative-writing', 'storytelling', 'poetry', 'dialogue'],
    parameters: {
      temperature: 0.9,
      maxTokens: 3000,
      topP: 0.95,
      frequencyPenalty: 0.3
    }
  },
  {
    id: 'analytical-mind',
    name: 'Analytical Mind',
    description: 'Optimized for data analysis and logical reasoning',
    category: 'analytical',
    capabilities: ['analysis', 'reasoning', 'research', 'fact-checking'],
    parameters: {
      temperature: 0.3,
      maxTokens: 2048,
      topP: 0.7,
      frequencyPenalty: 0.0
    }
  }
];

export const TRANSFORMER_ENHANCERS = [
  {
    id: 'tone-optimizer',
    name: 'Tone Optimizer',
    description: 'Adjusts content tone for target audience'
  },
  {
    id: 'seo-enhancer',
    name: 'SEO Enhancer',
    description: 'Optimizes content for search engines'
  },
  {
    id: 'readability-improver',
    name: 'Readability Improver',
    description: 'Enhances text clarity and readability'
  },
  {
    id: 'fact-checker',
    name: 'Fact Checker',
    description: 'Verifies factual accuracy of content'
  },
  {
    id: 'creativity-booster',
    name: 'Creativity Booster',
    description: 'Adds creative elements and unique perspectives'
  },
  {
    id: 'structure-optimizer',
    name: 'Structure Optimizer',
    description: 'Improves content organization and flow'
  }
];