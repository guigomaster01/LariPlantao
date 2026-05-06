import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Plantao {
  id: number;
  data: string;
  turno: string;
  vespera: boolean;
  valor: number;
  desc: string;
}

export const Home: React.FC = () => {
  const [plantoes, setPlantoes] = useState<Plantao[]>(() => {
    const saved = localStorage.getItem('plantoes_larissa');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [feriados, setFeriados] = useState<string[]>(() => {
    const saved = localStorage.getItem('feriados_larissa');
    return saved ? JSON.parse(saved) : [
      "2026-01-01", "2026-02-17", "2026-04-03", "2026-04-21", 
      "2026-05-01", "2026-06-04", "2026-09-07", "2026-10-12", 
      "2026-11-02", "2026-11-15", "2026-12-08", "2026-12-25"
    ];
  });
  
  const [valorHora, setValorHora] = useState<number>(() => {
    const saved = localStorage.getItem('valor_hora_larissa');
    return saved ? parseFloat(saved) : 15.87;
  });

  const [dataPlantao, setDataPlantao] = useState(new Date().toISOString().split('T')[0]);
  const [turno, setTurno] = useState('Diurno');
  const [vespera, setVespera] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newFeriado, setNewFeriado] = useState('');

  useEffect(() => {
    localStorage.setItem('plantoes_larissa', JSON.stringify(plantoes));
  }, [plantoes]);

  useEffect(() => {
    localStorage.setItem('feriados_larissa', JSON.stringify(feriados));
  }, [feriados]);

  useEffect(() => {
    localStorage.setItem('valor_hora_larissa', valorHora.toString());
  }, [valorHora]);

  const isFeriado = (dataString: string) => feriados.includes(dataString);

  const calcularValor = (dataString: string, t: string, vesp: boolean) => {
    const dataObj = new Date(dataString + 'T12:00:00'); 
    const diaSemana = dataObj.getDay();
    const ehFeriado = isFeriado(dataString);
    
    let fator = 0;
    let descricao = "";

    if (t === "Diurno") {
      if (diaSemana === 0 || ehFeriado) {
        fator = 12 * 2.0; 
        descricao = "Dom/Fer (100%)";
      } else {
        fator = 12 * 1.5;
        descricao = "Normal (50%)";
      }
    } else if (t === "Noturno") {
      if (diaSemana === 0 || ehFeriado) {
        fator = (3*2.0) + (2*2.25) + (5*1.75) + (2*1.5);
        descricao = "Not. Dom/Fer";
      } else if (diaSemana === 6 || vesp) {
        fator = (3*1.5) + (2*1.75) + (5*2.25) + (2*2.0);
        descricao = "Not. Sáb/Vésp";
      } else {
        fator = (5*1.5) + (7*1.75);
        descricao = "Not. Comum";
      }
    }

    return { total: fator * valorHora, desc: descricao };
  };

  const adicionarPlantao = () => {
    if (!dataPlantao) { alert("Selecione uma data"); return; }
    
    const calculo = calcularValor(dataPlantao, turno, vespera);
    const novoPlantao = {
      id: Date.now(),
      data: dataPlantao,
      turno,
      vespera,
      valor: calculo.total,
      desc: calculo.desc
    };

    setPlantoes([...plantoes, novoPlantao]);
  };

  const removerPlantao = (id: number) => {
    if(confirm("Remover este plantão?")) {
      setPlantoes(plantoes.filter(p => p.id !== id));
    }
  };

  const limparHistorico = () => {
    if(confirm("Tem certeza que deseja apagar todo o histórico?")) {
      setPlantoes([]);
    }
  };

  const addFeriado = () => {
    if(newFeriado && !feriados.includes(newFeriado)) {
      setFeriados([...feriados, newFeriado]);
      setNewFeriado('');
      alert("Feriado adicionado!");
    }
  };

  const formatarMoeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatarData = (dataString: string) => {
    const partes = dataString.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const total = plantoes.reduce((acc, curr) => acc + curr.valor, 0);
  const plantoesOrdenados = [...plantoes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).reverse();

  // Reusable glass class
  const glassCardClass = "bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 rounded-3xl p-6 transition-colors duration-500";
  const inputClass = "w-full p-3 border border-slate-200/60 dark:border-slate-700/60 rounded-xl bg-white/50 dark:bg-slate-800/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-xl mx-auto space-y-6"
    >
      <div className="text-center cursor-pointer text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors font-medium" onClick={() => setShowSettings(!showSettings)}>
        {showSettings ? 'Fechar Configurações ⌃' : '⚙️ Gerenciar Feriados e Valor Hora'}
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={glassCardClass}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 dark:text-slate-200">Valor da Hora Base (R$)</label>
                <input 
                  type="number" step="0.01" 
                  value={valorHora} 
                  onChange={e => setValorHora(parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                <label className="block text-sm font-semibold mb-2 dark:text-slate-200">Cadastrar Feriado (Data)</label>
                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={newFeriado} 
                    onChange={e => setNewFeriado(e.target.value)}
                    className={inputClass}
                  />
                  <button onClick={addFeriado} className="px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95">+</button>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  <strong>Feriados Cadastrados:</strong> {feriados.map(f => formatarData(f)).join(", ")}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${glassCardClass} space-y-4`}>
        <div>
          <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Data do Plantão</label>
          <input type="date" value={dataPlantao} onChange={e => setDataPlantao(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Turno</label>
          <select value={turno} onChange={e => setTurno(e.target.value)} className={inputClass}>
            <option value="Diurno">Diurno (07h - 19h)</option>
            <option value="Noturno">Noturno (19h - 07h)</option>
          </select>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <input type="checkbox" id="vespera" checked={vespera} onChange={e => setVespera(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50" />
          <label htmlFor="vespera" className="text-sm font-medium cursor-pointer dark:text-slate-200">É Véspera de Feriado?</label>
        </div>
        <button onClick={adicionarPlantao} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] mt-4">
          Adicionar Plantão
        </button>
      </div>

      <motion.div 
        layout
        className={`${glassCardClass} text-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5" />
        <div className="relative text-xl font-bold text-success dark:text-emerald-400">
          Total Estimado: <span className="text-2xl">{formatarMoeda(total)}</span>
        </div>
      </motion.div>

      <div className={glassCardClass}>
        <h3 className="text-lg font-bold mb-4 text-center dark:text-white">Histórico de Plantões</h3>
        
        {plantoes.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-4 text-sm">Nenhum plantão registrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left dark:text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400">
                  <th className="pb-3 px-2 font-semibold">Data</th>
                  <th className="pb-3 px-2 font-semibold">Detalhes</th>
                  <th className="pb-3 px-2 font-semibold">Valor</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {plantoesOrdenados.map(p => (
                    <motion.tr 
                      key={p.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="border-b border-slate-200/50 dark:border-slate-700/50 group hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <strong className="dark:text-white block">{formatarData(p.data)}</strong>
                        <span className={`inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${p.turno === 'Diurno' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'}`}>
                          {p.turno}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{p.desc}</span><br/>
                        {p.vespera && <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mt-1 block">★ Véspera</span>}
                      </td>
                      <td className="py-3 px-2 text-success dark:text-emerald-400 font-bold">{formatarMoeda(p.valor)}</td>
                      <td className="py-3 px-2 text-right">
                        <button onClick={() => removerPlantao(p.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          ✕
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        
        {plantoes.length > 0 && (
          <div className="mt-6 text-center">
            <button onClick={limparHistorico} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold uppercase tracking-wider hover:underline transition-colors">
              Limpar Todo o Histórico
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
