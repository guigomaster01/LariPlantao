// FIX: Replaced placeholder content with a functional Donation component to display project support information.
import React, { useState } from 'react';
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
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <HeartIcon className="w-7 h-7 text-red-500" />
        Apoie este Projeto
      </h2>
      <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <p>
          Se você gostou desta lista de compras e a achou útil, considere fazer uma pequena doação para apoiar o desenvolvimento contínuo e a manutenção do projeto.
        </p>
        <p>
          Qualquer contribuição, por menor que seja, é imensamente apreciada e me ajuda a dedicar mais tempo para adicionar novos recursos e manter tudo funcionando perfeitamente.
        </p>
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-slate-500 dark:text-slate-400">Chave PIX Email:</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span className="font-mono text-lg text-slate-800 dark:text-slate-200 break-all">{pixKey}</span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Copiar chave PIX"
            >
              <CopyIcon className="w-4 h-4" />
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>
        <p className="text-center text-lg font-semibold text-slate-800 dark:text-slate-200 pt-4">
          Muito obrigado pelo seu apoio! ❤️
        </p>
      </div>
    </div>
  );
};
