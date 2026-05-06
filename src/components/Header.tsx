import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleDarkMode } = useDarkMode();

  const getLinkClass = (path: string) => {
    return location.pathname === path 
      ? 'relative text-primary dark:text-blue-400 font-bold'
      : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-300 transition-colors';
  };

  return (
    <header className="sticky top-4 z-40 mx-4 sm:mx-auto max-w-4xl mb-8">
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 px-6 py-4 rounded-3xl flex justify-between items-center transition-colors duration-500"
      >
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 flex items-center gap-2 tracking-tight">
          <span className="text-2xl">🏥</span> LariPlantão
        </h1>
        <div className="flex items-center gap-6">
          <ul className="flex gap-4 sm:gap-6 text-sm sm:text-base font-medium">
            <li>
              <Link to="/" className={getLinkClass('/')}>
                Plantões
                {location.pathname === '/' && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            </li>
            <li>
              <Link to="/about" className={getLinkClass('/about')}>
                Sobre
                {location.pathname === '/about' && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            </li>
            <li>
              <Link to="/donation" className={getLinkClass('/donation')}>
                Doar
                {location.pathname === '/donation' && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            </li>
          </ul>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300 transition-colors"
            title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </motion.nav>
    </header>
  );
};
