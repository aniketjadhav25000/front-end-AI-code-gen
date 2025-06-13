import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CodeGenerator from './components/CodeGenerator';
import History from './components/History';
import Settings from './components/Settings';
import AnimatedStarsBackground from './components/AnimatedStarsBackground';

const App = () => {
  const [activeTab, setActiveTab] = useState('generate');

  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <CodeGenerator
            prompt={prompt}
            setPrompt={setPrompt}
            language={language}
            setLanguage={setLanguage}
            response={response}
            setResponse={setResponse}
            loading={loading}
            setLoading={setLoading}
          />
        );
    }
  };

  return (
    <>
      <AnimatedStarsBackground/>

      <div className="relative z-10 min-h-screen pt-20 px-4 pb-10">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        {renderTab()}
      </div>
    </>
  );
};

export default App;
