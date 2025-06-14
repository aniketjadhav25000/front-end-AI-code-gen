// import React from 'react';
// import { FiSun, FiMoon } from 'react-icons/fi';

// const Sidebar = ({ tab, setTab, theme, setTheme }) => {
//   return (
//     <aside className="w-60 bg-gray-100 dark:bg-gray-800 p-4 space-y-4">
//       <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
//       <nav className="space-y-2">
//         <button className={`block w-full text-left px-4 py-2 rounded ${tab === 'generate' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100 dark:hover:bg-gray-700'}`} onClick={() => setTab('generate')}>Generate</button>
//         <button className={`block w-full text-left px-4 py-2 rounded ${tab === 'history' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100 dark:hover:bg-gray-700'}`} onClick={() => setTab('history')}>History</button>
//         <button className={`block w-full text-left px-4 py-2 rounded ${tab === 'settings' ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100 dark:hover:bg-gray-700'}`} onClick={() => setTab('settings')}>Settings</button>
//       </nav>
//       <button
//         onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//         className="flex items-center gap-2 mt-6 text-sm px-4 py-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
//       >
//         {theme === 'light' ? <FiMoon /> : <FiSun />}
//         Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
//       </button>
//     </aside>
//   );
// };

// export default Sidebar;
