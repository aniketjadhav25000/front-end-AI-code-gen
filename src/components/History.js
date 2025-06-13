import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const History = () => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('history') || '[]');
    setHistory(stored);
  }, []);

  const toggleExpand = (idx) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const deleteItem = (idx) => {
    const newHistory = [...history];
    newHistory.splice(idx, 1);
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('history');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-4 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">🕘 Prompt History</h2>
          {history.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="text-gray-400 text-sm sm:text-base">No history found.</p>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="mb-4 bg-gray-700 p-4 rounded-lg border border-gray-600"
            >
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer gap-3"
                onClick={() => toggleExpand(idx)}
              >
                <div className="w-full sm:w-auto flex-1">
                  <p className="font-semibold text-sm sm:text-base truncate">
                    🧠 {item.prompt}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 break-words">
                    Lang: {item.language} | {new Date(item.date).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(idx);
                    }}
                    className="text-red-400 hover:text-red-600"
                    title="Delete entry"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  {expanded === idx ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </div>
              </div>

              {expanded === idx && (
                <div className="mt-4 overflow-x-auto rounded-md">
                  <SyntaxHighlighter
                    language={item.language}
                    style={oneDark}
                    className="text-xs sm:text-sm md:text-base"
                    customStyle={{
                      padding: '0.75rem',
                      backgroundColor: '#1e1e2f',
                      fontSize: '0.75rem', // fallback for mobile
                    }}
                  >
                    {item.result}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
