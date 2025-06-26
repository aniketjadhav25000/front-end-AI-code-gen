// 📁 frontend/ai-assistant-ui/src/components/user/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiGet } from '../../services/api';

const Dashboard = () => {
  const [codeCount, setCodeCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const codeRes = await apiGet('/code');
        const historyRes = await apiGet('/history');
        const profileRes = await apiGet('/user/profile');

        setCodeCount(codeRes.length);
        setHistoryCount(historyRes.length);
        setEmail(profileRes.email);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Welcome, {email || 'User'}!</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Saved Snippets</h3>
          <p className="text-3xl mt-2 text-indigo-400">{codeCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Search History</h3>
          <p className="text-3xl mt-2 text-purple-400">{historyCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
