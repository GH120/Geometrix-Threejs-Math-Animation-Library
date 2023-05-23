export class Animacao {

    constructor(objeto){
        this.objeto = objeto;
        this.frames = 0;
        this.delay = 0;
    }

    setValorInicial(valorInicial){
        this.valorInicial = valorInicial;
        return this;
    }
    
    setValorFinal(valorFinal){
        this.valorFinal = valorFinal;
        return this;
    }

    setDuration(frames){
        this.frames = frames;
        return this;
    }

    setDelay(delay){
        this.delay = delay;
        return this;
    }

    setInterpolacao(interpolacao){
        this.interpolacao = interpolacao;
        return this;
    }

    setUpdateFunction(update){
        this.update = update;
        return this;
    }

    setOnTermino(onTermino){
        this.onTermino = onTermino;
        return this;
    }

    manterExecucao(){
        this.update(this.valorFinal);
        return this;
    }

    terminarExecucao(){
        this.update(this.valorInicial);
        return this;
    }

    *getFrames(){

        for(let frame = 1; frame <= this.frames; frame++){

            const atributo = this.nome;

            const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, peso);

            const valor = lerp(frame/this.frames);

            // this.update.bind(this.objeto);

            this.update(valor);

            yield valor;
        }

    }
}