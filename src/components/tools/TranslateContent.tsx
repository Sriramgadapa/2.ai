import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { Languages, Copy, Heart, Download, ArrowLeftRight } from 'lucide-react';

export function TranslateContent() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ];

  const handleTranslate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fromLangName = languages.find(l => l.code === fromLang)?.name;
      const toLangName = languages.find(l => l.code === toLang)?.name;
      
      const translatedContent = `Original Text (${fromLangName}):
${input}

---

Translation (${toLangName}):
Este es el contenido traducido que demuestra las capacidades de traducción de IA. El texto ha sido cuidadosamente traducido manteniendo el contexto, el tono y el significado original mientras se adapta a las convenciones culturales y lingüísticas del idioma de destino.

La traducción preserva la estructura del documento original y asegura que todos los elementos importantes sean comunicados de manera efectiva en el nuevo idioma. El resultado es una traducción natural y profesional que captura tanto el contenido literal como el contexto cultural.

Características de esta traducción:
• Precisión contextual y cultural
• Mantenimiento del tono y estilo original
• Adaptación a convenciones locales
• Preservación del significado completo
• Fluidez natural en el idioma de destino

Esta traducción está lista para uso profesional y puede ser utilizada directamente en su contexto previsto.`;

      setOutput(translatedContent);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    setInput(output.split('---')[1]?.replace('Translation (' + languages.find(l => l.code === toLang)?.name + '):', '').trim() || '');
    setOutput('');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Translate Content</h1>
        <p className="text-gray-600">Translate text between multiple languages with AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Original Text</h2>
          
          <div className="space-y-4">
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

            <Textarea
              label="Text to Translate"
              placeholder="Enter text you want to translate..."
              value={input}
              onChange={setInput}
              rows={12}
              required
            />

            <Button
              onClick={handleTranslate}
              loading={loading}
              disabled={!input.trim() || loading || fromLang === toLang}
              icon={Languages}
              className="w-full"
            >
              {loading ? 'Translating...' : 'Translate Text'}
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Translation</h2>
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
              <Languages className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Translation will appear here</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}