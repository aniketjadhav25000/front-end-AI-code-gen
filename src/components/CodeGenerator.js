import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import {
  FiCopy, FiCheck, FiTerminal, FiChevronRight,
  FiZap, FiRefreshCw, FiEye, FiDownload,
  FiArrowDownCircle, FiCode, FiStar, FiClock,
  FiShield, FiLayers, FiGitBranch, FiCpu, FiInfo,
  FiUsers, FiTrendingUp
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AnimatedStarsBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g fill="#3b82f6" fillOpacity="0.15">
        {Array.from({ length: 120 }).map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const r = Math.random() * 1.2 + 0.2;
          const duration = Math.random() * 5 + 5;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r={r}
              className="animate-pulse"
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          );
        })}
      </g>
    </svg>
  </div>
);

const CodeGenerator = () => {
  const promptRef = useRef(null);
  const outputRef = useRef(null);
  const generatorSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState('code');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    promptRef.current?.focus();
  }, []);

  useEffect(() => {
    if (response && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  const scrollToGenerator = () => {
    const element = generatorSectionRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const element = aboutSectionRef.current;
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const examplePrompts = {
    python: [
      'Build a Python CLI tool to rename files in a directory with regex support',
      'Create a FastAPI endpoint that processes CSV uploads and returns statistics',
      'Write a script that monitors CPU usage and sends Slack alerts when thresholds are exceeded'
    ],
    javascript: [
      'Build a React hook for handling form validation with Yup',
      'Create a Node.js middleware for JWT authentication',
      'Implement a debounce function with TypeScript support'
    ],
    java: [
      'Write a Spring Boot controller for a RESTful API with CRUD operations',
      'Create a thread-safe singleton class in Java',
      'Implement a binary search tree with traversal methods'
    ],
    typescript: [
      'Create a type-safe Redux store with redux-toolkit',
      'Write a React component with TypeScript that fetches and displays user data',
      'Implement a generic cache service with TTL support'
    ],
    cpp: [
      'Create a class for matrix operations with operator overloading',
      'Implement a thread pool using C++20',
      'Write a memory-efficient linked list implementation'
    ]
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    if (prompt.length < 10) return toast.error('Prompt should be at least 10 characters');
    
    setLoading(true); 
    setResponse('');
    
    try {
      const toastId = toast.loading(window.innerWidth < 768 ? 'Generating...' : 'Generating code...');
      const res = await axios.post('http://localhost:8000/generate_code', { 
        prompt, 
        language 
      });
      
      const result = res.data.code || res.data.result || 'No output generated';
      setResponse(result);

      // Save to history
      const historyItem = {
        prompt,
        language,
        result,
        date: new Date().toISOString()
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('history') || '[]');
      const updatedHistory = [historyItem, ...existingHistory].slice(0, 100);
      localStorage.setItem('history', JSON.stringify(updatedHistory));

      toast.success(window.innerWidth < 768 ? '✅ Generated!' : '✅ Code generated successfully!', { id: toastId });
    } catch (err) {
      toast.error('❌ Failed to generate code');
      setResponse('❌ Error connecting to backend service');
    } finally {
      setLoading(false); 
      setPrompt(''); 
      setCharCount(0);
    }
  };

  const handleExamplePrompt = () => {
    const prompts = examplePrompts[language] || [];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt); 
    setCharCount(randomPrompt.length);
    toast(window.innerWidth < 768 ? '📌 Example loaded' : '📌 Example prompt loaded');
    promptRef.current?.focus();
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    toast.success(window.innerWidth < 768 ? '📋 Copied!' : '📋 Copied to clipboard!');
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    if (!response) return;
    const ext = { 
      python: 'py', 
      javascript: 'js', 
      java: 'java', 
      typescript: 'ts', 
      cpp: 'cpp' 
    }[language] || 'txt';
    
    const blob = new Blob([response], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `generated-code-${Date.now()}.${ext}`;
    link.click();
    toast.success(window.innerWidth < 768 ? `⬇️ ${ext} file` : `⬇️ Downloaded as ${ext} file`);
  };

  const aboutCards = [
    {
      id: 1,
      icon: <FiZap className="text-2xl md:text-3xl" />,
      title: "Lightning Fast",
      mobileTitle: "Fast",
      description: "Generate production-ready code in seconds with our optimized AI models",
      mobileDescription: "Generate code in seconds",
      stats: "0.5s avg response time",
      mobileStats: "0.5s response",
      color: "bg-indigo-900/50 hover:bg-indigo-900/70 border-indigo-700"
    },
    {
      id: 2,
      icon: <FiCode className="text-2xl md:text-3xl" />,
      title: "Multi-Language",
      mobileTitle: "Multi-Language",
      description: "Supports Python, JavaScript, Java, TypeScript, C++ and more",
      mobileDescription: "Python, JS, Java, TS, C++",
      stats: "5+ languages supported",
      mobileStats: "5+ languages",
      color: "bg-pink-900/50 hover:bg-pink-900/70 border-pink-700"
    },
    {
      id: 3,
      icon: <FiUsers className="text-2xl md:text-3xl" />,
      title: "Developer Focused",
      mobileTitle: "For Developers",
      description: "Designed by developers for developers to boost productivity",
      mobileDescription: "Boost productivity",
      stats: "10,000+ happy developers",
      mobileStats: "10K+ devs",
      color: "bg-purple-900/50 hover:bg-purple-900/70 border-purple-700"
    },
    {
      id: 4,
      icon: <FiTrendingUp className="text-2xl md:text-3xl" />,
      title: "Always Improving",
      mobileTitle: "Improving",
      description: "Continuously updated with the latest coding standards and practices",
      mobileDescription: "Weekly updates",
      stats: "Weekly model updates",
      mobileStats: "Latest standards",
      color: "bg-amber-900/50 hover:bg-amber-900/70 border-amber-700"
    }
  ];

  // Updated animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -5,
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const iconVariants = {
    hover: {
      y: -3,
      scale: 1.1,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 10
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-transparent min-h-screen text-gray-100 relative overflow-x-hidden pt-12 md:pt-16">
      <AnimatedStarsBackground />
    
      {/* Hero Section */}
      <section className="text-center py-8 md:py-16 px-4 max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl hidden md:block"></div>
          <div className="absolute -bottom-8 -right-16 w-40 h-40 bg-pink-600/20 rounded-full blur-3xl hidden md:block"></div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            className="mb-6 md:mb-8"
          >
            <motion.h1 
              variants={titleVariants}
              className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-indigo-400 via-pink-500 to-yellow-400 text-transparent bg-clip-text"
            >
              <span className="md:hidden">AI Code Generator</span>
              <span className="hidden md:inline">AI-Powered Code Generation</span>
            </motion.h1>
            <motion.p 
              variants={titleVariants}
              className="text-gray-400 mb-6 md:mb-8 mx-auto max-w-xs md:max-w-2xl text-sm md:text-lg"
            >
              <span className="md:hidden">Transform ideas into code instantly</span>
              <span className="hidden md:inline">Transform your ideas into production-ready code instantly.</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center max-w-xs md:max-w-none mx-auto"
          >
            <motion.button 
              onClick={scrollToGenerator}
              className="flex items-center justify-center gap-2 px-5 py-3 md:px-6 md:py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
              whileHover={{ scale: window.innerWidth >= 768 ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              variants={buttonVariants}
            >
              <FiZap className="animate-pulse" /> 
              <span className="md:hidden">Generate Code</span>
              <span className="hidden md:inline">Generate Code</span>
            </motion.button>
            <motion.button 
              onClick={scrollToAbout}
              className="flex items-center justify-center gap-2 px-5 py-3 md:px-6 md:py-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all"
              whileHover={{ scale: window.innerWidth >= 768 ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              variants={buttonVariants}
            >
              <FiInfo /> 
              <span className="md:hidden">About</span>
              <span className="hidden md:inline">About</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 md:mt-12 flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              onClick={scrollToGenerator}
              className="cursor-pointer flex flex-col items-center"
            >
              <FiArrowDownCircle className="text-gray-400 text-xl md:text-2xl mb-1" />
              <span className="text-xs md:text-sm text-gray-500">Scroll Down</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Code Generator Section */}
      <section id="generator" ref={generatorSectionRef} className="max-w-4xl mx-auto px-4 pb-12 md:pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <FiTerminal className="text-indigo-400 text-xl md:text-2xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                <span className="md:hidden">Code Generator</span>
                <span className="hidden md:inline">AI Code Generator</span>
              </h2>
              <p className="text-xs md:text-sm text-gray-400">
                <span className="md:hidden">Describe what you want to build</span>
                <span className="hidden md:inline">Describe what you want to build and select a language</span>
              </p>
            </div>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <label htmlFor="prompt" className="text-xs md:text-sm font-medium text-gray-300">
                Your Prompt
              </label>
              <span className="text-xs text-gray-500">{charCount}/{window.innerWidth < 768 ? '200' : '500'} characters</span>
            </div>
            <TextareaAutosize
              id="prompt"
              minRows={window.innerWidth < 768 ? 3 : 4}
              maxRows={window.innerWidth < 768 ? 6 : 8}
              ref={promptRef}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setCharCount(e.target.value.length);
              }}
              placeholder={window.innerWidth < 768 ? "e.g., Python script to scrape articles" : "e.g., Create a Python script that scrapes latest articles from a website and saves them as markdown files"}
              className="w-full p-3 md:p-4 text-sm md:text-base rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 font-mono resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              maxLength={window.innerWidth < 768 ? 200 : 500}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="flex gap-2 md:gap-3 flex-wrap w-full md:w-auto">
              <select
                className="flex-1 md:flex-none bg-gray-800 border border-gray-700 text-white text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition w-full md:w-auto"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="python">🐍 Python</option>
                <option value="javascript">🌐 JavaScript</option>
                <option value="java">☕ Java</option>
                <option value="typescript">📘 TypeScript</option>
                <option value="cpp">💻 C++</option>
              </select>
              
              <button 
                onClick={handleExamplePrompt} 
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition w-full md:w-auto"
              >
                <FiRefreshCw size={window.innerWidth < 768 ? 12 : 14} /> 
                <span className="md:hidden">Example</span>
                <span className="hidden md:inline">Load Example</span>
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className={`flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all ${loading ? 'bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3 md:h-4 w-3 md:w-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="md:hidden">Generating...</span>
                  <span className="hidden md:inline">Generating...</span>
                </>
              ) : (
                <>
                  <FiZap size={window.innerWidth < 768 ? 12 : 14} /> 
                  <span className="md:hidden">Generate</span>
                  <span className="hidden md:inline">Generate Code</span>
                </>
              )}
            </button>
          </div>

          <div ref={outputRef} className="bg-gray-800/80 border border-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center p-2 md:p-3 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-300 mb-2 sm:mb-0">
                <FiGitBranch size={window.innerWidth < 768 ? 12 : 14} />
                <span>Output</span>
                {response && (
                  <span className="text-xs px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-700 rounded-full">
                    {language.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex gap-1 md:gap-2">
                <button 
                  onClick={() => setPreviewMode(previewMode === 'code' ? 'markdown' : 'code')} 
                  className="text-xs flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-2 py-1 md:px-2.5 md:py-1 rounded transition"
                >
                  <FiEye size={window.innerWidth < 768 ? 10 : 12} /> 
                  <span className="md:hidden">{previewMode === 'code' ? 'MD' : 'Code'}</span>
                  <span className="hidden md:inline">{previewMode === 'code' ? 'Markdown' : 'Code'}</span>
                </button>
                {response && (
                  <>
                    <button 
                      onClick={handleCopy} 
                      className="p-1.5 md:p-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                      title={window.innerWidth < 768 ? "Copy" : "Copy to clipboard"}
                    >
                      {copied ? <FiCheck size={window.innerWidth < 768 ? 12 : 14} /> : <FiCopy size={window.innerWidth < 768 ? 12 : 14} />}
                    </button>
                    <button 
                      onClick={downloadCode} 
                      className="p-1.5 md:p-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                      title={window.innerWidth < 768 ? "Download" : "Download code"}
                    >
                      <FiDownload size={window.innerWidth < 768 ? 12 : 14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="min-h-[160px] md:min-h-[200px]">
              {response ? (
                previewMode === 'code' ? (
                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    customStyle={{
                      backgroundColor: '#111827',
                      padding: window.innerWidth < 768 ? '1rem' : '1.25rem',
                      borderRadius: '0',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowX: 'auto',
                      fontSize: window.innerWidth < 768 ? '0.75rem' : '0.85rem',
                      margin: '0'
                    }}
                    showLineNumbers={window.innerWidth >= 768}
                    wrapLines={true}
                  >
                    {response}
                  </SyntaxHighlighter>
                ) : (
                  <div className={`prose prose-invert max-w-none p-3 md:p-4 ${window.innerWidth < 768 ? 'text-xs' : 'text-sm'}`}>
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center">
                  <FiCode className="text-gray-600 text-3xl md:text-4xl mb-2 md:mb-3" />
                  <p className="text-gray-500 font-mono text-xs md:text-sm">
                    {loading ? 'Generating...' : 'Your generated code will appear here'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section ref={aboutSectionRef} className="max-w-6xl mx-auto px-4 pb-12 md:pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text">
            <span className="md:hidden">Why Choose Us?</span>
            <span className="hidden md:inline">Why Choose Our AI Code Generator?</span>
          </h2>
          <p className="text-sm md:text-lg text-gray-400 max-w-xs md:max-w-3xl mx-auto">
            <span className="md:hidden">Revolutionize your workflow with AI</span>
            <span className="hidden md:inline">Revolutionize your development workflow with our cutting-edge AI technology</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-16"
        >
          {aboutCards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className={`cursor-pointer border ${card.color} transition-all duration-300 rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg overflow-hidden`}
            >
              <div className="flex flex-col h-full">
                <motion.div
                  variants={iconVariants}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 md:mb-4"
                >
                  {card.icon}
                </motion.div>
                <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">
                  {window.innerWidth < 768 ? card.mobileTitle : card.title}
                </h3>
                <p className="text-xs md:text-gray-300 mb-2 md:mb-4">
                  {window.innerWidth < 768 ? card.mobileDescription : card.description}
                </p>
                <div className="mt-auto">
                  <div className="text-2xs md:text-xs font-mono bg-black/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full inline-block">
                    {window.innerWidth < 768 ? card.mobileStats : card.stats}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-900/80 border border-gray-800 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg overflow-hidden backdrop-blur-sm"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 origin-left"
          />
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="md:w-1/2">
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">
                How It Works
              </h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  {
                    step: 1,
                    title: "Describe",
                    mobileTitle: "Describe",
                    description: "Simply type what you want to build in plain English or choose from examples",
                    mobileDescription: "Type what you want to build",
                    color: "bg-indigo-500/20 text-indigo-300"
                  },
                  {
                    step: 2,
                    title: "Select Language",
                    mobileTitle: "Select Language",
                    description: "Choose from multiple supported programming languages",
                    mobileDescription: "Choose from supported languages",
                    color: "bg-pink-500/20 text-pink-300"
                  },
                  {
                    step: 3,
                    title: "Get Perfect Code",
                    mobileTitle: "Get Code",
                    description: "Receive clean, production-ready code in seconds",
                    mobileDescription: "Receive production-ready code",
                    color: "bg-purple-500/20 text-purple-300"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex gap-3 md:gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${item.color} flex items-center justify-center`}>
                        <span className="text-sm md:font-bold">{item.step}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-white mb-1">
                        {window.innerWidth < 768 ? item.mobileTitle : item.title}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-400">
                        {window.innerWidth < 768 ? item.mobileDescription : item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">
                Technology Stack
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  {
                    title: "AI Models",
                    description: "State-of-the-art transformer models fine-tuned for code generation",
                    mobileDescription: "Advanced AI models",
                    icon: <FiCpu className="text-indigo-400" />
                  },
                  {
                    title: "Performance",
                    description: "Optimized for speed with sub-second response times",
                    mobileDescription: "Sub-second responses",
                    icon: <FiZap className="text-yellow-400" />
                  },
                  {
                    title: "Security",
                    description: "Enterprise-grade security and data protection",
                    mobileDescription: "Enterprise security",
                    icon: <FiShield className="text-green-400" />
                  },
                  {
                    title: "Reliability",
                    description: "99.9% uptime with automatic failover",
                    mobileDescription: "99.9% uptime",
                    icon: <FiClock className="text-blue-400" />
                  }
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/50 rounded-lg p-2 md:p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <div className="p-1.5 md:p-2 rounded-lg bg-gray-700/50">
                        {tech.icon}
                      </div>
                      <h4 className="text-xs md:text-sm font-semibold text-white">{tech.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400">
                      {window.innerWidth < 768 ? tech.mobileDescription : tech.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 md:pb-16 space-y-8 md:space-y-16">
        <div className="space-y-4 md:space-y-12 text-center">
          <div className="space-y-2 md:space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              <span className="md:hidden">Developer Tools</span>
              <span className="hidden md:inline">Developer Superpowers</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-400 max-w-xs md:max-w-2xl mx-auto">
              <span className="md:hidden">Accelerate your workflow</span>
              <span className="hidden md:inline">Accelerate your development workflow with our AI-powered tools</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {[
              { 
                icon: <FiCpu className="text-indigo-400 text-xl md:text-2xl" />,
                title: 'Multi-language',
                mobileTitle: 'Multi-language',
                text: 'Our AI understands context across Python, JavaScript, Java, TypeScript, and C++ with proper syntax and best practices.',
                mobileText: 'Python, JavaScript, Java, TypeScript, C++'
              },
              { 
                icon: <FiLayers className="text-pink-400 text-xl md:text-2xl" />,
                title: 'Full Stack Capabilities',
                mobileTitle: 'Full Stack',
                text: 'Generate everything from database models to UI components and API endpoints in a single prompt.',
                mobileText: 'DB models to UI components'
              },
              { 
                icon: <FiGitBranch className="text-yellow-400 text-xl md:text-2xl" />,
                title: 'Production Ready Code',
                mobileTitle: 'Production Ready',
                text: 'Get clean, maintainable code with proper error handling and documentation included.',
                mobileText: 'Clean, maintainable code'
              },
              { 
                icon: <FiShield className="text-green-400 text-xl md:text-2xl" />,
                title: 'Security Conscious',
                mobileTitle: 'Secure',
                text: 'Built-in awareness of common vulnerabilities and secure coding practices.',
                mobileText: 'Secure coding practices'
              },
              { 
                icon: <FiClock className="text-blue-400 text-xl md:text-2xl" />,
                title: 'Time Saving',
                mobileTitle: 'Time Saving',
                text: 'Reduce boilerplate coding time by 80% and focus on solving unique problems.',
                mobileText: 'Reduce boilerplate'
              },
              { 
                icon: <FiRefreshCw className="text-purple-400 text-xl md:text-2xl" />,
                title: 'Iterative Refinement',
                mobileTitle: 'Iterative',
                text: 'Easily modify and regenerate code based on your feedback and changing requirements.',
                mobileText: 'Modify and regenerate'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                className="bg-gray-900/80 border border-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 hover:border-gray-700 transition-all duration-300 text-left backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-gray-800">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm md:text-xl font-semibold mb-1 md:mb-2">
                      {window.innerWidth < 768 ? feature.mobileTitle : feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400">
                      {window.innerWidth < 768 ? feature.mobileText : feature.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CodeGenerator;