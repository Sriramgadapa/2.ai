// Auto-configure Black Box API key
import { blackBoxClient } from './ai/gemini-client';
import { aiEngine } from './ai/transformers';

// Set the API key
const apiKey = 'AIzaSyC3wNpMPjqk8t3zFCBlPTx7TT35fi4IjM4';

// Configure the clients
blackBoxClient.setApiKey(apiKey);
aiEngine.setApiKey(apiKey);

console.log('Black Box API key configured successfully');

export { apiKey };