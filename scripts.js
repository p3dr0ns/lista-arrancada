let competidores = JSON.parse(localStorage.getItem('competidores')) || [];
let competidoresSharkTank = JSON.parse(localStorage.getItem('competidoresSharkTank')) || [];
let listaAtual = 'principal';

function atualizarLista() {
    const tabela = document.getElementById('listaCompetidores');
    tabela.innerHTML = '';
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    lista.forEach((nome, index) => {
        tabela.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td contenteditable="true" onblur="editarNome(${index}, this.innerText)">${nome}</td>
                <td>
                    <button class="btn-move" onclick="moverCima(${index})">⬆️</button>
                    <button class="btn-move" onclick="moverBaixo(${index})">⬇️</button>
                    <button class="btn-remove" onclick="removerCompetidor(${index})">❌</button>
                </td>
            </tr>`;
    });
    localStorage.setItem(listaAtual === 'principal' ? 'competidores' : 'competidoresSharkTank', JSON.stringify(lista));
}

function exportarCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Posição,Nome\n";
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    lista.forEach((nome, index) => {
        csvContent += `${index + 1},${nome}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", listaAtual === 'principal' ? "lista_arrancada.csv" : "lista_shark_tank.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function restaurarBackup() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            const csv = event.target.result;
            const lines = csv.split('\n').slice(1);
            const lista = lines.map(line => line.split(',')[1]).filter(nome => nome);
            if (listaAtual === 'principal') {
                competidores = lista;
            } else {
                competidoresSharkTank = lista;
            }
            atualizarLista();
        };
        reader.readAsText(file);
    };
    input.click();
}

function moverCima(index) {
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    if (index > 0) {
        [lista[index], lista[index - 1]] = [lista[index - 1], lista[index]];
        atualizarLista();
    }
}

function moverBaixo(index) {
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    if (index < lista.length - 1) {
        [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
        atualizarLista();
    }
}

function adicionarCompetidor() {
    const nome = document.getElementById('nomeCompetidor').value.trim();
    if (!nome) {
        alert('Por favor, insira um nome válido.');
        return;
    }
    if (listaAtual === 'principal') {
        competidores.push(nome);
    } else {
        competidoresSharkTank.push(nome);
    }
    document.getElementById('nomeCompetidor').value = '';
    atualizarLista();
}

function compartilharWhatsApp() {
    let mensagem = listaAtual === 'principal' ? "Lista de Arrancada:\n" : "Lista Shark Tank:\n";
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    lista.forEach((nome, index) => {
        mensagem += `${index + 1}. ${nome}\n`;
    });
    const encodedMessage = encodeURIComponent(mensagem);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function realizarSorteio() {
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    if (lista.length === 0) {
        alert('A lista está vazia.');
        return;
    }

    let listaCopy = [...lista];
    let pares = [];
    let passeLivre = null;

    // Embaralhar a lista de competidores
    for (let i = listaCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listaCopy[i], listaCopy[j]] = [listaCopy[j], listaCopy[i]];
    }

    // Formar pares
    while (listaCopy.length > 1) {
        const competidor1 = listaCopy.pop();
        const competidor2 = listaCopy.pop();
        pares.push([competidor1, competidor2]);
    }

    // Verificar se há um competidor sem par
    if (listaCopy.length === 1) {
        passeLivre = listaCopy.pop();
    }

    // Gerar mensagem para WhatsApp
    let mensagem = "Sorteio de Pares:\n";
    pares.forEach((par, index) => {
        mensagem += `Par ${index + 1}: ${par[0]} vs ${par[1]}\n`;
    });
    if (passeLivre) {
        mensagem += `\nPasse Livre: ${passeLivre}\n`;
    }

    alert(mensagem);
    const encodedMessage = encodeURIComponent(mensagem);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function mostrarModal() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
        modal.style.display = 'block';
    }
}

function fecharModal() {
    const modal = document.getElementById('modalConfirmacao');
    if (modal) {
        modal.style.display = 'none';
    }
}

function mostrarModalRodadas() {
    const modal = document.getElementById('modalRodadas');
    if (modal) {
        modal.style.display = 'block';
    }
}

function fecharModalRodadas() {
    const modal = document.getElementById('modalRodadas');
    if (modal) {
        modal.style.display = 'none';
    }
}

function mostrarModalTema() {
    const modal = document.getElementById('modalTema');
    if (modal) {
        modal.style.display = 'block';
    }
}

function fecharModalTema() {
    const modal = document.getElementById('modalTema');
    if (modal) {
        modal.style.display = 'none';
    }
}

function limparLista() {
    if (listaAtual === 'principal') {
        competidores = [];
    } else {
        competidoresSharkTank = [];
    }
    atualizarLista();
    fecharModal();
}

function alternarTema() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('tema', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function carregarTema() {
    const tema = localStorage.getItem('tema');
    if (tema === 'light') {
        document.body.classList.add('light-mode');
    }
}

function mostrarLista(lista) {
    listaAtual = lista;
    atualizarLista();
}

function editarNome(index, novoNome) {
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    lista[index] = novoNome;
    localStorage.setItem(listaAtual === 'principal' ? 'competidores' : 'competidoresSharkTank', JSON.stringify(lista));
}

function removerCompetidor(index) {
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    lista.splice(index, 1);
    atualizarLista();
}

function iniciarRodada(rodada) {
    const lista = listaAtual === 'principal' ? competidores : competidoresSharkTank;
    if (lista.length < 2) {
        alert('A lista precisa ter pelo menos 2 competidores.');
        return;
    }

    let mensagem = `Rodada ${rodada}:\n`;
    if (rodada === 1 || rodada === 3 || rodada === 5) {
        // Rodada Par x Ímpar
        for (let i = 0; i < lista.length - 1; i += 2) {
            mensagem += `${i + 2}º x ${i + 1}º: ${lista[i + 1]} vs ${lista[i]}\n`;
        }
        if (lista.length % 2 === 1) {
            mensagem += `\nO último colocado (Ímpar) não terá desafiante: ${lista[lista.length - 1]}\n`;
        }
    } else if (rodada === 2 || rodada === 4) {
        // Rodada Ímpar x Par
        mensagem += `O 1º colocado não corre nesta rodada.\n`;
        for (let i = 2; i < lista.length; i += 2) {
            mensagem += `${i + 1}º x ${i}º: ${lista[i]} vs ${lista[i - 1]}\n`;
        }
        if (lista.length % 2 === 0) {
            mensagem += `\nO último colocado (Par) não terá desafiante: ${lista[lista.length - 1]}\n`;
        }
    }

    alert(mensagem);
    fecharModalRodadas();
}

function toggleMenu() {
    const modal = document.getElementById('modalConfiguracoes');
    if (modal) {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    }
}

function fecharModalConfiguracoes() {
    const modal = document.getElementById('modalConfiguracoes');
    if (modal) {
        modal.style.display = 'none';
    }
}

carregarTema();
atualizarLista();