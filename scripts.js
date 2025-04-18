// Função para adicionar piloto
function adicionarPiloto() {
    const nomePiloto = document.getElementById('nomePiloto').value.trim();
    if (!nomePiloto) {
        alert('O nome do piloto não pode estar vazio.');
        return;
    }

    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    let sharkTank = JSON.parse(localStorage.getItem('sharkTank')) || [];

    if (pilotos.includes(nomePiloto) || sharkTank.includes(nomePiloto)) {
        alert('Este piloto já está na lista.');
        return;
    }

    if (pilotos.length < 10) {
        pilotos.push(nomePiloto);
        localStorage.setItem('pilotos', JSON.stringify(pilotos));
    } else {
        sharkTank.push(nomePiloto);
        localStorage.setItem('sharkTank', JSON.stringify(sharkTank));
    }

    document.getElementById('nomePiloto').value = '';
    exibirPilotos();
    exibirSharkTank();
}

// Função para remover piloto
function removerPiloto(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    pilotos.splice(index, 1);
    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    exibirPilotos();
    exibirRodadas();
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
    let sharkTank = JSON.parse(localStorage.getItem('sharkTank')) || [];

    if (index < pilotos.length - 1) {
        // Move o piloto para baixo dentro da lista de pilotos
        [pilotos[index], pilotos[index + 1]] = [pilotos[index + 1], pilotos[index]];
    } else if (index === pilotos.length - 1) {
        // Se o piloto está em 10° lugar, mova-o para o último lugar no Shark Tank
        const ultimoPiloto = pilotos.pop();
        sharkTank.push(ultimoPiloto);
    }

    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    localStorage.setItem('sharkTank', JSON.stringify(sharkTank));
    exibirPilotos();
    exibirSharkTank();
}

// Função para exibir a lista de pilotos
function exibirPilotos() {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const listaPilotosDiv = document.getElementById('listaPilotos');
    listaPilotosDiv.innerHTML = '<h2>Lista de Pilotos</h2>';
    pilotos.forEach((piloto, index) => {
        const div = document.createElement('div');
        div.className = 'piloto-item';
        div.innerHTML = `
            ${index + 1}. ${piloto} 
            <div class="buttons">
                <button class="ganhou" onclick="moverPilotoParaCima(${index})">Ganhou</button>
                <button class="perdeu" onclick="moverPilotoParaBaixo(${index})">Perdeu</button>
                <button class="remove" onclick="removerPiloto(${index})">X</button>
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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(pilotos));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "backup_pilotos.json");
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
            const pilotos = JSON.parse(e.target.result);
            localStorage.setItem('pilotos', JSON.stringify(pilotos));
            exibirPilotos();
            exibirRodadas(1);
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

// Função para mover piloto para cima no Shark Tank
function moverParaCimaSharkTank(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    let sharkTank = JSON.parse(localStorage.getItem('sharkTank')) || [];

    if (index === 0) {
        // Se o piloto está no primeiro lugar do Shark Tank
        const pilotoDoSharkTank = sharkTank.shift(); // Remove o primeiro piloto do Shark Tank
        if (pilotos.length < 10) {
            pilotos.push(pilotoDoSharkTank); // Adiciona o piloto ao final da lista de pilotos
        } else {
            // Troca o último piloto da lista de pilotos com o primeiro do Shark Tank
            const ultimoPiloto = pilotos.pop(); // Remove o último piloto da lista de pilotos
            pilotos.push(pilotoDoSharkTank); // Adiciona o piloto do Shark Tank ao final da lista de pilotos
            sharkTank.unshift(ultimoPiloto); // Adiciona o último piloto da lista de pilotos ao início do Shark Tank
        }
    } else {
        // Move o piloto para cima dentro do Shark Tank
        [sharkTank[index], sharkTank[index - 1]] = [sharkTank[index - 1], sharkTank[index]];
    }

    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    localStorage.setItem('sharkTank', JSON.stringify(sharkTank));
    exibirPilotos();
    exibirSharkTank();
}

// Função para exibir a lista Shark Tank
function exibirSharkTank() {
    const sharkTank = JSON.parse(localStorage.getItem('sharkTank')) || [];
    const sharkTankDiv = document.getElementById('sharkTank');
    sharkTankDiv.innerHTML = '<h2>Shark Tank</h2>';
    sharkTank.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'shark-tank-item';
        div.innerHTML = `
            ${index + 1}. ${item}
            <div class="buttons">
                <button class="ganhou" onclick="moverParaCimaSharkTank(${index})">Ganhou</button>
                <button class="perdeu" onclick="removerSharkTank(${index})">Perdeu</button>
                <button class="remove" onclick="removerSharkTank(${index})">X</button>
            </div>
        `;
        sharkTankDiv.appendChild(div);
    });
}

// Função para mover piloto do Shark Tank para a lista de pilotos
function moverParaPilotos(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    let sharkTank = JSON.parse(localStorage.getItem('sharkTank')) || [];

    const piloto = sharkTank.splice(index, 1)[0];
    pilotos.push(piloto); // Adiciona o piloto à lista, mesmo que já esteja cheia
    localStorage.setItem('pilotos', JSON.stringify(pilotos));
    localStorage.setItem('sharkTank', JSON.stringify(sharkTank));
    exibirPilotos();
    exibirSharkTank();
}

// Função para remover piloto do Shark Tank
function removerSharkTank(index) {
    let sharkTank = JSON.parse(localStorage.getItem('sharkTank')) || [];
    sharkTank.splice(index, 1);
    localStorage.setItem('sharkTank', JSON.stringify(sharkTank));
    exibirSharkTank();
}

// Função para compartilhar no WhatsApp
function compartilharWhatsApp() {
    const pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    const rodadas = document.getElementById('rodadas').innerText || 'Nenhuma rodada exibida.';
    const mensagem = `🏎️ Lista de Pilotos:\n${pilotos.join('\n')}\n\n${rodadas}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Chama a função para exibir a lista de pilotos, Shark Tank e as rodadas quando a página carrega
window.onload = function() {
    aplicarTemaSalvo(); // Aplica o tema salvo
    exibirPilotos();
    exibirSharkTank(); // Exibe a lista Shark Tank
    exibirRodadas(1);
};