// --- ESTADO INICIAL ---
    // Carrega dados do LocalStorage ou inicia vazio
    let plantoes = JSON.parse(localStorage.getItem('plantoes_larissa')) || [];
    let feriados = JSON.parse(localStorage.getItem('feriados_larissa')) || [
        "2026-01-01", "2026-02-17", "2026-04-03", "2026-04-21", 
        "2026-05-01", "2026-06-04", "2026-09-07", "2026-10-12", 
        "2026-11-02", "2026-11-15", "2026-12-08", "2026-12-25"
    ]; // Alguns feriados padrão para 2026
    
    // Carrega valor hora salvo ou usa o padrão
    const savedValorHora = localStorage.getItem('valor_hora_larissa');
    if(savedValorHora) document.getElementById('valorHora').value = savedValorHora;

    // Define data de hoje no input
    document.getElementById('dataPlantao').valueAsDate = new Date();

    // --- LÓGICA DE NEGÓCIO ---

    function getValorHora() {
        return parseFloat(document.getElementById('valorHora').value) || 15.87;
    }

    function isFeriado(dataString) {
        return feriados.includes(dataString);
    }

    function calcularValor(dataString, turno, isVespera) {
        // Criando data corrigindo fuso horário (adicionando T12:00) para garantir o dia correto
        const dataObj = new Date(dataString + 'T12:00:00'); 
        const diaSemana = dataObj.getDay(); // 0 = Domingo, 6 = Sábado
        const ehFeriado = isFeriado(dataString);
        const valorHora = getValorHora();
        
        let fator = 0;
        let descricao = "";

        // LÓGICA IDÊNTICA AO EXCEL
        if (turno === "Diurno") {
            if (diaSemana === 0 || ehFeriado) {
                // Domingo ou Feriado
                fator = 12 * 2.0; 
                descricao = "Dom/Fer (100%)";
            } else {
                // Seg a Sab
                fator = 12 * 1.5;
                descricao = "Normal (50%)";
            }
        } 
        else if (turno === "Noturno") {
            if (diaSemana === 0 || ehFeriado) {
                // Domingo ou Feriado (Prioridade máxima)
                // 3h(100%) + 2h(125%) + 5h(75%) + 2h(50%)
                fator = (3*2.0) + (2*2.25) + (5*1.75) + (2*1.5);
                descricao = "Not. Dom/Fer";
            } else if (diaSemana === 6 || isVespera) {
                // Sábado ou Véspera
                // 3h(50%) + 2h(75%) + 5h(125%) + 2h(100%)
                fator = (3*1.5) + (2*1.75) + (5*2.25) + (2*2.0);
                descricao = "Not. Sáb/Vésp";
            } else {
                // Noturno Comum (Seg-Sex)
                // 5h(50%) + 7h(75%)
                fator = (5*1.5) + (7*1.75);
                descricao = "Not. Comum";
            }
        }

        return {
            total: fator * valorHora,
            desc: descricao
        };
    }

    // --- INTERAÇÃO COM A UI ---

    function adicionarPlantao() {
        const data = document.getElementById('dataPlantao').value;
        const turno = document.getElementById('turno').value;
        const vespera = document.getElementById('vespera').checked;

        if (!data) { alert("Selecione uma data"); return; }

        const calculo = calcularValor(data, turno, vespera);

        const novoPlantao = {
            id: Date.now(),
            data: data,
            turno: turno,
            vespera: vespera,
            valor: calculo.total,
            desc: calculo.desc
        };

        plantoes.push(novoPlantao);
        salvarDados();
        renderizarTabela();
    }

    function removerPlantao(id) {
        if(confirm("Remover este plantão?")) {
            plantoes = plantoes.filter(p => p.id !== id);
            salvarDados();
            renderizarTabela();
        }
    }

    function limparHistorico() {
        if(confirm("Tem certeza que deseja apagar todo o histórico?")) {
            plantoes = [];
            salvarDados();
            renderizarTabela();
        }
    }

    function salvarDados() {
        localStorage.setItem('plantoes_larissa', JSON.stringify(plantoes));
        localStorage.setItem('valor_hora_larissa', document.getElementById('valorHora').value);
        renderizarResumo();
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatarData(dataString) {
        const partes = dataString.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`; // DD/MM/AAAA
    }

    function renderizarTabela() {
        const tbody = document.querySelector("#tabelaPlantoes tbody");
        tbody.innerHTML = "";

        // Ordenar por data (mais recente primeiro)
        const plantoesOrdenados = [...plantoes].sort((a, b) => new Date(b.data) - new Date(a.data));

        plantoesOrdenados.forEach(p => {
            const tr = document.createElement("tr");
            const badgeClass = p.turno === 'Diurno' ? 'badge-diurno' : 'badge-noturno';
            
            tr.innerHTML = `
                <td>
                    <strong>${formatarData(p.data)}</strong><br>
                    <span class="badge ${badgeClass}">${p.turno}</span>
                </td>
                <td>
                    <small>${p.desc}</small><br>
                    ${p.vespera ? '<small style="color:#f59e0b">★ Véspera</small>' : ''}
                </td>
                <td style="color: var(--success); font-weight:bold;">${formatarMoeda(p.valor)}</td>
                <td><button class="delete-btn" onclick="removerPlantao(${p.id})">X</button></td>
            `;
            tbody.appendChild(tr);
        });
        renderizarResumo();
    }

    function renderizarResumo() {
        const total = plantoes.reduce((acc, curr) => acc + curr.valor, 0);
        document.getElementById("valorTotal").innerText = formatarMoeda(total);
    }

    // --- GERENCIAMENTO DE FERIADOS ---

    function toggleSettings() {
        const area = document.getElementById("settingsArea");
        area.style.display = area.style.display === "block" ? "none" : "block";
        renderizarListaFeriados();
    }

    function addFeriado() {
        const data = document.getElementById("newFeriado").value;
        if(data && !feriados.includes(data)) {
            feriados.push(data);
            localStorage.setItem('feriados_larissa', JSON.stringify(feriados));
            renderizarListaFeriados();
            alert("Feriado adicionado! (Recalculando plantões antigos automaticamente apenas se você editar o valor hora ou adicionar novos. Para atualizar passados, teria que reprocessar, mas para novos funcionará ok)");
        }
    }

    function renderizarListaFeriados() {
        const lista = document.getElementById("listaFeriados");
        lista.innerHTML = "<strong>Feriados Cadastrados:</strong> " + feriados.map(f => formatarData(f)).join(", ");
    }

    // Inicialização
    renderizarTabela();