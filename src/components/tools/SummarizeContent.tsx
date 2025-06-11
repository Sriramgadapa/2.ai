import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { FileText, Copy, Heart, Download } from 'lucide-react';

export function SummarizeContent() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryType, setSummaryType] = useState('bullet-points');
  const [length, setLength] = useState('medium');

  const summaryTypes = [
    { value: 'bullet-points', label: 'Bullet Points' },
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'key-takeaways', label: 'Key Takeaways' },
    { value: 'executive-summary', label: 'Executive Summary' },
  ];

  const lengths = [
    { value: 'brief', label: 'Brief' },
    { value: 'medium', label: 'Medium' },
    { value: 'detailed', label: 'Detailed' },
  ];

  const handleSummarize = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      let summaryContent = '';
      
      if (summaryType === 'bullet-points') {
        summaryContent = `## Summary - Key Points

• **Main Topic**: The content discusses important concepts and methodologies relevant to the subject matter
• **Key Benefits**: Significant advantages and positive outcomes are highlighted throughout the text
• **Implementation**: Practical steps and actionable recommendations are provided for effective execution
• **Results**: Expected outcomes and measurable benefits are clearly outlined
• **Best Practices**: Industry-standard approaches and proven methodologies are emphasized
• **Considerations**: Important factors and potential challenges to consider during implementation
• **Conclusion**: The overall impact and long-term value proposition is clearly established`;
      } else if (summaryType === 'paragraph') {
        summaryContent = `## Summary

This content provides a comprehensive overview of the key concepts and methodologies discussed in the original text. The main focus centers on practical implementation strategies and their associated benefits. The material emphasizes best practices and proven approaches while addressing potential challenges and considerations. The overall message highlights the significant value and positive outcomes that can be achieved through proper application of the discussed principles and techniques. The content serves as a valuable resource for understanding both the theoretical foundations and practical applications of the subject matter.`;
      } else if (summaryType === 'key-takeaways') {
        summaryContent = `## Key Takeaways

🎯 **Primary Focus**: Understanding and implementing effective strategies for optimal results

📊 **Impact**: Significant improvements in efficiency and outcomes when properly applied

⚡ **Quick Wins**: Immediate benefits can be realized through initial implementation steps

🔧 **Tools & Methods**: Specific approaches and methodologies are recommended for success

📈 **Long-term Value**: Sustained benefits and continuous improvement opportunities

⚠️ **Important Notes**: Critical considerations and potential pitfalls to avoid

✅ **Action Items**: Clear next steps and practical recommendations for moving forward`;
      } else {
        summaryContent = `## Executive Summary

**Overview**: This document presents essential information and strategic insights relevant to the discussed topic, providing stakeholders with critical knowledge for informed decision-making.

**Key Findings**: The analysis reveals significant opportunities for improvement and optimization through the implementation of recommended strategies and best practices.

**Strategic Recommendations**: 
- Immediate implementation of core principles
- Adoption of proven methodologies
- Regular monitoring and adjustment processes
- Investment in necessary tools and resources

**Expected Outcomes**: Organizations following these recommendations can expect measurable improvements in efficiency, quality, and overall performance metrics.

**Next Steps**: Leadership should prioritize resource allocation and timeline development for successful implementation of the outlined strategies.`;
      }

      setOutput(summaryContent);
    } catch (error) {
      console.error('Summarization failed:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Summarize Content</h1>
        <p className="text-gray-600">Create concise summaries of long-form content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Content to Summarize</h2>
          
          <div className="space-y-4">
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
              label="Original Content"
              placeholder="Paste your long-form content here to summarize..."
              value={input}
              onChange={setInput}
              rows={12}
              required
            />

            <Button
              onClick={handleSummarize}
              loading={loading}
              disabled={!input.trim() || loading}
              icon={FileText}
              className="w-full"
            >
              {loading ? 'Summarizing...' : 'Create Summary'}
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Summary</h2>
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
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Summary will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}