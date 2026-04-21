import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';

export const Header: React.FC = () => {
  const location = useLocation();
  const { isDark, toggleDarkMode } = useDarkMode();

  const getLinkClass = (path: string) => {
    return location.pathname === path 
      ? 'text-primary dark:text-blue-400 font-bold border-b-2 border-primary dark:border-blue-400 pb-1'
      : 'text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-blue-300 transition-colors pb-1';
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm mb-6 rounded-b-xl transition-colors">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary dark:text-blue-400 flex items-center gap-2">
          🏥 LariPlantão
        </h1>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6">
            <li><Link to="/" className={getLinkClass('/')}>Plantões</Link></li>
            <li><Link to="/about" className={getLinkClass('/about')}>Sobre</Link></li>
            <li><Link to="/donation" className={getLinkClass('/donation')}>Doar</Link></li>
          </ul>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xl"
            title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
    </header>
  );
};
