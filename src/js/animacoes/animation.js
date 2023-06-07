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

    onTermino(){
        return null;
    }

    *getFrames(){

        for(let frame = 1; frame <= this.frames; frame++){

            const atributo = this.nome;

            const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, peso);

            const valor = lerp(frame/this.frames);

            // this.update.bind(this.objeto);

            this.update(valor);

            yield frame;
        }

    }

    static simultanea(...animacoes){

        const animacaoJunta = new Animacao();
        
        animacaoJunta.getFrames = function* (){

            const actions = animacoes.map(animacao => animacao.getFrames());

            const duracao = animacoes.map(animacao => animacao.frames)
                                    .reduce((maior,atual) => (maior > atual)? maior : atual, 0);

            for(let frame = 1; frame <= duracao; frame++){
                yield actions.map(action => action.next());
            }
        }

        animacaoJunta.setDuration = function(frames){
            animacoes.map(animacao => animacao.setDuration(frames));
            return this;
        }

        animacaoJunta.manterExecucao = function(){
            animacoes.map(animacao => animacao.manterExecucao())
            return this;
        }

        animacaoJunta.onTermino = function(){
            animacoes.map(animacao => animacao.onTermino())
            return this;
        }

        animacaoJunta.terminarExecucao = function(){
            animacoes.map(animacao => animacao.terminarExecucao());
            return this;
        }

        return animacaoJunta;
    }

    static sequencial(...animacoes){
        
        const animacaoSequencial = new Animacao();

        animacaoSequencial.children = animacoes;
        
        animacaoSequencial.getFrames = function* (){

            const actions = animacoes.map(animacao => animacao.getFrames());

            for(const action of actions) yield* action;
        }

        animacaoSequencial.manterExecucao = function(){
            animacoes.map(animacao => animacao.manterExecucao())
        }

        animacaoSequencial.onTermino = function(){
            animacoes.map(animacao => animacao.onTermino())
        }

        animacaoSequencial.setDuration = function(frames){
            animacoes.map(animacao => animacao.setDuration(frames));
            return this;
        }

        animacaoSequencial.terminarExecucao = function(){
            animacoes.map(animacao => animacao.terminarExecucao());
            return this;
        }

        return animacaoSequencial;
    }
}

class Refatorada {

    constructor(objeto){
        this.objeto = objeto;
        this.frames = 0;
        this.delay = 0;
        this.manter = false;
        this.voltar = true;
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

    manterExecucao(trueOrFalse){
        this.manter = trueOrFalse;
        return this;
    }

    voltarAoInicio(trueOrFalse){
        this.voltar = trueOrFalse;
        return this;
    }

    setOnTermino(onTermino){
        this.onTermino = onTermino;
        return this;
    }

    onTermino(){
        return null;
    }

    *getFrames(){

        //Executa os frames da animação, interpolando os valores iniciais e finais
        for(let frame = 1; frame <= this.frames; frame++){

            const atributo = this.nome;

            const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, peso);

            const valor = lerp(frame/this.frames);

            // this.update.bind(this.objeto);

            this.update(valor);

            yield frame;
        }

        //Enquanto estiver com a flag para manter a execução, continue retornando o ultimo frame
        while(this.manter) {
            yield this.update(this.valorFinal);
        }

        //Se tiver a flag para a volta, retorna ao estado inicial
        if(this.voltar) this.update(this.valorInicial);

        //Se tiver uma função ao terminar, executa ela
        this.onTermino();
    }
}

class AnimacaoSimultanea extends Refatorada{

    constructor(...animacoes){
        super();

        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames).reduce((maior, atual) => (maior > atual)? maior : atual);

        //Enquanto ela não terminar, as animações não voltarão ao inicio
        this.animacoes.map(animacao => animacao.voltarAoInicio(false));
    }

    //Opcional, ao invés do padrão, onde alguns podem manter e outros não, força todas as animações a um mesmo padrão
    manterExecucaoTodos(trueOrFalse){
        this.manter = trueOrFalse;
        this.animacoes.map(animacao => animacao.manterExecucao(trueOrFalse));
        this.animacoes.map(animacao => animacao.voltarAoInicio(false));
        return this;
    }

    getFrames = function* (){

        const animacoes = this.animacoes;

        const actions = animacoes.map(animacao => animacao.getFrames());

        const duracao = animacoes.map(animacao => animacao.frames)
                                .reduce((maior,atual) => (maior > atual)? maior : atual, 0);

        for(let frame = 1; frame <= duracao; frame++){
            yield actions.map(action => action.next());
        }

        while(this.manter){
            yield actions.map(actions => actions.next());
        }

        if(this.voltar) this.animacoes.map(animacao => animacao.update(animacao.valorInicial));

        this.onTermino();
    }

    setDuration = function(frames){
        animacoes.map(animacao => animacao.setDuration(frames));
        return this;
    }

    terminarExecucao = function(){
        animacoes.map(animacao => animacao.terminarExecucao());
        return this;
    }
}