// Configuração do Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função para mostrar o formulário de registro
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// Função para mostrar o formulário de login
function showLoginForm() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Função para registrar usuário
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.sendEmailVerification();
        alert('Usuário registrado com sucesso. Verifique seu email para ativar sua conta.');
        showLoginForm();
    } catch (error) {
        alert('Erro ao registrar usuário: ' + error.message);
    }
});

// Função para login de usuário
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        if (!userCredential.user.emailVerified) {
            alert('Por favor, verifique seu email antes de fazer login.');
            return;
        }
        alert('Login bem-sucedido');
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'block';
        exibirPilotos();
        exibirRodadas(1);
    } catch (error) {
        alert('Erro ao fazer login: ' + error.message);
    }
});

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
        localStorage.setItem('pilotos', JSON.stringify(pilotos));
        exibirPilotos();
        exibirRodadas();
    }
}

// Função para mover piloto para baixo
function moverPilotoParaBaixo(index) {
    let pilotos = JSON.parse(localStorage.getItem('pilotos')) || [];
    if (index < pilotos.length - 1) {
        [pilotos[index], pilotos[index + 1]] = [pilotos[index + 1], pilotos[index]];
        localStorage.setItem('pilotos', JSON.stringify(pilotos));
        exibirPilotos();
        exibirRodadas();
    }
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
                <button class="remove" onclick="removerPiloto(${index})">X</button>
                <button class="move-up" onclick="moverPilotoParaCima(${index})">⬆️</button>
                <button class="move-down" onclick="moverPilotoParaBaixo(${index})">⬇️</button>
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
    } else { // Rodadas 2, 4: Impar X Par
        for (let i = 2; i < pilotos.length; i += 2) {
            if (i < pilotos.length) {
                rodadas.push(`🏁 ${pilotos[i - 1]} desafia ${pilotos[i]} 🏁`);
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
    rodadasDiv.innerHTML = `<h2>Resultado da Rodada ${rodada}</h2>`;
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

// Função para alternar entre temas claro e escuro
function toggleTema() {
    const body = document.body;
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        body.classList.add('light');
    } else {
        body.classList.remove('light');
        body.classList.add('dark');
    }
}

// Chama a função para exibir a lista de pilotos e as rodadas quando a página carrega
window.onload = function() {
    // Verifica se o usuário está autenticado
    auth.onAuthStateChanged(user => {
        if (user) {
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('main-container').style.display = 'block';
            exibirPilotos();
            exibirRodadas(1);
        } else {
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('main-container').style.display = 'none';
        }
    });
};