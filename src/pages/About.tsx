import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Sobre o Projeto
      </h2>
      <div className="space-y-4 text-slate-600 dark:text-slate-300">
        <p>
          Bem-vindo ao LariPlantão! Este projeto foi criado com o objetivo de oferecer uma experiência de usuário limpa, intuitiva e visualmente agradável para gerenciar seus plantões.
        </p>
        <p>
          Cansado de aplicativos de plantões desajeitados e cheios de anúncios? Nós também. Por isso, focamos em criar uma interface minimalista e funcional, onde o mais importante é o seu plantão.
        </p>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 pt-2">
          Tecnologias Utilizadas
        </h3>
        <p>
          Esta aplicação foi desenvolvida utilizando as mais modernas tecnologias de desenvolvimento web, incluindo:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>React:</strong> Para uma interface de usuário reativa e componentizada.</li>
          <li><strong>Tailwind CSS:</strong> Para um design rápido, responsivo e customizável sem sair do HTML.</li>
          <li><strong>TypeScript:</strong> Para um código mais robusto e seguro.</li>
          <li><strong>Animações CSS:</strong> Para adicionar um toque de fluidez e interatividade.</li>
        </ul>
        <p>
          Espero que você goste de usar o aplicativo tanto quanto eu gostei de criá-lo!
        </p>
      </div>
    </div>
  );
};
