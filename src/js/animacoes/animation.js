export default class Animacao {

    constructor(objeto){
        this.objeto = objeto;
        this.frames = 0;
        this.delay = 0;
        this.manter = false;
        this.voltar = true;
        this.checkpoint = true;
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

    setOnDelay(onDelay){
        this.onDelay = onDelay;
        return this;
    }

    setOnTermino(onTermino){
        this.onTermino = onTermino;
        return this;
    }

    setCurva(curva){
        this.curva = curva;
        return this;
    }

    setNome(nome){
        this.nome = nome;
        return this;
    }

    onStart(){
        return null;
    }

    onDelay(){
        return null;
    }

    onTermino(){
        return null;
    }

    curva(peso){
        return peso;
    }

    *getFrames(){

        this.onStart();

        //Executa os frames da animação, interpolando os valores iniciais e finais
        for(let frame = 1; frame <= this.frames; frame++){

            const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, this.curva(peso));

            const valor = lerp(frame/this.frames);

            this.update(valor);

            while (this.pause) yield this.frame; //se estiver pausado, continua executando// A FAZER

            if(this.stop) return this.update(this.valorInicial); //se parar a execução, volta ao inicio

            this.frame = frame;

            // if(this.skip) return this.endExecution(); //se quiser pular a execução, termina a animação// A FAZER

            yield frame;
        }

        this.onDelay();

        //Parte do delay
        for(let frame = this.frames; frame < this.frames + this.delay; frame++){

            this.frame = frame;

            while (this.pause) yield this.frame;

            yield this.update(this.valorFinal);
        }

        //Enquanto estiver com a flag para manter a execução, continue retornando o ultimo frame
        while(this.manter) {
            
            if(this.stop) return this.update(this.valorInicial);

            yield this.update(this.valorFinal);
        }

        //Se tiver uma função ao terminar, executa ela
        yield this.onTermino();

        //Se tiver a flag para a volta, retorna ao estado inicial
        if(this.voltar) this.update(this.valorInicial);
    }

    setProgresso(progresso){

        const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, peso);

        const valor = lerp(progresso);

        this.update(valor);

        return this;
    }

    static simultanea(...animacoes){
        return new AnimacaoSimultanea(animacoes);
    }

    static sequencial(...animacoes){
        return new AnimacaoSequencial(animacoes);
    }

    //Gambiarra para ter delay antes da animação, 
    //Basicamente cria uma animação sequencial onde a primeira animação não faz nada e tem duração do delay
    //Enquanto a segunda animação é essa
    filler(delay){
        return new AnimacaoSequencial(
                                      new Animacao(null)
                                      .setInterpolacao( ()=> null)
                                      .setUpdateFunction(() => null)
                                      .setDuration(delay), 

                                      this
                                     );
    }

    recalculateFrames(){

        this.frames = this._calculateFrames();

        return this;
    }


    _calculateFrames(){

        return this.frames;
    }

    reverse(resetEndFunction, resetStartFunction){

        const valorFinal   = this.valorFinal;
        const valorInicial = this.valorInicial;

        this.valorFinal = valorInicial;
        this.valorInicial = valorFinal;

        if(resetEndFunction) this.onTermino = () => null;
        if(resetStartFunction) this.onStart = () => null;

        return this;
    }
}

export class AnimacaoSimultanea extends Animacao{

    //** Aceita um spread de animações do tipo (anim1,anim2,anim3), MAS NÃO UMA LISTA [anim1,anim2,anim3] */
    constructor(...animacoes){
        super();

        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames).reduce((maior, atual) => (maior > atual)? maior : atual,0);

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

        this.frames =   animacoes.map(animacao => animacao.frames + animacao.delay)
                                 .reduce((maior,atual) => (maior > atual)? maior : atual, 0);

        console.log(this.frames,this.delay)

        const actions = animacoes.map(animacao => animacao.getFrames());

        //Avança os frames simultâneamente das animações
        for(let frame = 0; frame <= this.frames; frame++){

            this.frame = frame;

            while (this.pause) yield this.frame;

            yield actions.map(action => action.next());
        }

        //Mantém a execução do frame final de todas as animações
        while(this.manter){
            yield actions.map(actions => actions.next());
        }

        //Termina a execução
        animacoes.map(animacao => animacao.manter = false);

        actions.map(action => action.next())

        this.onTermino();
    }

    //** Quando for colocar uma lista de animações [anim1,anim2,anim3,anim4...] ao invés de um spread */
    setAnimacoes(animacoes){
        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay)
                               .reduce((acumulado, atual) => acumulado + atual, 0)
        return this;
    }

    setDuration(frames){
        this.frames = frames
        this.animacoes.map(animacao => animacao.setDuration(frames));
        return this;
    }

    setDelay(frames){
        this.delay = frames;
        this.animacoes.map(animacao => animacao.delay = frames);
        return this;
    }

    setProgresso(progresso){
        this.animacoes.map(animacao => animacao.setProgresso(progresso));

        return this;
    }

    recalculateFrames(){

        this.animacoes.map(animacao => animacao.recalculateFrames())

        this.frames = this._calculateFrames();

        return this;
    }
    
    _calculateFrames(){
        return  this.animacoes
                    .map(animacao => animacao._calculateFrames() + animacao.delay)
                    .reduce((a,b) => (a>b)? a : b);
    }
}

export class AnimacaoSequencial extends Animacao{

    //** Aceita um spread de animações do tipo (anim1,anim2,anim3), MAS NÃO UMA LISTA [anim1,anim2,anim3] */
    constructor(...animacoes){
        super();

        // console.log(animacoes.map(animacao => Object.keys(animacao)));

        this.animacoes = animacoes;

        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay)
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

        this.frame = 0;
        
        const completedActions = [];

        for(const animacao of animacoes){

            const action           = animacao.getFrames();

            this.subAnimacaoAtual = animacao;

            //Retorna um por um os frames da animação atual
            for(let i = 0; i <= animacao.frames + animacao.delay; i++){

                this.frame++;

                while (this.pause) yield this.frame;

                yield action.next();
            }

            action.next();



            // // //Quando terminada, adicionar as completadas
            // completedActions.push(action);

            // //Mantém a execução opcionalmente das animações completas
            // completedActions.map(completed => completed.next());
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

    //** Quando for colocar uma lista de animações [anim1,anim2,anim3,anim4...] ao invés de um spread */
    setAnimacoes(animacoes){
        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay)
                               .reduce((acumulado, atual) => acumulado + atual, 0)
        return this;
    }

    setDurationAll(frames){
        this.animacoes.map(animacao => animacao.setDuration(frames));
        return this;
    }

    setProgresso(progresso){
        this.animacoes.map(animacao => animacao.setProgresso(progresso));

        return this;
    }

    setDelay(delay){

        this.delay = delay;

        this.animacoes[this.animacoes.length-1].setDelay(delay);

        return this;
    }

    recalculateFrames(){

        this.animacoes.map(animacao => animacao.recalculateFrames())

        this.frames = this._calculateFrames();

        return this;
    }

    _calculateFrames(){
        return this.animacoes.map(animacao => animacao._calculateFrames() + animacao.delay).reduce((a,b) => a+b,0);
    }
}