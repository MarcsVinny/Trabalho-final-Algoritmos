"use strict";
class Sobrevivente {
    constructor(nome, idade, genero, vidas, errosCometidos, status) {
        this.nome = nome;
        this.idade = idade;
        this.genero = genero;
        this.vidas = vidas;
        this.errosCometidos = errosCometidos;
        this.status = status;
    }
}
window.onload = function () {
    let secBoasVindas = document.getElementById("boasVindas");
    let secCadastro = document.getElementById("cadastro");
    let secQuiz = document.getElementById("quiz");
    let btnComecar = document.getElementById("btnComecar");
    let btnCadastrar = document.getElementById("btnCadastrar");
    let mensagem = document.getElementById("mensagem");
    // Variáveis para controle do quiz
    let personagem = null;
    let perguntaAtual = 0;
    btnComecar.onclick = function () {
        secBoasVindas.style.display = "none";
        secCadastro.style.display = "block";
    };
    btnCadastrar.onclick = function () {
        let nomeInput = document.getElementById("nomeJogador")
            .value.trim();
        let idadeInput = document.getElementById("idadeJogador")
            .value.trim();
        let generoInput = document.getElementById("generoJogador")
            .value;
        // Validações simples
        if (nomeInput === "" || !isNaN(Number(nomeInput))) {
            mensagem.textContent = "Nome inválido. Por favor, digite um nome válido.";
            return;
        }
        let idadeNum = parseInt(idadeInput);
        if (isNaN(idadeNum) || idadeNum < 5 || idadeNum > 120) {
            mensagem.textContent = "Idade inválida. Informe uma idade entre 5 e 120 anos.";
            return;
        }
        if (generoInput === "") {
            mensagem.textContent = "Por favor, selecione um gênero.";
            return;
        }
        mensagem.textContent = "";
        personagem = new Sobrevivente(nomeInput, idadeNum, generoInput, 3, 0, "vivo");
        alert(`Bem-vindo, ${personagem.nome}! Você tem ${personagem.vidas} vidas. Prepare-se para o apocalipse zumbi.`);
        secCadastro.style.display = "none";
        secQuiz.style.display = "block";
        mostrarPergunta();
    };
    // Array de perguntas do quiz
    let perguntas = [
        {
            texto: "O que é uma variável em programação?",
            opcoes: [
                "Um espaço para armazenar dados",
                "Um tipo de dado específico",
                "Um erro no código",
                "Um comentário no programa",
            ],
            correta: 0,
        },
        {
            texto: "Qual estrutura usamos para tomar decisões em TypeScript?",
            opcoes: ["for", "if/else", "while", "function"],
            correta: 1,
        },
        {
            texto: "Como declaramos uma função em TypeScript?",
            opcoes: [
                "function minhaFuncao() {}",
                "def minhaFuncao() {}",
                "func minhaFuncao() {}",
                "fun minhaFuncao() {}",
            ],
            correta: 0,
        },
        // ... você pode adicionar mais perguntas aqui ...
    ];
    // Função para mostrar a pergunta atual
    function mostrarPergunta() {
        if (!personagem)
            return;
        if (perguntaAtual >= perguntas.length) {
            alert("Parabéns! Você sobreviveu ao apocalipse zumbi e passou na prova!");
            // Pode reiniciar o jogo ou fazer algo aqui
            return;
        }
        let pergunta = perguntas[perguntaAtual];
        let perguntaTexto = document.getElementById("perguntaTexto");
        let opcoesDiv = document.getElementById("opcoes");
        let vidasRestantes = document.getElementById("vidasRestantes");
        perguntaTexto.textContent = pergunta.texto;
        vidasRestantes.textContent = `Vidas restantes: ${personagem.vidas}`;
        // Limpa opções antigas
        opcoesDiv.innerHTML = "";
        // Cria botão para cada opção
        pergunta.opcoes.forEach(function (opcao, index) {
            let botaoOpcao = document.createElement("button");
            botaoOpcao.textContent = opcao;
            botaoOpcao.style.margin = "8px";
            botaoOpcao.onclick = function () {
                verificarResposta(index);
            };
            opcoesDiv.appendChild(botaoOpcao);
        });
    }
    // Função para verificar a resposta escolhida
    function verificarResposta(indiceEscolhido) {
        if (!personagem)
            return;
        let pergunta = perguntas[perguntaAtual];
        if (indiceEscolhido === pergunta.correta) {
            alert("Resposta correta! Você sobrevive por enquanto...");
            perguntaAtual++;
            mostrarPergunta();
        }
        else {
            personagem.vidas--;
            personagem.errosCometidos++;
            if (personagem.vidas <= 0) {
                alert(`Você foi devorado pelos zumbis após ${personagem.errosCometidos} erros... Fim de jogo.`);
                window.location.reload();
            }
            else {
                alert(`Resposta errada! Você perdeu uma vida. Vidas restantes: ${personagem.vidas}`);
                mostrarPergunta();
            }
        }
    }
};
