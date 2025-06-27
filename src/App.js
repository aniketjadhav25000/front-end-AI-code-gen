// 📁 frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CodeGenerator from './components/CodeGenerator';
import History from './components/History';
import Settings from './components/Profile/Settings';
import Footer from './components/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import SearchHistory from './components/History/SearchHistory';
import Dashboard from './components/user/Dashboard';
import SavedCode from './components/user/SavedCode';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ParticlesBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-1" />
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

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

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

  const activeTab = location.pathname.split('/')[1] || 'generate';

  return (
    <>
      <ParticlesBackground />
      <div className="min-h-screen pt-20 px-4 pb-10 transition-all text-white relative z-10">
        <Navbar activeTab={activeTab} navigate={navigate} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedCode /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><SearchHistory /></ProtectedRoute>} />
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
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
