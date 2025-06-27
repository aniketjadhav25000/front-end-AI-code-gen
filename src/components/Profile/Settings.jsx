// 📁 frontend/src/components/Profile/Settings.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../Auth/Login';
import { apiGet } from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiGet('/user/profile');
        setEmail(res.email || '');
      } catch (err) {
        console.error('Failed to fetch profile info:', err);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('http://localhost:5000/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Password updated successfully');
        setNewPassword('');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      toast.error('Server error while updating password');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-white">
        <div className="bg-yellow-600/10 border border-yellow-500 text-yellow-300 p-4 rounded mb-4">
          To access Settings, you need to log in first.
        </div>
        <Login />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-white space-y-8">
      <h2 className="text-3xl font-bold mb-4">User Settings</h2>

      {/* Theme Toggle */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-2">Appearance</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Current Theme: {theme}</span>
          <button
            onClick={toggleTheme}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition"
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
        <h3 className="text-xl font-semibold mb-2">Profile</h3>
        <div className="text-gray-400">Email: <span className="text-white font-medium">{email}</span></div>
      </div>

      {/* Password Update */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 space-y-2">
        <h3 className="text-xl font-semibold mb-2">Update Password</h3>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handlePasswordUpdate}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md transition text-white"
        >
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      {/* Logout Shortcut */}
      <div className="text-right">
        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-500 underline"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
