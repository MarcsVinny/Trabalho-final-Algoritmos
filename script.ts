// Classe para representar uma tarefa com prazo (entrega com data definida)
class TarefaPrazo {
  tipo: string = "prazo";
  descricao: string;
  nivelDificuldade: string;
  dataEntrega: string;
  concluida: boolean;

  // Construtor: define os dados principais de uma tarefa com prazo
  constructor(desc: string, nivel: string, data: string) {
    this.descricao = desc;
    this.nivelDificuldade = nivel;
    this.dataEntrega = data;
    this.concluida = false; // Começa como não concluída
  }

  // Retorna uma string com as informações formatadas da tarefa
  mostrar(numeroTarefa: number): string {
    return `${numeroTarefa + 1}. [Prazo] ${this.descricao} (${this.nivelDificuldade}) - Entrega: ${this.dataEntrega} - ${this.concluida ? "✅" : "⌛"}`;
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

  // Retorna a tarefa formatada para exibição
  mostrar(numeroTarefa: number): string {
    let status: string = this.concluida ? "Concluída ✅" : "Pendente ⌛";
    return `${numeroTarefa + 1}. [Rotina] ${this.descricao} (${this.nivelDificuldade}) - ${this.diasSemana} das ${this.horarioInicio} às ${this.horarioFim} - ${status}`;
  }
}

// Tipo que representa uma tarefa genérica
type Tarefa = TarefaPrazo | TarefaRotina;

// Classe responsável por gerenciar as tarefas
class TarefaBD {
  tarefas: Tarefa[] = [];

  // Adiciona uma nova tarefa
  adicionar(t: Tarefa): void {
    this.tarefas.push(t);
  }

  // Lista todas as tarefas formatadas
  listar(): string {
    if (this.tarefas.length === 0) return "📭 Não há nenhuma tarefa cadastrada.";
    return this.tarefas.map((tarefa, i) => tarefa.mostrar(i)).join("\n");
  }

  // Marca uma tarefa como concluída
  concluir(pos: number): void {
    if (pos >= 0 && pos < this.tarefas.length) {
      this.tarefas[pos].concluida = true;
    }
  }

  // Remove uma tarefa da lista
  remover(pos: number): void {
    if (pos >= 0 && pos < this.tarefas.length) {
      this.tarefas.splice(pos, 1);
    }
  }

