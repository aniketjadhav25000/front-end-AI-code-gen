import React from "react";
import { motion } from "framer-motion";
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: "GitHub",
      icon: <FiGithub />,
      url: "https://github.com",
    },
    {
      name: "Twitter",
      icon: <FiTwitter />,
      url: "https://twitter.com",
    },
    {
      name: "LinkedIn",
      icon: <FiLinkedin />,
      url: "https://linkedin.com",
    },
    {
      name: "Email",
      icon: <FiMail />,
      url: "mailto:contact@aicodeassistant.com",
    },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hover: {
      y: -3,
      scale: 1.1,
      color: "#818cf8",
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    },
    tap: { scale: 0.9 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={footerVariants}
      className="mt-16 pb-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              className="text-gray-400 hover:text-indigo-400 text-xl"
              aria-label={link.name}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>

        {/* Copyright and Links */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-500">
          <span>© {currentYear} AI Code Assistant. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <div className="flex space-x-4">
            <a href="/privacy" className="hover:text-indigo-400 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-indigo-400 transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="hover:text-indigo-400 transition-colors">
              Contact Us
            </a>
          </div>
        </div>

       
      </div>
    </motion.footer>
  );
};

export default Footer;