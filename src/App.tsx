import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { UnifiedAITool } from './components/tools/UnifiedAITool';
import { Projects } from './components/workspace/Projects';
import { History } from './components/workspace/History';

function App() {
  const [activeTab, setActiveTab] = useState('ai-studio');

  const renderContent = () => {
    switch (activeTab) {
      case 'ai-studio':
        return <UnifiedAITool />;
      case 'projects':
        return <Projects />;
      case 'history':
        return <History />;
      case 'favorites':
        return <History />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <UnifiedAITool />;
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;