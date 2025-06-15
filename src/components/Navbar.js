import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, RefreshCw, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ activeTab, navigate }) => {
  const { currentUser, logOut } = useAuth();
  const tabs = ['generate', 'history', 'settings'];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

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

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
  };

  const tabItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const hoverTapVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
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

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-2 items-center">
          {currentUser && tabs.map((tab) => (
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

          {currentUser ? (
            <motion.button
              onClick={handleLogout}
              whileHover="hover"
              whileTap="tap"
              variants={hoverTapVariants}
              className="ml-2 px-4 py-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </motion.button>
          ) : (
            <>
              <Link to="/login">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={hoverTapVariants}
                  className="ml-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={hoverTapVariants}
                  className="ml-2 px-4 py-2 rounded-lg bg-green-600/90 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
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
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-300" />
            ) : (
              <Menu size={24} className="text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
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
              {currentUser && tabs.map((tab) => (
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
              
              {currentUser ? (
                <motion.button
                  onClick={handleLogout}
                  variants={tabItemVariants}
                  whileHover={{ backgroundColor: 'rgba(220, 38, 38, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-3 rounded-lg text-left text-red-400 hover:text-white hover:bg-red-600/20 flex items-center gap-3"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </motion.button>
              ) : (
                <>
                  <Link to="/login">
                    <motion.button
                      variants={tabItemVariants}
                      whileHover={{ backgroundColor: 'rgba(37, 99, 235, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 rounded-lg text-left text-blue-400 hover:text-white hover:bg-blue-600/20 flex items-center gap-3"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      variants={tabItemVariants}
                      whileHover={{ backgroundColor: 'rgba(22, 163, 74, 0.2)' }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-3 rounded-lg text-left text-green-400 hover:text-white hover:bg-green-600/20 flex items-center gap-3"
                    >
                      <UserPlus size={18} />
                      <span>Sign Up</span>
                    </motion.button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;