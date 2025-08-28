"use strict";
// =========================
// === CLASSES ORIGINAIS ===
// =========================
// Classe para representar uma tarefa com prazo (entrega com data definida)
class TarefaPrazo {
    constructor(desc, nivel, data) {
        this.tipo = "prazo";
        this.descricao = desc;
        this.nivelDificuldade = nivel;
        this.dataEntrega = data;
        this.concluida = false;
    }
    mostrar(numeroTarefa) {
        let status = this.concluida ? "✅" : "⌛";
        return `${numeroTarefa + 1}. [Prazo] ${this.descricao} (${this.nivelDificuldade}) - Entrega: ${this.dataEntrega} - ${status}`;
    }
}
// Classe para representar uma tarefa de rotina
class TarefaRotina {
    constructor(desc, nivel, dias, inicio, fim) {
        this.tipo = "rotina";
        this.descricao = desc;
        this.nivelDificuldade = nivel;
        this.diasSemana = dias;
        this.horarioInicio = inicio;
        this.horarioFim = fim;
        this.concluida = false;
    }
    mostrar(numeroTarefa) {
        let status = this.concluida ? "✅" : "⌛";
        return `${numeroTarefa + 1}. [Rotina] ${this.descricao} (${this.nivelDificuldade}) - ${this.diasSemana} das ${this.horarioInicio} às ${this.horarioFim} - ${status}`;
    }
}
// Classe responsável por gerenciar as tarefas cadastradas
class TarefaBD {
    constructor() {
        this.tarefas = [];
    }
    adicionar(t) {
        this.tarefas.push(t);
    }
    listar() {
        if (this.tarefas.length === 0)
            return "📭 Não há nenhuma tarefa cadastrada.";
        let resultado = "";
        for (let i = 0; i < this.tarefas.length; i++) {
            resultado += this.tarefas[i].mostrar(i);
            if (i < this.tarefas.length - 1)
                resultado += "\n";
        }
        return resultado;
    }
    concluir(pos) {
        if (pos >= 0 && pos < this.tarefas.length) {
            this.tarefas[pos].concluida = true;
        }
    }
    remover(pos) {
        if (pos >= 0 && pos < this.tarefas.length) {
            this.tarefas.splice(pos, 1);
        }
    }
    foco() {
        let tarefasPrazo = [];
        let tarefasRotina = [];
        for (let i = 0; i < this.tarefas.length; i++) {
            let tarefa = this.tarefas[i];
            if (tarefa.tipo === "prazo" && !tarefa.concluida) {
                tarefasPrazo.push(tarefa);
            }
            else if (tarefa.tipo === "rotina" && !tarefa.concluida) {
                tarefasRotina.push(tarefa);
            }
        }
        if (tarefasPrazo.length === 0 && tarefasRotina.length === 0) {
            return "🎉 Nenhuma pendência! Aproveite seu tempo.";
        }
        // Função auxiliar para converter data dd/mm/yyyy para yyyy-mm-dd
        function formatarData(data) {
            let partes = data.split("/");
            return `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
        // Ordena as tarefas de prazo por data
        tarefasPrazo.sort((a, b) => {
            let dataA = formatarData(a.dataEntrega);
            let dataB = formatarData(b.dataEntrega);
            return dataA > dataB ? 1 : -1;
        });
        let foco = "🎯 FOCO:\n";
        if (tarefasPrazo.length > 0) {
            foco += "\n🗓️ Tarefas com prazo:\n";
            for (let i = 0; i < tarefasPrazo.length; i++) {
                let t = tarefasPrazo[i];
                let status = t.concluida ? "Concluída ✅" : "Pendente ⌛";
                if (i === 0) {
                    foco += `[FOCO PRINCIPAL] : ${t.descricao} (${t.nivelDificuldade}) - Entrega: ${t.dataEntrega} - ${status}\n\n`;
                }
                else {
                    foco += `- ${t.descricao} (${t.nivelDificuldade}) - Entrega: ${t.dataEntrega} - ${status}\n`;
                }
            }
        }
        if (tarefasRotina.length > 0) {
            foco += "\n🔁 Tarefas de rotina:\n";
            for (let i = 0; i < tarefasRotina.length; i++) {
                let t = tarefasRotina[i];
                let status = t.concluida ? "Concluída ✅" : "Pendente ⌛";
                foco += `- ${t.descricao} (${t.nivelDificuldade}) - ${t.diasSemana} das ${t.horarioInicio} às ${t.horarioFim} - ${status}\n`;
            }
        }
        return foco;
    }
}
// ===============================
// === INTEGRAÇÃO COM A INTERFACE ===
// ===============================
const form = document.getElementById("form-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const focoBtn = document.getElementById("foco-btn");
const focoOutput = document.getElementById("foco-output");
const tipoSelect = document.getElementById("tipo-tarefa");
const extraFields = document.getElementById("extra-fields");
const bd = new TarefaBD();
// Atualiza os campos extras dinamicamente
tipoSelect.addEventListener("change", () => {
    if (tipoSelect.value === "prazo") {
        extraFields.innerHTML = `
      <label>Data de entrega:</label>
      <input type="date" id="data-entrega" required>
    `;
    }
    else {
        extraFields.innerHTML = `
      <label>Dias da semana:</label>
      <input type="text" id="dias" placeholder="Ex: Seg, Qua, Sex" required>
      <label>Horário início:</label>
      <input type="time" id="inicio" required>
      <label>Horário fim:</label>
      <input type="time" id="fim" required>
    `;
    }
});
// Inicializa campos ao carregar a página
tipoSelect.dispatchEvent(new Event("change"));
// Função para atualizar a lista de tarefas na tela
function atualizarLista() {
    listaTarefas.innerHTML = "";
    bd.tarefas.forEach((tarefa, i) => {
        const li = document.createElement("li");
        li.className = "tarefa-item";
        li.innerHTML = `
      <span>${tarefa.mostrar(i)}</span>
      <div class="tarefa-btns">
        <button onclick="concluirTarefa(${i})">✅</button>
        <button onclick="removerTarefa(${i})">🗑️</button>
      </div>
    `;
        listaTarefas.appendChild(li);
    });
}
// Funções globais para concluir e remover tarefas
window.concluirTarefa = (i) => {
    bd.concluir(i);
    atualizarLista();
};
window.removerTarefa = (i) => {
    bd.remover(i);
    atualizarLista();
};
// Evento do formulário para adicionar novas tarefas
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const desc = document.getElementById("desc").value;
    const nivel = document.getElementById("nivel").value;
    if (tipoSelect.value === "prazo") {
        const data = document.getElementById("data-entrega").value;
        bd.adicionar(new TarefaPrazo(desc, nivel, data));
    }
    else {
        const dias = document.getElementById("dias").value;
        const inicio = document.getElementById("inicio").value;
        const fim = document.getElementById("fim").value;
        bd.adicionar(new TarefaRotina(desc, nivel, dias, inicio, fim));
    }
    form.reset();
    tipoSelect.dispatchEvent(new Event("change"));
    atualizarLista();
});
// Botão para ver tarefas urgentes
focoBtn.addEventListener("click", () => {
    focoOutput.textContent = bd.foco();
});
