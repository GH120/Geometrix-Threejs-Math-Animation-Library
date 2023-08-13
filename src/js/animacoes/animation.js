export default class Animacao {

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

    setOnStart(onStart){
        this.onStart = onStart;
        return this;
    }

    setOnTermino(onTermino){
        this.onTermino = onTermino;
        return this;
    }

    onStart(){
        return null;
    }

    onTermino(){
        return null;
    }

    *getFrames(){

        this.onStart();

        //Executa os frames da animação, interpolando os valores iniciais e finais
        for(let frame = 1; frame <= this.frames; frame++){

            const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, peso);

            const valor = lerp(frame/this.frames);

            this.update(valor);

            yield frame;
        }

        //Parte do delay
        for(let frame = this.frames; frame < this.frames + this.delay; frame++){
            yield this.update(this.valorFinal);
        }

        //Se tiver uma função ao terminar, executa ela
        yield this.onTermino();

        //Enquanto estiver com a flag para manter a execução, continue retornando o ultimo frame
        while(this.manter) {
            yield this.update(this.valorFinal);
        }

        //Se tiver a flag para a volta, retorna ao estado inicial
        if(this.voltar) this.update(this.valorInicial);
    }

    static simultanea(...animacoes){
        return new AnimacaoSimultanea(animacoes);
    }

    static sequencial(...animacoes){
        return new AnimacaoSequencial(animacoes);
    }
}

export class AnimacaoSimultanea extends Animacao{

    constructor(...animacoes){
        super();

        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames).reduce((maior, atual) => (maior > atual)? maior : atual);

        //Todas as animações vão manter sua execução até o termino dessa
        //Revisar isso depois
        this.manterExecucaoTodos(true);
    }

    //Opcional, ao invés do padrão, onde alguns podem manter e outros não, força todas as animações a um mesmo padrão
    manterExecucaoTodos(trueOrFalse){
        this.animacoes.map(animacao => animacao.manterExecucao(trueOrFalse));
        // this.animacoes.map(animacao => animacao.voltarAoInicio(false));
        return this;
    }

    *getFrames(){

        this.onStart();

        const animacoes = this.animacoes;

        this.frames =   animacoes.map(animacao => animacao.frames)
                                 .reduce((maior,atual) => (maior > atual)? maior : atual, 0);

        this.delay  =   animacoes.map(animacao => animacao.delay)
                                 .reduce((maior,atual) => (maior > atual)? maior : atual, 0);

        const actions = animacoes.map(animacao => animacao.getFrames());

        //Avança os frames simultâneamente das animações
        for(let frame = 0; frame <= this.frames + this.delay; frame++){
            yield actions.map(action => action.next());
        }

        //Mantém a execução do frame final de todas as animações
        while(this.manter){
            yield actions.map(actions => actions.next());
        }

        //Termina a execução
        animacoes.map(animacao => animacao.manter = false);

        actions.map(action => action.next());

        this.onTermino();
    }

    setDuration(frames){
        this.frames = frames
        this.animacoes.map(animacao => animacao.setDuration(frames));
        return this;
    }

    setDelay(frames){
        this.animacoes.map(animacao => animacao.delay = frames);
        return this;
    }
}

export class AnimacaoSequencial extends Animacao{

    constructor(...animacoes){
        super();

        // console.log(animacoes.map(animacao => Object.keys(animacao)));

        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames)
                               .reduce((acumulado, atual) => acumulado + atual, 0);

        // this.manterExecucaoTodos(false);
    }

    //Opcional, ao invés do padrão, onde alguns podem manter e outros não, força todas as animações a um mesmo padrão
    manterExecucaoTodos(trueOrFalse){
        this.animacoes.map(animacao => console.log(animacao.manterExecucao));

        this.animacoes.map(animacao => animacao.manterExecucao(trueOrFalse));
        // this.animacoes.map(animacao => animacao.voltarAoInicio(false));
        return this;
    }

    *getFrames(){

        this.onStart();

        const animacoes = this.animacoes;
        
        const completedActions = [];

        for(const animacao of animacoes){

            const action = animacao.getFrames();

            //Retorna um por um os frames da animação atual
            for(let i = 0; i < animacao.frames + animacao.delay; i++){
                yield action.next();
            }

            //Quando terminada, adicionar as completadas
            completedActions.push(action);

            //Mantém a execução opcionalmente das animações completas
            completedActions.map(completed => completed.next());
        }
        
        //Delay final ao terminar execução
        for(let frame = this.frames; frame < this.frames + this.delay; frame++){
            yield completedActions.map(action => action.next());
        }

        //Mantém a execução do frame final de todas as animações
        while(this.manter){
            yield completedActions.map(actions => actions.next());
        }

        //Termina a execução
        animacoes.map(animacao => animacao.manter = false);

        completedActions.map(action => action.next());

        this.onTermino();
    }

    setDuration = function(frames){
        this.animacoes.map(animacao => animacao.setDuration(frames));
        return this;
    }
}