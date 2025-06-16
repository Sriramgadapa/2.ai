import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Key, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { aiEngine } from '../../lib/ai/transformers';

interface ApiKeySetupProps {
  onApiKeySet: () => void;
}

export function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      setError('OpenAI API keys should start with "sk-"');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Set the API key and test it
      aiEngine.setApiKey(apiKey);
      
      // Store in localStorage for persistence (in production, use secure storage)
      localStorage.setItem('openai_api_key', apiKey);
      
      setSuccess(true);
      setTimeout(() => {
        onApiKeySet();
      }, 1500);
    } catch (err) {
      setError('Invalid API key or connection failed. Please check your key and try again.');
      console.error('API key validation failed:', err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect to OpenAI</h2>
          <p className="text-gray-600">Enter your OpenAI API key to enable real AI-powered content generation</p>
        </div>

        <div className="space-y-4">
          <Input
            label="OpenAI API Key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={setApiKey}
            error={error}
            disabled={isValidating || success}
          />

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-success-50 border border-success-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <span className="text-success-700 font-medium">API key configured successfully!</span>
            </div>
          )}

          <Button
            onClick={handleSetApiKey}
            loading={isValidating}
            disabled={!apiKey.trim() || isValidating || success}
            className="w-full"
          >
            {success ? 'Connected!' : isValidating ? 'Validating...' : 'Connect to OpenAI'}
          </Button>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How to get your OpenAI API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">OpenAI API Keys</a></li>
                  <li>Sign in to your OpenAI account</li>
                  <li>Click "Create new secret key"</li>
                  <li>Copy and paste the key here</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <span>Get your API key</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}