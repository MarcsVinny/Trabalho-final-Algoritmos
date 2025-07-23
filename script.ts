//criar o personagem do sobrevivente
 class sobrevivente{
    nome : string;
    vidas : number;
    errosCometidos : number;
    status: string;

    constructor(nome: string, vidas: number, errosCometidos: number, status: string){
        this.nome = nome;
        this.vidas = vidas;
        this.errosCometidos = errosCometidos;
        this.status = status;
    }
 }

 perderVida(){
    thisvidas--;
    this.errosCometidos++;
    alert("Você perdeu uma vida!  " + ")
 }