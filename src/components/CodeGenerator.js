import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import TextareaAutosize from 'react-textarea-autosize';
import {
  FiCopy, FiCheck, FiZap, FiDownload, FiEye
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { apiPost } from '../services/api';

const CodeGenerator = () => {
  const promptRef = useRef(null);
  const outputRef = useRef(null);
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState('code');
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    promptRef.current?.focus();
  }, []);

  useEffect(() => {
    if (response && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return toast.error('Please enter a prompt');
    if (prompt.length < 10) return toast.error('Prompt should be at least 10 characters');

    setLoading(true);
    setResponse('');

    try {
      const toastId = toast.loading('Generating code...');
      const res = await axios.post('http://localhost:8000/generate_code', {
        prompt,
        language
      });

      const result = res.data.code || res.data.result || 'No output generated';
      setResponse(result);

      // ✅ Save to MongoDB history WITH result
     await apiPost('/history', { query: prompt, result, language });



      // ✅ Save code snippet (optional title)
      const shortTitle = prompt.length > 40 ? prompt.slice(0, 40) + '...' : prompt;
      await apiPost('/code', { title: shortTitle, code: result });

      toast.success('✅ Code generated!', { id: toastId });
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
    const examples = [
      'Build a Python CLI tool to rename files in a directory',
      'Create a FastAPI endpoint to upload CSV files and return stats'
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setPrompt(random);
    setCharCount(random.length);
    promptRef.current?.focus();
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    toast.success('📋 Copied!');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    if (!response) return;
    const ext = {
      python: 'py', javascript: 'js', java: 'java', typescript: 'ts', cpp: 'cpp'
    }[language] || 'txt';
    const blob = new Blob([response], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `generated-code.${ext}`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-4 text-indigo-400">AI Code Generator</h2>

      <TextareaAutosize
        minRows={3}
        ref={promptRef}
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setCharCount(e.target.value.length);
        }}
        placeholder="e.g., Create a Python script to scrape news sites"
        className="w-full p-3 mb-4 bg-gray-800 border border-gray-600 rounded text-white resize-none"
        maxLength={500}
      />

      <div className="flex items-center justify-between mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="typescript">TypeScript</option>
          <option value="cpp">C++</option>
        </select>

        <button
          onClick={handleExamplePrompt}
          className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded"
        >
          Load Example
        </button>
      </div>

      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow mb-6"
      >
        {loading ? 'Generating...' : 'Generate Code'}
      </motion.button>

      {response && (
        <div ref={outputRef} className="mt-6 relative">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-purple-300">Generated Code</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 text-sm rounded"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
              <button
                onClick={downloadCode}
                className="bg-gray-700 hover:bg-gray-600 px-3 py-1 text-sm rounded"
              >
                <FiDownload />
              </button>
            </div>
          </div>

          {previewMode === 'code' ? (
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                backgroundColor: '#111827',
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                overflowX: 'auto',
              }}
              wrapLines
            >
              {response}
            </SyntaxHighlighter>
          ) : (
            <div className="prose prose-invert max-w-none text-sm">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          )}

          <button
            onClick={() => setPreviewMode(previewMode === 'code' ? 'markdown' : 'code')}
            className="mt-4 text-xs underline text-indigo-400"
          >
            {previewMode === 'code' ? 'Switch to Markdown' : 'Switch to Code'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
