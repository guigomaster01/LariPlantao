import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 rounded-3xl p-8 max-w-2xl mx-auto transition-colors duration-500"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
          Sobre o Projeto
        </h2>
      </div>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          Bem-vindo ao <strong>LariPlantão</strong>! Este projeto foi criado com o objetivo de oferecer uma experiência de usuário limpa, intuitiva e visualmente agradável para gerenciar seus plantões de forma fácil.
        </p>
        <p>
          Cansado de aplicativos de plantões desajeitados e cheios de anúncios? Nós também. Por isso, focamos em criar uma interface minimalista e funcional, onde o mais importante é o seu plantão.
        </p>
        
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-2xl p-6 border border-white/40 dark:border-slate-700/30 mt-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="text-blue-500">⚡</span> Tecnologias Utilizadas
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span><strong>React:</strong> Interface de usuário reativa e veloz.</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span><strong>Tailwind CSS & Glassmorphism:</strong> Design elegante e responsivo.</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span><strong>TypeScript:</strong> Código mais robusto e seguro.</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span><strong>Framer Motion:</strong> Animações fluidas e interatividade.</span>
            </li>
          </ul>
        </div>
        
        <p className="text-center pt-4 font-medium italic text-slate-500 dark:text-slate-400">
          Espero que você goste de usar o aplicativo tanto quanto eu gostei de criá-lo!
        </p>
      </div>
    </motion.div>
  );
};