  // Mostra as tarefas mais urgentes (foco)
  foco(): string {
    let tarefasPrazo: TarefaPrazo[] = [];
    let tarefasRotina: TarefaRotina[] = [];

    // Separa tarefas pendentes por tipo
    for (let i: number = 0; i < this.tarefas.length; i++) {
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

    // Função para reformatar data para ordenação (aaaa-mm-dd)
    function formatarData(data: string): string {
      let partes: string[] = data.split("/");
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }

    // Ordena as tarefas com prazo pela data
    tarefasPrazo.sort((a: TarefaPrazo, b: TarefaPrazo) => {
      let dataA: string = formatarData(a.dataEntrega);
      let dataB: string = formatarData(b.dataEntrega);
      return dataA > dataB ? 1 : -1;
    });

    let foco: string = "🎯 FOCO:\n";

    // Exibe tarefas com prazo
    if (tarefasPrazo.length > 0) {
      foco += "\n🗓️ Tarefas com prazo:\n";
      for (let i: number = 0; i < tarefasPrazo.length; i++) {
        let t: TarefaPrazo = tarefasPrazo[i];
        let status: string = t.concluida ? "Concluída ✅" : "Pendente ⌛";
        if (i === 0) {
          foco += `[FOCO PRINCIPAL] : ${t.descricao} (${t.nivelDificuldade}) - Entrega: ${t.dataEntrega} - ${status}\n\n`;
        } else {
          foco += `- ${t.descricao} (${t.nivelDificuldade}) - Entrega: ${t.dataEntrega} - ${status}\n`;
        }
      }
    }

    // Exibe tarefas de rotina
    if (tarefasRotina.length > 0) {
      foco += "\n🔁 Tarefas de rotina:\n";
      for (let i: number = 0; i < tarefasRotina.length; i++) {
        let t: TarefaRotina = tarefasRotina[i];
        let status: string = t.concluida ? "Concluída ✅" : "Pendente ⌛";
        foco += `- ${t.descricao} (${t.nivelDificuldade}) - ${t.diasSemana} das ${t.horarioInicio} às ${t.horarioFim} - ${status}\n`;
      }
    }

    return foco;
  }
}

// Função principal que executa o menu interativo do sistema
function executarAgenda(): void {
  let bd: TarefaBD = new TarefaBD();
  let sair: boolean = false;

  while (!sair) {
    // Mostra o menu para o usuário
    let menu: string = `
🧠 FOCO FÁCIL
1 - Adicionar tarefa
2 - Foco (Mostrar as pendências mais urgentes)!
3 - Listar histórico de tarefas
4 - Concluir tarefa
5 - Remover tarefa
6 - Sair
Escolha uma opção:`;

    let opcao: string | null = prompt(menu);
    if (opcao === null) break;

    // Adicionar nova tarefa
    if (opcao === "1") {
      let tipo: string | null = prompt("Qual o tipo de tarefa você deseja adicionar?\n1 - Com prazo\n2 - Rotina");

      if (tipo === "1") {
        let desc: string | null = prompt("Descrição da atividade:");
        let nivel: string | null = prompt("Dificuldade (leve, médio, difícil):");
        let data: string | null = prompt("Data de entrega (ex: 14/08/2025)");
        if (desc && nivel && data) {
          bd.adicionar(new TarefaPrazo(desc, nivel, data));
          alert("✅ Tarefa de prazo adicionada!");
        }
      } else if (tipo === "2") {
        let desc: string | null = prompt("Descrição da rotina:");
        let nivel: string | null = prompt("Dificuldade (leve, médio, difícil):");
        let dias: string | null = prompt("Dias da semana (ex: seg, qua, sex):");
        let inicio: string | null = prompt("Horário de início (ex: 08:00):");
        let fim: string | null = prompt("Horário de fim (ex: 10:00):");
        if (desc && nivel && dias && inicio && fim) {
          bd.adicionar(new TarefaRotina(desc, nivel, dias, inicio, fim));
          alert("✅ Tarefa de rotina adicionada!");
        }
      } else {
        alert("⚠️ Tipo inválido.");
      }
    }

    // Mostrar pendências mais urgentes
    else if (opcao === "2") {
      alert(bd.foco());
    }

    // Listar todas as tarefas cadastradas
    else if (opcao === "3") {
      alert("📋 Tarefas:\n" + bd.listar());
    }

    // Marcar tarefa como concluída
    else if (opcao === "4") {
      if (bd.tarefas.length === 0) {
        alert("⚠️ Nenhuma tarefa para concluir.");
      } else {
        alert("📋 Tarefas:\n" + bd.listar());
        let pos: number = Number(prompt("Digite o número da tarefa a concluir:")) - 1;
        bd.concluir(pos);
        alert("✅ Tarefa marcada como concluída!");
      }
    }

    // Remover tarefa do sistema
    else if (opcao === "5") {
      if (bd.tarefas.length === 0) {
        alert("⚠️ Nenhuma tarefa para remover.");
      } else {
        alert("📋 Tarefas:\n" + bd.listar());
        let pos: number = Number(prompt("Digite o número da tarefa a remover:")) - 1;
        bd.remover(pos);
        alert("🗑️ Tarefa removida!");
      }
    }

    // Encerrar o programa
    else if (opcao === "6") {
      sair = true;
      alert("👋 Até a próxima!");
    }

    // Caso o usuário digite uma opção inválida
    else {
      alert("⚠️ Opção inválida.");
    }
  }
}

// Executa o programa
executarAgenda();
