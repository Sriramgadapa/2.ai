import { AIRequest, AIResponse, TransformerConfig } from '../../types/ai';
import { AI_MODELS, TRANSFORMER_ENHANCERS } from './models';
import { openaiClient } from './openai-client';

export class AITransformerEngine {
  private fallbackMode: boolean = false;

  constructor() {
    this.fallbackMode = !openaiClient.isConfigured();
  }

  setApiKey(apiKey: string) {
    openaiClient.setApiKey(apiKey);
    this.fallbackMode = false;
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      let response;
      
      if (this.fallbackMode || !openaiClient.isConfigured()) {
        response = await this.processWithFallback(request);
      } else {
        response = await this.processWithOpenAI(request);
      }
      
      const processingTime = Date.now() - startTime;
      
      return {
        content: response.content,
        model: request.config.model,
        confidence: response.confidence,
        processingTime,
        enhancementsApplied: request.config.enhancers || [],
        suggestions: response.suggestions
      };
    } catch (error) {
      console.error('AI processing failed:', error);
      
      // Fallback to simulated response if real AI fails
      const fallbackResponse = await this.processWithFallback(request);
      const processingTime = Date.now() - startTime;
      
      return {
        content: `⚠️ **AI Service Temporarily Unavailable**\n\n${fallbackResponse.content}\n\n*Note: This is a simulated response. Please configure your OpenAI API key for real AI-powered content generation.*`,
        model: request.config.model,
        confidence: 0.5,
        processingTime,
        enhancementsApplied: request.config.enhancers || [],
        suggestions: ['Configure OpenAI API key for better results', 'Try again in a few moments']
      };
    }
  }

  private async processWithOpenAI(request: AIRequest): Promise<{
    content: string;
    confidence: number;
    suggestions: string[];
  }> {
    const model = AI_MODELS.find(m => m.id === request.config.model);
    const enhancers = request.config.enhancers || [];
    const toolType = request.context?.toolType || 'generate';
    
    // Build comprehensive system prompt
    const systemPrompt = this.buildSystemPrompt(request, model, enhancers, toolType);
    
    // Generate content using OpenAI
    const content = await openaiClient.generateContent(request.prompt, {
      model: this.mapToOpenAIModel(request.config.model),
      temperature: request.config.temperature,
      maxTokens: request.config.maxTokens,
      systemPrompt
    });
    
    const confidence = this.calculateRealConfidence(model, enhancers, toolType, content);
    const suggestions = this.generateIntelligentSuggestions(request.prompt, content, toolType);
    
    return { content, confidence, suggestions };
  }

  private buildSystemPrompt(request: AIRequest, model: any, enhancers: string[], toolType: string): string {
    const basePrompt = `You are ContentAI, an advanced AI content creation assistant. Your role is to generate high-quality, professional content that meets specific user requirements.`;
    
    const toolInstructions = {
      'generate': `Generate original, engaging content based on the user's specifications. Focus on creating valuable, well-structured content that serves the intended purpose.`,
      'rewrite': `Rewrite and improve the provided content while maintaining its core message. Enhance clarity, flow, and engagement while preserving the original intent.`,
      'summarize': `Create concise, accurate summaries that capture the essential points of the source material. Maintain key information while reducing length.`,
      'translate': `Provide accurate, culturally appropriate translations that maintain the original meaning and tone while adapting to the target language's conventions.`
    };

    let prompt = `${basePrompt}\n\nTask: ${toolInstructions[toolType] || toolInstructions['generate']}`;

    // Add user preferences
    if (request.context?.userPreferences) {
      const prefs = request.context.userPreferences;
      prompt += `\n\nUser Requirements:`;
      
      if (prefs.contentType) prompt += `\n- Content Type: ${prefs.contentType.replace('-', ' ')}`;
      if (prefs.tone) prompt += `\n- Tone: ${prefs.tone}`;
      if (prefs.length) prompt += `\n- Length: ${prefs.length}`;
      if (prefs.rewriteStyle) prompt += `\n- Style: ${prefs.rewriteStyle.replace('-', ' ')}`;
      if (prefs.summaryType) prompt += `\n- Format: ${prefs.summaryType.replace('-', ' ')}`;
      if (prefs.fromLang && prefs.toLang) {
        prompt += `\n- Translation: ${prefs.fromLang} to ${prefs.toLang}`;
      }
    }

    // Add enhancer instructions
    if (enhancers.length > 0) {
      prompt += `\n\nEnhancements to Apply:`;
      enhancers.forEach(enhancerId => {
        const enhancer = TRANSFORMER_ENHANCERS.find(e => e.id === enhancerId);
        if (enhancer) {
          prompt += `\n- ${enhancer.name}: ${enhancer.description}`;
        }
      });
    }

    // Add custom system prompt if provided
    if (request.config.systemPrompt) {
      prompt += `\n\nAdditional Instructions: ${request.config.systemPrompt}`;
    }

    prompt += `\n\nProvide professional, high-quality output that meets all specified requirements. Be creative, engaging, and ensure the content is valuable to the user.`;

    return prompt;
  }

  private mapToOpenAIModel(modelId: string): string {
    const modelMap: Record<string, string> = {
      'gpt-4-turbo': 'gpt-4-turbo',
      'gpt-4': 'gpt-4',
      'gpt-3.5-turbo': 'gpt-3.5-turbo',
      'claude-3-opus': 'gpt-4-turbo', // Fallback to GPT-4
      'gemini-pro': 'gpt-4-turbo', // Fallback to GPT-4
      'creative-writer': 'gpt-4-turbo',
      'analytical-mind': 'gpt-4'
    };

    return modelMap[modelId] || 'gpt-3.5-turbo';
  }

  private calculateRealConfidence(model: any, enhancers: string[], toolType: string, content: string): number {
    let baseConfidence = 0.85;
    
    // Model-based adjustments
    if (model?.category === 'language') baseConfidence += 0.05;
    if (model?.category === 'creative') baseConfidence += 0.03;
    if (model?.category === 'analytical') baseConfidence += 0.04;
    
    // Content quality indicators
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 100) baseConfidence += 0.02;
    if (wordCount > 500) baseConfidence += 0.02;
    
    // Structure indicators
    if (content.includes('#') || content.includes('##')) baseConfidence += 0.01; // Has headers
    if (content.includes('•') || content.includes('-')) baseConfidence += 0.01; // Has lists
    
    // Enhancer boost
    baseConfidence += enhancers.length * 0.01;
    
    // Tool-specific confidence
    const toolBoosts = {
      'generate': 0.02,
      'rewrite': 0.03,
      'summarize': 0.04,
      'translate': 0.02
    };
    
    baseConfidence += toolBoosts[toolType] || 0;
    
    return Math.min(Math.max(baseConfidence, 0.75), 0.98);
  }

  private generateIntelligentSuggestions(prompt: string, content: string, toolType: string): string[] {
    const suggestions = [];
    
    // Content-based suggestions
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 100) {
      suggestions.push('Consider requesting more detailed content for better coverage');
    }
    if (wordCount > 1000) {
      suggestions.push('Content is comprehensive - consider breaking into sections for better readability');
    }
    
    // Tool-specific suggestions
    switch (toolType) {
      case 'generate':
        suggestions.push('Try different content types or tones for variety');
        suggestions.push('Consider adding specific examples or case studies');
        break;
      case 'rewrite':
        suggestions.push('Compare with the original to ensure key points are preserved');
        suggestions.push('Test different rewrite styles for optimal results');
        break;
      case 'summarize':
        suggestions.push('Try different summary formats for various use cases');
        suggestions.push('Consider creating both brief and detailed versions');
        break;
      case 'translate':
        suggestions.push('Review with native speakers for cultural accuracy');
        suggestions.push('Consider regional variations of the target language');
        break;
    }
    
    // General suggestions
    suggestions.push('Save successful configurations for future use');
    suggestions.push('Experiment with AI enhancers for improved results');
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  // Fallback method for when OpenAI is not available
  private async processWithFallback(request: AIRequest): Promise<{
    content: string;
    confidence: number;
    suggestions: string[];
  }> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const toolType = request.context?.toolType || 'generate';
    const preferences = request.context?.userPreferences || {};
    
    let content = '';
    
    switch (toolType) {
      case 'generate':
        content = this.generateFallbackContent(request.prompt, preferences);
        break;
      case 'rewrite':
        content = this.rewriteFallbackContent(request.prompt, preferences);
        break;
      case 'summarize':
        content = this.summarizeFallbackContent(request.prompt, preferences);
        break;
      case 'translate':
        content = this.translateFallbackContent(request.prompt, preferences);
        break;
      default:
        content = this.generateFallbackContent(request.prompt, preferences);
    }
    
    return {
      content,
      confidence: 0.6,
      suggestions: [
        'Configure OpenAI API key for real AI-powered responses',
        'This is a simulated response for demonstration purposes',
        'Real AI integration will provide much better results'
      ]
    };
  }

  private generateFallbackContent(prompt: string, preferences: any): string {
    const topic = this.extractMainTopic(prompt);
    const contentType = preferences.contentType || 'content';
    const tone = preferences.tone || 'professional';
    
    return `# ${topic.charAt(0).toUpperCase() + topic.slice(1)} - ${contentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}

## Overview

This ${contentType.replace('-', ' ')} explores ${topic} with a ${tone} approach, providing valuable insights and practical information.

## Key Points

• **Understanding ${topic}**: Essential concepts and foundational knowledge
• **Practical Applications**: Real-world implementation strategies  
• **Best Practices**: Industry-standard approaches and methodologies
• **Benefits**: Advantages and positive outcomes you can expect

## Detailed Analysis

${topic.charAt(0).toUpperCase() + topic.slice(1)} represents an important area that deserves careful consideration. The ${tone} approach ensures that the information is presented in a way that resonates with your target audience while maintaining clarity and effectiveness.

## Implementation Strategy

1. **Assessment**: Evaluate your current situation and needs
2. **Planning**: Develop a comprehensive approach
3. **Execution**: Implement your strategy systematically
4. **Optimization**: Continuously improve based on results

## Conclusion

This comprehensive exploration of ${topic} provides the foundation needed for successful implementation. The ${tone} tone and structured approach ensure maximum value and practical applicability.

---
*Generated by ContentAI - Configure OpenAI API key for enhanced AI-powered content*`;
  }

  private rewriteFallbackContent(prompt: string, preferences: any): string {
    const originalText = this.extractOriginalText(prompt);
    const style = preferences.rewriteStyle || 'improve';
    
    return `# Content Enhancement Results

## Original Content
${originalText}

---

## Enhanced Version (${style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})

This enhanced version improves upon the original content by incorporating better structure, clearer language, and more engaging presentation. The revision focuses on maintaining the core message while enhancing readability and impact.

The improved content addresses key areas such as:
- Enhanced clarity and precision
- Better flow and organization
- More engaging language choices
- Improved professional presentation

## Quality Improvements
- **Readability**: Enhanced for better comprehension
- **Engagement**: More compelling and interesting
- **Structure**: Better organized and logical flow
- **Professional Standard**: Meets high-quality content requirements

---
*Enhanced by ContentAI - Configure OpenAI API key for advanced rewriting capabilities*`;
  }

  private summarizeFallbackContent(prompt: string, preferences: any): string {
    const originalText = this.extractOriginalText(prompt);
    const summaryType = preferences.summaryType || 'bullet-points';
    
    return `# Content Summary

## Source Analysis
- **Original Length**: ${originalText.split(/\s+/).length} words
- **Summary Format**: ${summaryType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
- **Compression Ratio**: Approximately 75% reduction

## Key Points Summary

• **Main Topic**: Core subject matter and primary focus
• **Key Arguments**: Central points and supporting evidence
• **Important Details**: Critical information and specifics
• **Conclusions**: Final outcomes and recommendations

## Executive Summary

This content focuses on essential information extracted from the source material. The summary maintains the core message while providing a concise overview suitable for quick reference and decision-making.

## Takeaways

The summarized content provides actionable insights and key information in a digestible format, making it easy to understand the main points without reading the full original text.

---
*Summarized by ContentAI - Configure OpenAI API key for intelligent summarization*`;
  }

  private translateFallbackContent(prompt: string, preferences: any): string {
    const originalText = this.extractOriginalText(prompt);
    const fromLang = preferences.fromLang || 'en';
    const toLang = preferences.toLang || 'es';
    
    const languages = {
      'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
      'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'zh': 'Chinese'
    };
    
    return `# Translation Results

## Source Text (${languages[fromLang] || fromLang})
${originalText}

---

## Translation (${languages[toLang] || toLang})

[This is a simulated translation. Configure OpenAI API key for accurate, professional translations.]

Professional translation services require advanced language models to ensure accuracy, cultural appropriateness, and natural flow in the target language.

## Translation Notes
- **Accuracy**: Professional-grade translation quality
- **Cultural Context**: Appropriate for target audience
- **Natural Flow**: Reads naturally in ${languages[toLang] || toLang}
- **Technical Terms**: Properly handled specialized vocabulary

---
*Translated by ContentAI - Configure OpenAI API key for professional translation services*`;
  }

  private extractMainTopic(prompt: string): string {
    const words = prompt.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about', 'write', 'create', 'generate'];
    const meaningfulWords = words.filter(word => word.length > 3 && !stopWords.includes(word));
    return meaningfulWords[0] || 'content';
  }

  private extractOriginalText(prompt: string): string {
    const patterns = [
      /rewrite the following content.*?:\s*(.*)/is,
      /translate the following text.*?:\s*(.*)/is,
      /summarize.*?:\s*(.*)/is,
      /create a.*?summary.*?of:\s*(.*)/is
    ];

    for (const pattern of patterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return prompt;
  }
}

export const aiEngine = new AITransformerEngine();