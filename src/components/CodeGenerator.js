// same imports
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import {
  FiCopy, FiCheck, FiTerminal, FiChevronRight,
  FiZap, FiRefreshCw, FiEye, FiInfo, FiDownload
} from 'react-icons/fi';

// same examplePrompts object...

const AnimatedStarsBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden blur-sm animate-pulse">
    <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <g fill="#ffffff" fillOpacity="0.15">
        {Array.from({ length: 100 }).map((_, i) => {
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
              className="animate-twinkle"
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

const CodeGenerator = ({
  prompt, setPrompt,
  language, setLanguage,
  response, setResponse,
  loading, setLoading
}) => {
  const promptRef = useRef(null);
  const outputRef = useRef(null);
  const [previewMode, setPreviewMode] = useState('code');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => { promptRef.current?.focus(); }, []);
  useEffect(() => {
    if (response && outputRef.current)
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  const examplePrompts = {
  python: [
    'Create a Python script that reverses a string and checks if it is a palindrome.',
    'Build a Python CLI app to convert Celsius to Fahrenheit.',
    'Write Python code to find prime numbers in a list.'
  ],
  javascript: [
    'Write a JavaScript function that fetches data from an API and logs the result.',
    'Create a JavaScript to-do app with add/edit/delete functionality.',
    'Build a JS app that validates email using regex.'
  ],
  java: [
    'Create a Java class that implements a basic calculator using methods for each operation.',
    'Write a Java program to read a file and count words.',
    'Build a Java Swing app for a simple login screen.'
  ],
  typescript: [
    'Create a TypeScript interface for a user and write a function that accepts it.',
    'Write a TypeScript function to merge two arrays of objects based on id.',
    'Create a React component using TypeScript and props.'
  ],
  cpp: [
    'Write a C++ program to find the factorial of a number using recursion.',
    'Create a C++ class for a bank account with deposit and withdrawal functions.',
    'Implement a basic calculator in C++ using switch case.'
  ]
};  
  const handleSubmit = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    setLoading(true);
    setResponse('');
    try {
      const res = await axios.post('http://localhost:8000/generate_code', { prompt, language });
      const result = res.data.code || res.data.result || 'No code returned';
      setResponse(result);
      toast.success('✅ Code generated!');
      const history = JSON.parse(localStorage.getItem('history') || '[]');
      history.unshift({ prompt, language, result, date: new Date().toISOString() });
      localStorage.setItem('history', JSON.stringify(history.slice(0, 10)));
      setPrompt('');
      setCharCount(0);
    } catch {
      toast.error('❌ Backend error');
      setResponse('❌ Error connecting to backend');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      toast.success('📋 Copied to clipboard');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExamplePrompt = () => {
    const langKey = language.toLowerCase();
    const prompts = examplePrompts[langKey] || [];
    if (!prompts.length) return toast.error('❌ No example prompts for this language');
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
    setCharCount(randomPrompt.length);
    toast('📌 Example prompt loaded');
    promptRef.current?.focus();
  };

  const downloadCode = () => {
    if (!response) return;
    const ext = { python: 'py', javascript: 'js', java: 'java', typescript: 'ts', cpp: 'cpp' }[language] || 'txt';
    const blob = new Blob([response], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `generated-code.${ext}`;
    link.click();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 relative">
      <AnimatedStarsBackground />

      <div className="bg-gray-900 text-white rounded-xl shadow-2xl max-w-6xl mx-auto p-6 animate-fade-in transition-all duration-500 ease-out">
        <div className="flex items-center gap-3 mb-6">
          <FiTerminal className="text-indigo-400 text-3xl animate-pulse" />
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
            AI Code Generator
          </h2>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 mb-6 border border-gray-700">
          <div className="flex items-start gap-2 mb-2">
            <FiInfo className="mt-0.5 text-indigo-400" />
            <p>Generate code snippets with AI. Write a prompt, select language, and click <strong>Generate</strong>.</p>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="relative mb-4">
          <TextareaAutosize
            minRows={5}
            maxRows={10}
            ref={promptRef}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setCharCount(e.target.value.length);
            }}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Build a Python program to detect sentiment from a text file"
            className="w-full p-3 mb-1 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 font-mono resize-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-right text-gray-500">{charCount} characters</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 gap-3 w-full">
          <div className="flex w-full sm:w-auto gap-2">
            <select
              className="bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded w-1/2 sm:w-auto"
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
              className="flex-1 text-sm px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 flex items-center justify-center gap-2 hover:scale-105 transition"
              title="Load a random prompt"
            >
              <FiRefreshCw />
              Example
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FiZap />
                Generate
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div ref={outputRef} className="bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-500 ease-in-out">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2 w-full">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FiChevronRight />
              <span>Generated Output</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto">
              <button
                onClick={() => setPreviewMode(previewMode === 'code' ? 'markdown' : 'code')}
                className="text-xs text-gray-300 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded flex items-center gap-1"
              >
                <FiEye />
                {previewMode === 'code' ? 'Markdown' : 'Code'}
              </button>

              {response && (
                <>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                    title="Copy to clipboard"
                  >
                    {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                  </button>
                  <button
                    onClick={downloadCode}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                    title="Download code"
                  >
                    <FiDownload />
                  </button>
                </>
              )}
            </div>
          </div>

          {response ? (
            previewMode === 'code' ? (
              <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{ backgroundColor: '#1e1e2f', padding: '1rem', borderRadius: '0.5rem' }}
                className="text-sm"
              >
                {response}
              </SyntaxHighlighter>
            ) : (
              <div className="prose prose-invert text-sm max-w-none">
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre className="bg-gray-900 text-white p-4 rounded overflow-x-auto" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code className="text-pink-400" {...props} />
                    )
                  }}
                >
                  {response}
                </ReactMarkdown>
              </div>
            )
          ) : (
            <div className="bg-gray-900 text-gray-500 font-mono text-sm px-4 py-6 rounded animate-pulse">
              Code output will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
