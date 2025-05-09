// Função para adicionar piloto
function adicionarPiloto() {
    const nomePiloto = document.getElementById('nomePiloto').value.trim();
    if (!nomePiloto) {
        alert('O nome do piloto não pode estar vazio.');
        return;
    }

    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];

    if (pilotos.includes(nomePiloto)) {
        alert('Este piloto já está na lista.');
        return;
    }

    pilotos.push(nomePiloto);
    localStorage.setItem('pilotos', JSON.stringify(pilotos));

    document.getElementById('nomePiloto').value = '';
    exibirPilotos();
}

// Função para remover piloto
function removerPiloto(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    pilotos.splice(index, 1); // Remove o piloto no índice especificado
    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    exibirPilotos(); // Atualiza a exibição da lista
    exibirRodadas(); // Atualiza as rodadas
}

// Função para mover piloto para cima
function moverPilotoParaCima(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    if (index > 0) {
        [pilotos[index], pilotos[index - 1]] = [pilotos[index - 1], pilotos[index]];
    } else if (index === 0) {
        // Se o piloto está no primeiro lugar, mova-o para o último lugar
        const primeiroPiloto = pilotos.shift();
        pilotos.push(primeiroPiloto);
    }
    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    exibirPilotos();
    exibirRodadas();
}

// Função para mover piloto para baixo
function moverPilotoParaBaixo(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];

    if (index < pilotos.length - 1) {
        [pilotos[index], pilotos[index + 1]] = [pilotos[index + 1], pilotos[index]];
    }

    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    exibirPilotos();
}

// Função para registrar o "rei da lista"
function registrarRei(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    let reis = JSON.parse(localStorage.getItem('reis')) || {};

    const piloto = pilotos[index];
    reis[piloto] = (reis[piloto] || 0) + 1;

    localStorage.setItem('reis', JSON.stringify(reis));
    exibirPilotos();
}

// Função para exibir a lista de pilotos
function exibirPilotos() {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const reis = JSON.parse(localStorage.getItem('reis')) || {};
    const listaPilotosDiv = document.getElementById('listaPilotos');
    listaPilotosDiv.innerHTML = '<h2>Lista de Pilotos</h2>';
    pilotos.forEach((piloto, index) => {
        const div = document.createElement('div');
        div.className = 'piloto-item';
        div.innerHTML = `
            ${index + 1}. ${piloto} 
            <span>(Rei: ${reis[piloto] || 0}x)</span>
            <div class="buttons">
                <button class="ganhou" onclick="moverPilotoParaCima(${index})">Ganhou</button>
                <button class="perdeu" onclick="moverPilotoParaBaixo(${index})">Perdeu</button>
                <button class="remove" onclick="removerPiloto(${index})">X</button>
                <button class="rei" onclick="registrarRei(${index})">👑 Rei</button>
            </div>
        `;
        listaPilotosDiv.appendChild(div);
    });
}

// Função para gerar as rodadas
function gerarRodadas(pilotos, rodada) {
    let rodadas = [];
    if (rodada % 2 === 1) { // Rodadas 1, 3, 5: Par X Impar
        for (let i = 1; i < pilotos.length; i += 2) {
            if (i < pilotos.length) {
                rodadas.push(`🏁 ${pilotos[i]} desafia ${pilotos[i - 1]} 🏁`);
            }
        }
    } else if (rodada === 2 || rodada === 4) { // Rodadas 2 e 4: O terceiro lugar desafia o segundo, o quinto desafia o quarto, etc.
        for (let i = 2; i < pilotos.length; i += 2) {
            rodadas.push(`🏁 ${pilotos[i]} desafia ${pilotos[i - 1]} 🏁`);
        }
    } else { // Outras rodadas pares
        for (let i = 1; i < pilotos.length; i++) {
            if (i % 2 === 1 && i + 1 < pilotos.length) {
                rodadas.push(`🏁 ${pilotos[i]} desafia ${pilotos[i + 1]} 🏁`);
            }
        }
    }
    return rodadas;
}

// Função para exibir as rodadas na página
function exibirRodadas(rodada) {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const rodadas = gerarRodadas(pilotos, rodada);
    const rodadasDiv = document.getElementById('rodadas');
    rodadasDiv.innerHTML = `<h2>Desafios da ${rodada}° Rodada</h2>`;
    rodadas.forEach(rodada => {
        const p = document.createElement('p');
        p.textContent = rodada;
        rodadasDiv.appendChild(p);
    });
}

// Função para abrir e fechar o modal de configurações
function toggleConfiguracoes() {
    const modal = document.getElementById('config-modal');
    modal.style.display = modal.style.display === 'none' || modal.style.display === '' ? 'block' : 'none';
}

// Função para fazer backup dos dados
function backup() {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const data = { pilotos }; // Inclui pilotos no backup
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_dados.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Função para restaurar os dados
function restaurar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.pilotos) {
                    // Restaura pilotos
                    localStorage.setItem('pilotos', JSON.stringify(data.pilotos));
                    exibirPilotos();
                    exibirRodadas(1);
                } else {
                    alert('O arquivo de backup não é válido.');
                }
            } catch (error) {
                console.error("Erro ao restaurar os dados:", error);
                alert('Erro ao restaurar os dados. Certifique-se de que o arquivo é válido.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Função para verificar e aplicar o tema salvo
function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo) {
        document.body.classList.add(temaSalvo);
    } else {
        document.body.classList.add('light'); // Tema padrão
    }
}

// Modifique a função toggleTema para salvar o tema no localStorage
function toggleTema() {
    const body = document.body;
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage.setItem('tema', 'light');
    } else {
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage.setItem('tema', 'dark');
    }
}

// Função para compartilhar no WhatsApp
function compartilharWhatsApp() {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const rodadas = document.getElementById('rodadas').innerText || 'Nenhuma rodada exibida.';
    const mensagem = `🏎️ Lista de Pilotos:\n${pilotos.join('\n')}\n\n${rodadas}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Função para compartilhar a lista final de pilotos
function compartilharListaFinal() {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const reis = JSON.parse(localStorage.getItem('reis')) || {};

    if (pilotos.length === 0) {
        alert('A lista de pilotos está vazia.');
        return;
    }

    const mensagem = pilotos
        .map((piloto, index) => {
            const reiBadge = reis[piloto] ? ` 🏆${reis[piloto]}x` : ''; // Adiciona o troféu se for rei
            return `${index + 1}. ${piloto}${reiBadge}`;
        })
        .join('\n');

    const url = `https://wa.me/?text=${encodeURIComponent(`🏁 Lista de Pilotos 🏁\n\n${mensagem}`)}`;
    window.open(url, '_blank');
}

// Ajuste para localStorage na hospedagem do GitHub
function verificarLocalStorage() {
    console.log("Verificando localStorage...");
    if (!localStorage.getItem('pilotos')) {
        console.log("Inicializando 'pilotos' no localStorage.");
        localStorage.setItem('pilotos', JSON.stringify([]));
    }
    if (!localStorage.getItem('tema')) {
        console.log("Inicializando 'tema' no localStorage.");
        localStorage.setItem('tema', 'light');
    }
    console.log("localStorage verificado:", localStorage);
}

// Chama a função para inicializar o localStorage e exibir os dados
window.onload = function() {
    verificarLocalStorage(); // Inicializa o localStorage se necessário
    aplicarTemaSalvo(); // Aplica o tema salvo
    exibirPilotos();
    exibirRodadas(1);
};