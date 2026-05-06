// FIX: Replaced placeholder content with a functional Donation component to display project support information.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CopyIcon } from '../components/icons/CopyIcon';
import { HeartIcon } from '../components/icons/HeartIcon';

export const Donation: React.FC = () => {
  const pixKey = 'contatorodrigorodrigues@gmail.com';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!navigator.clipboard) {
      // Clipboard API not available
      return;
    }
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 rounded-3xl p-8 max-w-2xl mx-auto transition-colors duration-500"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/10 rounded-2xl">
          <HeartIcon className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 dark:from-red-400 dark:to-rose-300">
          Apoie este Projeto
        </h2>
      </div>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          Se você gostou desta aplicação e a achou útil para gerenciar seus plantões, considere fazer uma pequena doação para apoiar o desenvolvimento contínuo e a manutenção do projeto.
        </p>
        <p>
          Sua doação ajuda a manter a aplicação no ar e motiva a criação de novas ferramentas e atualizações.
        </p>
        
        <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl mt-6 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3 flex items-center justify-between">
            <span>Chave PIX (E-mail)</span>
            <span className="text-emerald-500 font-black">Apoio Direto</span>
          </div>
          
          <div className="bg-slate-900 border border-slate-700/50 p-4 rounded-xl flex items-center justify-between gap-4 shadow-lg">
            <span className="font-mono text-xs sm:text-sm text-slate-200 break-all select-all">{pixKey}</span>
            <button 
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-2 p-2.5 sm:px-4 rounded-lg transition-all font-bold text-sm ${
                copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 active:scale-95'
              }`}
            >
              {copied ? 'Copiado!' : <><CopyIcon className="w-4 h-4" /> <span className="hidden sm:inline">Copiar</span></>}
            </button>
          </div>
        </div>
        
        <p className="text-center text-lg font-bold text-slate-800 dark:text-slate-200 pt-6">
          Muito obrigado pelo seu apoio! <span className="text-red-500">❤️</span>
        </p>
      </div>
    </motion.div>
  );
};
