import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { ModelSelector } from '../ai/ModelSelector';
import { EnhancerSelector } from '../ai/EnhancerSelector';
import { AdvancedSettings } from '../ai/AdvancedSettings';
import { 
  Brain, 
  Copy, 
  Download, 
  Heart, 
  Zap, 
  TrendingUp,
  PenTool,
  RefreshCw,
  FileText,
  Languages,
  ArrowLeftRight
} from 'lucide-react';
import { aiEngine } from '../../lib/ai/transformers';
import { TransformerConfig, AIResponse } from '../../types/ai';

type ToolType = 'generate' | 'rewrite' | 'summarize' | 'translate';

interface ToolOption {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const toolOptions: ToolOption[] = [
  {
    id: 'generate',
    name: 'Generate Content',
    description: 'Create new content from scratch',
    icon: PenTool,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'rewrite',
    name: 'Rewrite Content',
    description: 'Improve and refine existing content',
    icon: RefreshCw,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'summarize',
    name: 'Summarize Content',
    description: 'Create concise summaries',
    icon: FileText,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'translate',
    name: 'Translate Content',
    description: 'Translate between languages',
    icon: Languages,
    color: 'from-orange-500 to-orange-600'
  }
];

export function UnifiedAITool() {
  const [selectedTool, setSelectedTool] = useState<ToolType>('generate');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  
  // Generate-specific settings
  const [contentType, setContentType] = useState('blog-post');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  
  // Rewrite-specific settings
  const [rewriteStyle, setRewriteStyle] = useState('improve');
  
  // Summarize-specific settings
  const [summaryType, setSummaryType] = useState('bullet-points');
  const [summaryLength, setSummaryLength] = useState('medium');
  
  // Translate-specific settings
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');
  
  const [config, setConfig] = useState<TransformerConfig>({
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    enhancers: []
  });

  const contentTypes = [
    { value: 'blog-post', label: 'Blog Post' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email', label: 'Email' },
    { value: 'product-description', label: 'Product Description' },
    { value: 'article', label: 'Article' },
    { value: 'marketing-copy', label: 'Marketing Copy' },
    { value: 'technical-doc', label: 'Technical Documentation' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'informative', label: 'Informative' },
    { value: 'creative', label: 'Creative' },
    { value: 'formal', label: 'Formal' },
  ];

  const lengths = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
    { value: 'very-long', label: 'Very Long' },
  ];

  const rewriteStyles = [
    { value: 'improve', label: 'Improve Writing' },
    { value: 'simplify', label: 'Simplify Language' },
    { value: 'formal', label: 'Make More Formal' },
    { value: 'casual', label: 'Make More Casual' },
    { value: 'expand', label: 'Expand Ideas' },
    { value: 'shorten', label: 'Make Shorter' },
    { value: 'professional', label: 'Professional Tone' },
    { value: 'creative', label: 'Creative Enhancement' },
  ];

  const summaryTypes = [
    { value: 'bullet-points', label: 'Bullet Points' },
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'key-takeaways', label: 'Key Takeaways' },
    { value: 'executive-summary', label: 'Executive Summary' },
    { value: 'outline', label: 'Outline Format' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'no', name: 'Norwegian' },
  ];

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      let prompt = '';
      let contextType = '';

      switch (selectedTool) {
        case 'generate':
          prompt = `Create a ${contentTypes.find(t => t.value === contentType)?.label} with a ${tone} tone and ${length} length about: ${input}`;
          contextType = 'content-generation';
          break;
        case 'rewrite':
          prompt = `Rewrite the following content to ${rewriteStyles.find(s => s.value === rewriteStyle)?.label}: ${input}`;
          contextType = 'content-rewriting';
          break;
        case 'summarize':
          prompt = `Create a ${summaryTypes.find(t => t.value === summaryType)?.label} summary (${summaryLength} length) of: ${input}`;
          contextType = 'content-summarization';
          break;
        case 'translate':
          const fromLangName = languages.find(l => l.code === fromLang)?.name;
          const toLangName = languages.find(l => l.code === toLang)?.name;
          prompt = `Translate the following text from ${fromLangName} to ${toLangName}: ${input}`;
          contextType = 'content-translation';
          break;
      }

      const aiResponse = await aiEngine.processRequest({
        prompt,
        config: {
          ...config,
          enhancers: [...(config.enhancers || []), `${selectedTool}-optimizer`]
        },
        context: {
          contentType: contextType,
          toolType: selectedTool,
          userPreferences: {
            contentType,
            tone,
            length,
            rewriteStyle,
            summaryType,
            summaryLength,
            fromLang,
            toLang
          }
        }
      });

