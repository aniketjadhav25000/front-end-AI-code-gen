import React, { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';

const HistoryDetail = () => {
  const [history, setHistory] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const resHistory = await apiGet('/history');
        setHistory(Array.isArray(resHistory) ? resHistory : resHistory.history || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">Search History</h2>
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-400">No search history found.</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-white cursor-pointer"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <h3 className="font-bold text-lg mb-2">{item.query}</h3>
              <div className="text-sm text-gray-400 mb-2">
                {new Date(item.createdAt).toLocaleString()}
              </div>
              {expandedIndex === index && (
                <pre className="bg-gray-800 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                  <code>{item.result || 'No result saved with this query.'}</code>
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryDetail;
