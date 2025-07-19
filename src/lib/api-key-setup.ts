// Auto-configure Gemini API key
import { geminiClient } from './ai/gemini-client';
import { aiEngine } from './ai/transformers';

// Set the API key
const apiKey = 'AIzaSyC3wNpMPjqk8t3zFCBlPTx7TT35fi4IjM4';

// Configure the clients
geminiClient.setApiKey(apiKey);
aiEngine.setApiKey(apiKey);

console.log('Gemini API key configured successfully');

export { apiKey };