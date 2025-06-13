// ✅ Complete Working Settings.js with Dark Mode and Clear History Feature (CDN Tailwind)

import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const clearHistory = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all prompt history?");
    if (confirmClear) {
      localStorage.removeItem('history');
      toast.success('History cleared!');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 dark:text-white text-black rounded-lg p-6 shadow-lg mt-6 transition-all">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="font-semibold text-lg">Theme</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark mode</p>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:opacity-80 transition"
          title="Toggle Theme"
        >
          {darkMode ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-gray-600" />}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">Clear History</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Delete all saved prompts and responses</p>
        </div>
        <button
          onClick={clearHistory}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
        >
          <FiTrash2 size={16} />
          Clear
        </button>
      </div>
    </div>
  );
};

export default Settings;
