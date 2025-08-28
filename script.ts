// =========================
// === CLASSES ORIGINAIS ===
// =========================

// Classe para representar uma tarefa com prazo (entrega com data definida)
class TarefaPrazo {
  tipo: string = "prazo";
  descricao: string;
  nivelDificuldade: string;
  dataEntrega: string;
  concluida: boolean;

  constructor(desc: string, nivel: string, data: string) {
    this.descricao = desc;
    this.nivelDificuldade = nivel;
    this.dataEntrega = data;
    this.concluida = false;
  }

  mostrar(numeroTarefa: number): string {
    let status: string = this.concluida ? "✅" : "⌛";
    return `${numeroTarefa + 1}. [Prazo] ${this.descricao} (${this.nivelDificuldade}) - Entrega: ${this.dataEntrega} - ${status}`;
  }
}

// Classe para representar uma tarefa de rotina
class TarefaRotina {
  tipo: string = "rotina";
  descricao: string;
  nivelDificuldade: string;
  diasSemana: string;
  horarioInicio: string;
  horarioFim: string;
  concluida: boolean;

  constructor(desc: string, nivel: string, dias: string, inicio: string, fim: string) {
    this.descricao = desc;
    this.nivelDificuldade = nivel;
    this.diasSemana = dias;
    this.horarioInicio = inicio;
    this.horarioFim = fim;
    this.concluida = false;
  }

  mostrar(numeroTarefa: number): string {
    let status: string = this.concluida ? "✅" : "⌛";
    return `${numeroTarefa + 1}. [Rotina] ${this.descricao} (${this.nivelDificuldade}) - ${this.diasSemana} das ${this.horarioInicio} às ${this.horarioFim} - ${status}`;
  }
}

// Tipo genérico que pode ser tanto TarefaPrazo quanto TarefaRotina
type Tarefa = TarefaPrazo | TarefaRotina;

// Classe responsável por gerenciar as tarefas cadastradas
class TarefaBD {
  tarefas: Tarefa[] = [];

  adicionar(t: Tarefa): void {
    this.tarefas.push(t);
  }

  listar(): string {
    if (this.tarefas.length === 0) return "📭 Não há nenhuma tarefa cadastrada.";

    let resultado: string = "";
    for (let i = 0; i < this.tarefas.length; i++) {
      resultado += this.tarefas[i].mostrar(i);
      if (i < this.tarefas.length - 1) resultado += "\n";
    }
    return resultado;
  }

  concluir(pos: number): void {
    if (pos >= 0 && pos < this.tarefas.length) {
      this.tarefas[pos].concluida = true;
    }
  }

  remover(pos: number): void {
    if (pos >= 0 && pos < this.tarefas.length) {
      this.tarefas.splice(pos, 1);
    }
  }

  foco(): string {
    let tarefasPrazo: TarefaPrazo[] = [];
    let tarefasRotina: TarefaRotina[] = [];

    for (let i = 0; i < this.tarefas.length; i++) {
      let tarefa: Tarefa = this.tarefas[i];
      if (tarefa.tipo === "prazo" && !tarefa.concluida) {
        tarefasPrazo.push(tarefa as TarefaPrazo);
      } else if (tarefa.tipo === "rotina" && !tarefa.concluida) {
        tarefasRotina.push(tarefa as TarefaRotina);
      }
    }

    if (tarefasPrazo.length === 0 && tarefasRotina.length === 0) {
      return "🎉 Nenhuma pendência! Aproveite seu tempo.";
    }

    // Função auxiliar para converter data dd/mm/yyyy para yyyy-mm-dd
    function formatarData(data: string): string {
      let partes: string[] = data.split("/");
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    // Ordena as tarefas de prazo por data
    tarefasPrazo.sort((a, b) => {
      let dataA: string = formatarData(a.dataEntrega);
      let dataB: string = formatarData(b.dataEntrega);
      return dataA > dataB ? 1 : -1;
    });

    let foco: string = "🎯 FOCO:\n";

    if (tarefasPrazo.length > 0) {
      foco += "\n🗓️ Tarefas com prazo:\n";
      for (let i = 0; i < tarefasPrazo.length; i++) {
        let t: TarefaPrazo = tarefasPrazo[i];
        let status: string = t.concluida ? "Concluída ✅" : "Pendente ⌛";

        if (i === 0) {
          foco += `[FOCO PRINCIPAL] : ${t.descricao} (${t.nivelDificuldade}) - Entrega: ${t.dataEntrega} - ${status}\n\n`;
        } else {
          foco += `- ${t.descricao} (${t.nivelDificuldade}) - Entrega: ${t.dataEntrega} - ${status}\n`;
        }
      }
    }

    if (tarefasRotina.length > 0) {
      foco += "\n🔁 Tarefas de rotina:\n";
      for (let i = 0; i < tarefasRotina.length; i++) {
        let t: TarefaRotina = tarefasRotina[i];
        let status: string = t.concluida ? "Concluída ✅" : "Pendente ⌛";
        foco += `- ${t.descricao} (${t.nivelDificuldade}) - ${t.diasSemana} das ${t.horarioInicio} às ${t.horarioFim} - ${status}\n`;
      }
    }

    return foco;
  }
}

// ===============================
// === INTEGRAÇÃO COM A INTERFACE ===
// ===============================

const form = document.getElementById("form-tarefa") as HTMLFormElement;
const listaTarefas = document.getElementById("lista-tarefas") as HTMLUListElement;
const focoBtn = document.getElementById("foco-btn") as HTMLButtonElement;
const focoOutput = document.getElementById("foco-output") as HTMLDivElement;
const tipoSelect = document.getElementById("tipo-tarefa") as HTMLSelectElement;
const extraFields = document.getElementById("extra-fields") as HTMLDivElement;

const bd = new TarefaBD();

// Atualiza os campos extras dinamicamente
tipoSelect.addEventListener("change", () => {
  if (tipoSelect.value === "prazo") {
    extraFields.innerHTML = `
      <label>Data de entrega:</label>
      <input type="date" id="data-entrega" required>
    `;
  } else {
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
(window as any).concluirTarefa = (i: number) => {
  bd.concluir(i);
  atualizarLista();
};

(window as any).removerTarefa = (i: number) => {
  bd.remover(i);
  atualizarLista();
};

// Evento do formulário para adicionar novas tarefas
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = (document.getElementById("desc") as HTMLInputElement).value;
  const nivel = (document.getElementById("nivel") as HTMLSelectElement).value;

  if (tipoSelect.value === "prazo") {
    const data = (document.getElementById("data-entrega") as HTMLInputElement).value;
    bd.adicionar(new TarefaPrazo(desc, nivel, data));
  } else {
    const dias = (document.getElementById("dias") as HTMLInputElement).value;
    const inicio = (document.getElementById("inicio") as HTMLInputElement).value;
    const fim = (document.getElementById("fim") as HTMLInputElement).value;
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
