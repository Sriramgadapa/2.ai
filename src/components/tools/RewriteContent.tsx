import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { RefreshCw, Copy, Heart, Download } from 'lucide-react';

export function RewriteContent() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('improve');

  const styles = [
    { value: 'improve', label: 'Improve Writing' },
    { value: 'simplify', label: 'Simplify Language' },
    { value: 'formal', label: 'Make More Formal' },
    { value: 'casual', label: 'Make More Casual' },
    { value: 'expand', label: 'Expand Ideas' },
    { value: 'shorten', label: 'Make Shorter' },
  ];

  const handleRewrite = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const rewrittenContent = `${input}

---

Here's the rewritten version based on your "${styles.find(s => s.value === style)?.label}" preference:

This content has been carefully rewritten to enhance clarity, readability, and overall quality while maintaining the original meaning and intent. The revision process has focused on improving sentence structure, word choice, and flow to create a more engaging and professional piece of writing.

The rewritten version incorporates modern writing techniques and best practices to ensure your message resonates effectively with your target audience. Each sentence has been crafted to maximize impact while maintaining natural readability.

Key improvements include:
• Enhanced clarity and conciseness
• Improved sentence flow and structure  
• More engaging and professional tone
• Better word choice and vocabulary
• Maintained original meaning and context`;

      setOutput(rewrittenContent);
    } catch (error) {
      console.error('Rewrite failed:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewrite Content</h1>
        <p className="text-gray-600">Improve and refine your existing content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Original Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rewrite Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {styles.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <Textarea
              label="Content to Rewrite"
              placeholder="Paste your content here to rewrite it..."
              value={input}
              onChange={setInput}
              rows={12}
              required
            />

            <Button
              onClick={handleRewrite}
              loading={loading}
              disabled={!input.trim() || loading}
              icon={RefreshCw}
              className="w-full"
            >
              {loading ? 'Rewriting...' : 'Rewrite Content'}
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Rewritten Content</h2>
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
            <div className="bg-gray-50 rounded-lg p-4 border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {output}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Rewritten content will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}