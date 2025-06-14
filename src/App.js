import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CodeGenerator from './components/CodeGenerator';
import History from './components/History';
import Settings from './components/Settings';
import Footer from './components/Footer';

const ParticlesBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-1" />

    {/* Floating particles */}
    <div className="absolute inset-0">
      {Array.from({ length: 60 }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 10;
        const left = Math.random() * 100;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10 animate-particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: `-${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Get active tab from URL
  const activeTab = location.pathname.split('/')[1] || 'generate';

  return (
    <>
      <ParticlesBackground />
      <div className="min-h-screen pt-20 px-4 pb-10 transition-all text-white relative z-10">
        <Navbar activeTab={activeTab} navigate={navigate} />
        <Routes>
          <Route path="/" element={
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
          } />
          <Route path="/generate" element={
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
          } />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={
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
          } />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;