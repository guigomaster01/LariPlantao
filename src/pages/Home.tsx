import React, { useState, useEffect } from 'react';

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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center cursor-pointer text-secondary dark:text-slate-400 underline text-sm hover:text-primary dark:hover:text-blue-300 transition-colors" onClick={() => setShowSettings(!showSettings)}>
        ⚙️ Gerenciar Feriados e Valor Hora
      </div>

      {showSettings && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 transition-colors">
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 dark:text-slate-200">Valor da Hora Base (R$)</label>
            <input 
              type="number" step="0.01" 
              value={valorHora} 
              onChange={e => setValorHora(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
            <label className="block text-sm font-semibold mb-2 dark:text-slate-200">Cadastrar Feriado (Data)</label>
            <div className="flex gap-2">
              <input 
                type="date" 
                value={newFeriado} 
                onChange={e => setNewFeriado(e.target.value)}
                className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white"
              />
              <button onClick={addFeriado} className="px-4 bg-primary text-white font-bold rounded-md hover:bg-blue-700 transition-colors">+</button>
            </div>
            <div className="text-xs text-secondary dark:text-slate-400 mt-2">
              <strong>Feriados:</strong> {feriados.map(f => formatarData(f)).join(", ")}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 space-y-4 transition-colors">
        <div>
          <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Data do Plantão</label>
          <input type="date" value={dataPlantao} onChange={e => setDataPlantao(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 dark:text-slate-200">Turno</label>
          <select value={turno} onChange={e => setTurno(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-white">
            <option value="Diurno">Diurno (07h - 19h)</option>
            <option value="Noturno">Noturno (19h - 07h)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="vespera" checked={vespera} onChange={e => setVespera(e.target.checked)} className="w-4 h-4" />
          <label htmlFor="vespera" className="text-sm font-semibold cursor-pointer dark:text-slate-200">É Véspera de Feriado?</label>
        </div>
        <button onClick={adicionarPlantao} className="w-full py-3 bg-primary text-white font-bold rounded-md hover:bg-blue-700 transition-colors mt-2">
          Adicionar Plantão
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 text-center transition-colors">
        <div className="text-lg font-bold text-success dark:text-green-400">
          Total Estimado: {formatarMoeda(total)}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 transition-colors">
        <h3 className="text-lg font-bold mb-4 text-center dark:text-white">Histórico</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left dark:text-slate-300">
            <thead>
              <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-secondary dark:text-slate-400">
                <th className="p-3 font-semibold">Data</th>
                <th className="p-3 font-semibold">Detalhes</th>
                <th className="p-3 font-semibold">Valor</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {plantoesOrdenados.map(p => (
                <tr key={p.id} className="border-b dark:border-slate-700">
                  <td className="p-3">
                    <strong className="dark:text-white">{formatarData(p.data)}</strong><br/>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${p.turno === 'Diurno' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800'}`}>
                      {p.turno}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-xs">{p.desc}</span><br/>
                    {p.vespera && <span className="text-xs text-amber-500">★ Véspera</span>}
                  </td>
                  <td className="p-3 text-success dark:text-green-400 font-bold">{formatarMoeda(p.valor)}</td>
                  <td className="p-3">
                    <button onClick={() => removerPlantao(p.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors">X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {plantoes.length > 0 && (
          <div className="mt-4 text-center">
            <button onClick={limparHistorico} className="bg-secondary dark:bg-slate-600 text-white px-4 py-2 rounded text-xs hover:bg-slate-600 dark:hover:bg-slate-500 transition-colors">Limpar Tudo</button>
          </div>
        )}
      </div>
    </div>
  );
};
