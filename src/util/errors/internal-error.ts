export class InternalError extends Error { // Erro interno do nosso servidor, o usuário não irá vê-lo
    constructor(public message: string, protected code: number = 500, protected description?: string){
        super(message); 
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor); // Joga a classe no "lixo" e mostra a partir de onde o erro foi chamado
    }
}