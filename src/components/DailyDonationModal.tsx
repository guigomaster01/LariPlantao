import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Copy, Check } from 'lucide-react';

function DonateView({ onCopy, copied }: { onCopy: () => void, copied: boolean }) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-red-500/10 rounded-xl">
          <Heart size={24} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Apoie o Projeto</h2>
      </div>

      <div className="space-y-5 text-slate-400 text-sm leading-relaxed text-left">
        <p>
          Este é um projeto independente e gratuito. Se o <span className="text-white font-bold">Lari Plantão</span> te ajuda a estimar o quanto você vai receber, considere apoiar o desenvolvedor.
        </p>
        <p>
          Sua doação ajuda a manter a aplicação no ar e motiva a criação de novas ferramentas.
        </p>

        <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl mt-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
          
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-3 flex items-center justify-between">
            <span>Chave PIX (E-mail)</span>
            <span className="text-emerald-500 font-black">Apoio Direto</span>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-slate-200 break-all select-all">contatorodrigorodrigues@gmail.com</span>
            <button 
              onClick={onCopy}
              className={`flex-shrink-0 p-2.5 rounded-lg transition-all ${
                copied ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          
          {copied && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-400 text-[10px] font-bold text-center mt-3 uppercase tracking-widest"
            >
              Copiado!
            </motion.p>
          )}
        </div>

        <p className="text-center text-white font-bold pt-4 text-base">
          Obrigado pelo seu apoio! <span className="text-red-500">❤️</span>
        </p>
      </div>
    </div>
  );
}

export function DailyDonationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const lastPromptDate = localStorage.getItem('lastDonationPromptDate');
    const today = new Date().toDateString();

    if (lastPromptDate !== today) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('lastDonationPromptDate', today);
      }, 3000); // Mostra o popup após 3 segundos
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('contatorodrigorodrigues@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-6 shadow-2xl shadow-emerald-900/10"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700 rounded-full p-1"
            >
              <X size={20} />
            </button>
            <DonateView onCopy={handleCopy} copied={copied} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
