// 📁 frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Zap, Clock, Settings, Gauge, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const tabConfig = [
  { key: 'generate', label: 'Generate', icon: <Zap size={16} />, protected: false },
  { key: 'history', label: 'History', icon: <Clock size={16} />, protected: true },
  { key: 'dashboard', label: 'Dashboard', icon: <Gauge size={16} />, protected: true },
  { key: 'settings', label: 'Settings', icon: <Settings size={16} />, protected: true },
];

const Navbar = ({ activeTab, navigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleTabClick = (tabKey, isProtected) => {
    if (isProtected && !user) {
      // Show notification and redirect to login if not authenticated
      toast.error(`You need to log in to access ${tabKey}.`);
      navigate('/login');
      setIsMobileMenuOpen(false); // Close mobile menu if open
      return;
    }
    navigate(`/${tabKey}`);
    setIsMobileMenuOpen(false);
    scrollToTop();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mr-2">
            <span className="text-white text-lg">🧠</span>
          </div>
          <h1 className="text-xl font-bold text-white bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
            AI Coding Assistant
          </h1>
        </motion.div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-2 items-center">
          {tabConfig.map(({ key, label, icon, protected: isProtected }) => (
            <motion.button
              key={key}
              onClick={() => handleTabClick(key, isProtected)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`capitalize flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {icon}
              {label}
            </motion.button>
          ))}

          {/* Auth Buttons */}
          {user ? (
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              <LogOut size={16} className="inline-block mr-1" /> Logout
            </motion.button>
          ) : (
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <LogIn size={16} className="inline-block mr-1" /> Login
            </motion.button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-gray-800 text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800/95 backdrop-blur-sm overflow-hidden"
          >
            <motion.div className="flex flex-col px-4 py-2 space-y-1">
              {tabConfig.map(({ key, label, icon, protected: isProtected }) => (
                <motion.button
                  key={key}
                  onClick={() => handleTabClick(key, isProtected)}
                  whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`capitalize flex items-center gap-2 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === key
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {icon} {label}
                </motion.button>
              ))}

              {user ? (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 rounded-lg text-left text-red-400 hover:text-white hover:bg-red-700"
                >
                  <LogOut size={16} className="inline-block mr-1" /> Logout
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 rounded-lg text-left text-indigo-400 hover:text-white hover:bg-indigo-600"
                >
                  <LogIn size={16} className="inline-block mr-1" /> Login
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;