      setOutput(aiResponse.content);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Processing failed:', error);
      setOutput('Error: Failed to process content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  const handleSwapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
  };

  const getInputLabel = () => {
    switch (selectedTool) {
      case 'generate':
        return 'Describe what you want to create';
      case 'rewrite':
        return 'Content to rewrite';
      case 'summarize':
        return 'Content to summarize';
      case 'translate':
        return 'Text to translate';
      default:
        return 'Your input';
    }
  };

  const getInputPlaceholder = () => {
    switch (selectedTool) {
      case 'generate':
        return 'Describe the content you want to generate...';
      case 'rewrite':
        return 'Paste your content here to rewrite it...';
      case 'summarize':
        return 'Paste your long-form content here to summarize...';
      case 'translate':
        return 'Enter text you want to translate...';
      default:
        return 'Enter your text here...';
    }
  };

  const renderToolSpecificSettings = () => {
    switch (selectedTool) {
      case 'generate':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {tones.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {lengths.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'rewrite':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rewrite Style</label>
            <select
              value={rewriteStyle}
              onChange={(e) => setRewriteStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {rewriteStyles.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        );

      case 'summarize':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Summary Format</label>
              <select
                value={summaryType}
                onChange={(e) => setSummaryType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {summaryTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {lengths.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'translate':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={fromLang}
                onChange={(e) => setFromLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSwapLanguages}
              className="mt-6 p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              title="Swap languages"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={toLang}
                onChange={(e) => setToLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedToolOption = toolOptions.find(tool => tool.id === selectedTool);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-primary-600" />
            <span>AI Content Studio</span>
          </h1>
          <p className="text-gray-600">All-in-one AI-powered content creation and enhancement platform</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
          <Zap className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">AI Enhanced</span>
        </div>
      </div>

      {/* Tool Selection */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select AI Tool</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {toolOptions.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                  ${selectedTool === tool.id
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <ModelSelector
              selectedModel={config.model}
              onModelChange={(model) => setConfig({ ...config, model })}
            />
          </Card>

          {/* Tool-specific settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              {selectedToolOption && <selectedToolOption.icon className="w-5 h-5 text-primary-600" />}
              <span>{selectedToolOption?.name} Settings</span>
            </h3>
            {renderToolSpecificSettings()}
          </Card>

          <Card>
            <EnhancerSelector
              selectedEnhancers={config.enhancers || []}
              onEnhancersChange={(enhancers) => setConfig({ ...config, enhancers })}
            />
          </Card>

          <Card>
            <AdvancedSettings
              config={config}
              onConfigChange={setConfig}
            />
          </Card>
        </div>

        {/* Content Processing Panel */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              {selectedToolOption && <selectedToolOption.icon className="w-5 h-5 text-primary-600" />}
              <span>{selectedToolOption?.name}</span>
            </h2>
            
            <div className="space-y-4">
              <Textarea
                label={getInputLabel()}
                placeholder={getInputPlaceholder()}
                value={input}
                onChange={setInput}
                rows={8}
                required
              />

              <Button
                onClick={handleProcess}
                loading={loading}
                disabled={!input.trim() || loading || (selectedTool === 'translate' && fromLang === toLang)}
                icon={selectedToolOption?.icon}
                className={`w-full bg-gradient-to-r ${selectedToolOption?.color} hover:opacity-90`}
              >
                {loading ? 'Processing...' : `${selectedToolOption?.name}`}
              </Button>
            </div>
          </Card>

          {/* Output Panel */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>AI Output</span>
              </h2>
              {output && (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy} icon={Copy}>
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" icon={Heart}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" icon={Download}>
                    Export
                  </Button>
                </div>
              )}
            </div>

            {response && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Model:</span>
                    <div className="font-semibold text-gray-900">{response.model}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <div className="font-semibold text-green-600">{(response.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Processing:</span>
                    <div className="font-semibold text-blue-600">{response.processingTime}ms</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tool:</span>
                    <div className="font-semibold text-purple-600 capitalize">{selectedTool}</div>
                  </div>
                </div>
              </div>
            )}

            {output ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                    {output}
                  </pre>
                </div>
                
                {response?.suggestions && response.suggestions.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">AI Suggestions:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {response.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-blue-600">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${selectedToolOption?.color || 'from-primary-100 to-secondary-100'} rounded-full flex items-center justify-center`}>
                  {selectedToolOption && <selectedToolOption.icon className="w-8 h-8 text-white" />}
                </div>
                <p className="text-lg font-medium mb-2">AI Ready</p>
                <p>Your {selectedToolOption?.name.toLowerCase()} output will appear here</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}