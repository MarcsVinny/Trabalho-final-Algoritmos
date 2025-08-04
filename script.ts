class Tarefa {
  descricao: string;
  nivelDificuldade: string;
  data: string;
  concluida: boolean;

  constructor(desc: string, nivel: string, data: string) {
    this.descricao = desc;
    this.nivelDificuldade = nivel;
    this.data = data;
    this.concluida = false;
  }
}

class TarefaBD {
  tarefas: Tarefa[] = [];

  adicionar(t: Tarefa) {
    this.tarefas.push(t);
  }

  listar(): string {
    if (this.tarefas.length === 0) return "📭 Nenhuma tarefa ainda.";
    return this.tarefas.map((t, i) =>
      `${i + 1}. ${t.descricao} (${t.nivelDificuldade}) - ${t.data} - ${t.concluida ? "✅" : "⌛"}`
    ).join("\n");
  }

  concluir(pos: number) {
    if (pos >= 0 && pos < this.tarefas.length) {
      this.tarefas[pos].concluida = true;
    }
  }

  remover(pos: number) {
    if (pos >= 0 && pos < this.tarefas.length) {
      this.tarefas.splice(pos, 1);
    }
  }

  proximaPendente(): Tarefa | null {
    return this.tarefas.find(t => !t.concluida) || null;
  }
}

function executarAgenda() {
  let bd = new TarefaBD();
  let sair = false;

  while (!sair) {
    let menu = `
🧠 AGENDA PARA TDAH
1 - Adicionar tarefa
2 - Listar tarefas
3 - Concluir tarefa
4 - Remover tarefa
5 - Foco (mostrar próxima)
0 - Sair
Escolha uma opção:`;
    let opcao = prompt(menu);

    if (opcao === null) break;

    if (opcao === "1") {
      let desc = prompt("Descrição:");
      let nivel = prompt("Dificuldade (leve, médio, difícil):");
      let data = prompt("Data:");
      if (desc && nivel && data) {
        bd.adicionar(new Tarefa(desc, nivel, data));
        alert("✅ Tarefa adicionada!");
      }
    }

    else if (opcao === "2") {
      alert("📋 Tarefas:\n" + bd.listar());
    }

    else if (opcao === "3") {
      let pos = Number(prompt("Número da tarefa a concluir:")) - 1;
      bd.concluir(pos);
      alert("✅ Concluída!");
    }

    else if (opcao === "4") {
      let pos = Number(prompt("Número da tarefa a remover:")) - 1;
      bd.remover(pos);
      alert("🗑️ Removida!");
    }

    else if (opcao === "5") {
      let foco = bd.proximaPendente();
      if (foco) {
        let confirmar = prompt(`🎯 FOCO:\n${foco.descricao} (${foco.nivelDificuldade}) - ${foco.data}\nMarcar como concluída? (s/n)`);
        if (confirmar?.toLowerCase() === "s") {
          foco.concluida = true;
          alert("✨ Tarefa concluída. Você está indo muito bem!");
        }
      } else {
        alert("🎉 Nenhuma pendência! Aproveite seu tempo.");
      }
    }

    else if (opcao === "0") {
      sair = true;
      alert("👋 Até mais!");
    }

    else {
      alert("⚠️ Opção inválida.");
    }
  }
}

executarAgenda();
