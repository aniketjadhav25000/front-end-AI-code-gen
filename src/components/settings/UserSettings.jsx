import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUserSettings } from '../../services/userService';

export default function UserSettings() {
  const { userData } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    language: 'en'
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userData?.settings) {
      setSettings(userData.settings);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserSettings(userData.uid, settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Account Settings</h2>
      
      {success && (
        <div className="mb-6 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
            className="w-4 h-4 rounded bg-gray-700 border-gray-600 focus:ring-blue-500"
          />
          <label htmlFor="notifications" className="ml-2 text-sm text-gray-300">
            Enable email notifications
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}