import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ activeTab, navigate }) => {
  const tabs = ['generate', 'user-history', 'settings', 'dashboard', 'saved'];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { logout, user } = useAuth();

  const scrollToTop = () => {
    setIsScrolling(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const checkIfScrolled = () => {
      if (window.pageYOffset === 0) {
        setIsScrolling(false);
        return;
      }
      window.scrollTo(0, 0);
      requestAnimationFrame(checkIfScrolled);
    };

    setTimeout(() => {
      if (window.pageYOffset > 0) {
        checkIfScrolled();
      } else {
        setIsScrolling(false);
      }
    }, 300);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleTabClick = (tab) => {
    navigate(`/${tab}`);
    setIsMobileMenuOpen(false);
    scrollToTop();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, staggerChildren: 0.1, when: 'beforeChildren' },
    },
  };

  const tabItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const hoverTapVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
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

        <div className="hidden md:flex space-x-2 items-center">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => handleTabClick(tab)}
              whileHover="hover"
              whileTap="tap"
              variants={hoverTapVariants}
              className={`capitalize px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {tab}
            </motion.button>
          ))}
          <motion.button
            onClick={handleRefresh}
            whileHover="hover"
            whileTap="tap"
            variants={hoverTapVariants}
            className="ml-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800"
            title="Refresh current page"
          >
            <RefreshCw size={20} />
          </motion.button>
          {user && (
            <motion.button
              onClick={handleLogout}
              whileHover="hover"
              whileTap="tap"
              variants={hoverTapVariants}
              className="ml-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </motion.button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <motion.button
            onClick={handleRefresh}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-gray-300 hover:text-white"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </motion.button>
          <motion.button
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden bg-gray-800/95 backdrop-blur-sm overflow-hidden"
          >
            <motion.div className="flex flex-col px-4 py-2 space-y-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  variants={tabItemVariants}
                  whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`capitalize px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
              {user && (
                <motion.button
                  onClick={handleLogout}
                  variants={tabItemVariants}
                  whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 rounded-lg text-left text-red-400 hover:text-white hover:bg-red-700"
                >
                  Logout
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
