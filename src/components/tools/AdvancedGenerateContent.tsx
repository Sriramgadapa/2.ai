import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { ModelSelector } from '../ai/ModelSelector';
import { EnhancerSelector } from '../ai/EnhancerSelector';
import { AdvancedSettings } from '../ai/AdvancedSettings';
import { Sparkles, Copy, Download, Heart, Zap, Brain, TrendingUp } from 'lucide-react';
import { aiEngine } from '../../lib/ai/transformers';
import { TransformerConfig, AIResponse } from '../../types/ai';

export function AdvancedGenerateContent() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  
  const [config, setConfig] = useState<TransformerConfig>({
    model: 'gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    enhancers: []
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const aiResponse = await aiEngine.processRequest({
        prompt,
        config,
        context: {
          contentType: 'advanced-generation',
          userPreferences: {}
        }
      });

      setOutput(aiResponse.content);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Generation failed:', error);
      setOutput('Error: Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Brain className="w-8 h-8 text-primary-600" />
            <span>Advanced AI Studio</span>
          </h1>
          <p className="text-gray-600">Next-generation AI transformers for premium content creation</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
          <Zap className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">AI Enhanced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="xl:col-span-1 space-y-6">
          <Card>
            <ModelSelector
              selectedModel={config.model}
              onModelChange={(model) => setConfig({ ...config, model })}
            />
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

        {/* Content Generation Panel */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span>Content Generation</span>
            </h2>
            
            <div className="space-y-4">
              <Textarea
                label="Your Prompt"
                placeholder="Describe what you want to create with advanced AI transformers..."
                value={prompt}
                onChange={setPrompt}
                rows={6}
                required
              />

              <Button
                onClick={handleGenerate}
                loading={loading}
                disabled={!prompt.trim() || loading}
                icon={Brain}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              >
                {loading ? 'AI Processing...' : 'Generate with AI Transformers'}
              </Button>
            </div>
          </Card>

          {/* Output Panel */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span>Generated Content</span>
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
                    <span className="text-gray-600">Enhancers:</span>
                    <div className="font-semibold text-purple-600">{response.enhancementsApplied.length}</div>
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
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-lg font-medium mb-2">Advanced AI Ready</p>
                <p>Your enhanced content will appear here with detailed analytics</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}