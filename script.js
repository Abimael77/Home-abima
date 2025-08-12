// Elementos principais
const telaPrincipal = document.getElementById('tela-principal');
const formConta = document.getElementById('form-conta');
const formLogin = document.getElementById('form-login');
const paginaUsuario = document.getElementById('pagina-usuario');

const btnAbrirConta = document.getElementById('btn-abrir-conta');
const btnAbrirContaMain = document.getElementById('btn-abrir-conta-main');
const btnLogin = document.getElementById('btn-login');
const btnLoginMain = document.getElementById('btn-login-main');

const btnCancelarConta = document.getElementById('cancelar-conta');
const btnCancelarLogin = document.getElementById('cancelar-login');
const btnSalvarConta = document.getElementById('salvar-conta');
const btnEntrar = document.getElementById('entrar');
const btnEsqueciSenha = document.getElementById('esqueci-senha');

const mensagemBemVindo = document.getElementById('mensagem-bemvindo');
const saldoUsuario = document.getElementById('saldo-usuario');
const listaCarteira = document.getElementById('lista-carteira');
const listaAcoes = document.getElementById('lista-acoes');

const btnComprar = document.getElementById('comprar-acao');
const btnVender = document.getElementById('vender-acao');
const codigoAcao = document.getElementById('codigo-acao');
const quantidadeAcao = document.getElementById('quantidade-acao');

// Lista simulada de ações com preços
let precosAcoes = {
    "PETR4": 32.50,
    "VALE3": 67.20,
    "ITUB4": 28.40,
    "BBDC4": 22.10,
    "BBAS3": 48.30
};

// Funções de navegação
function mostrarFormularioConta() {
    telaPrincipal.classList.add('oculto');
    formLogin.classList.add('oculto');
    formConta.classList.remove('oculto');
}

function mostrarFormularioLogin() {
    telaPrincipal.classList.add('oculto');
    formConta.classList.add('oculto');
    formLogin.classList.remove('oculto');
}

function voltarMenuPrincipal() {
    formConta.classList.add('oculto');
    formLogin.classList.add('oculto');
    paginaUsuario.classList.add('oculto');
    telaPrincipal.classList.remove('oculto');
}

function mostrarPaginaUsuario(usuario) {
    formLogin.classList.add('oculto');
    telaPrincipal.classList.add('oculto');
    paginaUsuario.classList.remove('oculto');
    mensagemBemVindo.textContent = `Bem-vindo ao Home Abim, ${usuario.nome}`;
    saldoUsuario.textContent = `Saldo: R$ ${usuario.saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    atualizarTabelaAcoes();
    atualizarCarteira(usuario);
}

function atualizarTabelaAcoes() {
    listaAcoes.innerHTML = "";
    for (let codigo in precosAcoes) {
        listaAcoes.innerHTML += `<tr><td>${codigo}</td><td>R$ ${precosAcoes[codigo].toFixed(2)}</td></tr>`;
    }
}

function atualizarCarteira(usuario) {
    listaCarteira.innerHTML = "";
    if (!usuario.carteira || Object.keys(usuario.carteira).length === 0) {
        listaCarteira.innerHTML = "<li>Carteira vazia</li>";
        return;
    }
    for (let codigo in usuario.carteira) {
        listaCarteira.innerHTML += `<li>${codigo}: ${usuario.carteira[codigo]} ações</li>`;
    }
}

// Eventos de navegação
btnAbrirConta.addEventListener('click', mostrarFormularioConta);
btnAbrirContaMain.addEventListener('click', mostrarFormularioConta);
btnLogin.addEventListener('click', mostrarFormularioLogin);
btnLoginMain.addEventListener('click', mostrarFormularioLogin);

btnCancelarConta.addEventListener('click', voltarMenuPrincipal);
btnCancelarLogin.addEventListener('click', voltarMenuPrincipal);

// Esqueci minha senha
btnEsqueciSenha.addEventListener('click', () => {
    const contaSalva = JSON.parse(localStorage.getItem("contaUsuario"));
    if (contaSalva) {
        alert(`Sua senha é: ${contaSalva.senha}`);
    } else {
        alert("Nenhuma conta cadastrada.");
    }
});

// Salvar conta
btnSalvarConta.addEventListener('click', () => {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    const conta = {
        nome,
        email,
        senha,
        saldo: 100000,
        carteira: {}
    };

    localStorage.setItem("contaUsuario", JSON.stringify(conta));
    alert("Conta criada com sucesso! Agora faça login.");
    voltarMenuPrincipal();
});

// Login
btnEntrar.addEventListener('click', () => {
    const emailLogin = document.getElementById('login-email').value;
    const senhaLogin = document.getElementById('login-senha').value;

    const contaSalva = JSON.parse(localStorage.getItem("contaUsuario"));

    if (!contaSalva) {
        alert("Nenhuma conta cadastrada!");
        return;
    }

    if (emailLogin === contaSalva.email && senhaLogin === contaSalva.senha) {
        mostrarPaginaUsuario(contaSalva);
    } else {
        alert("E-mail ou senha incorretos!");
    }
});

// Comprar ação
btnComprar.addEventListener('click', () => {
    let conta = JSON.parse(localStorage.getItem("contaUsuario"));
    let codigo = codigoAcao.value.toUpperCase();
    let quantidade = parseInt(quantidadeAcao.value);

    if (!codigo || quantidade <= 0) {
        alert("Preencha código e quantidade corretamente!");
        return;
    }

    if (!precosAcoes[codigo]) {
        alert("Ação não encontrada!");
        return;
    }

    let custo = precosAcoes[codigo] * quantidade;
    if (conta.saldo >= custo) {
        conta.saldo -= custo;
        conta.carteira[codigo] = (conta.carteira[codigo] || 0) + quantidade;
        localStorage.setItem("contaUsuario", JSON.stringify(conta));
        mostrarPaginaUsuario(conta);
        alert(`Compra realizada: ${quantidade}x ${codigo} por R$ ${custo.toFixed(2)}`);
    } else {
        alert("Saldo insuficiente!");
    }
});

// Vender ação
btnVender.addEventListener('click', () => {
    let conta = JSON.parse(localStorage.getItem("contaUsuario"));
    let codigo = codigoAcao.value.toUpperCase();
    let quantidade = parseInt(quantidadeAcao.value);

    if (!codigo || quantidade <= 0) {
        alert("Preencha código e quantidade corretamente!");
        return;
    }

    if (!conta.carteira[codigo] || conta.carteira[codigo] < quantidade) {
        alert("Você não possui essa quantidade para vender!");
        return;
    }

    let ganho = precosAcoes[codigo] * quantidade;
    conta.carteira[codigo] -= quantidade;
    if (conta.carteira[codigo] === 0) delete conta.carteira[codigo];
    conta.saldo += ganho;
    localStorage.setItem("contaUsuario", JSON.stringify(conta));
    mostrarPaginaUsuario(conta);
    alert(`Venda realizada: ${quantidade}x ${codigo} por R$ ${ganho.toFixed(2)}`);
});
