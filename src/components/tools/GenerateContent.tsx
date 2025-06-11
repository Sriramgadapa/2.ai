import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Sparkles, Copy, Download, Heart } from 'lucide-react';

export function GenerateContent() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const contentTypes = [
    { value: 'blog-post', label: 'Blog Post' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email', label: 'Email' },
    { value: 'product-description', label: 'Product Description' },
    { value: 'article', label: 'Article' },
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'informative', label: 'Informative' },
  ];

  const lengths = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = `# Generated ${contentTypes.find(t => t.value === contentType)?.label}

${prompt}

This is a ${tone} ${contentTypes.find(t => t.value === contentType)?.label.toLowerCase()} generated based on your prompt. The content has been crafted to match your specified tone and length requirements.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Key Points:
- Professional and engaging content
- Tailored to your specific requirements
- Ready for immediate use
- Optimized for your target audience

This generated content maintains a ${tone} tone throughout and provides comprehensive coverage of your topic while staying within the ${length} length parameters you specified.`;

      setOutput(generatedContent);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Content</h1>
        <p className="text-gray-600">Create high-quality content with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Settings</h2>
          
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

            <Textarea
              label="Prompt"
              placeholder="Describe what you want to generate..."
              value={prompt}
              onChange={setPrompt}
              rows={4}
              required
            />

            <Button
              onClick={handleGenerate}
              loading={loading}
              disabled={!prompt.trim() || loading}
              icon={Sparkles}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>
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

          {output ? (
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {output}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Generated content will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}