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

    /** Usado no update da fase para determinar se substitui animação com mesmo nome
     * Funciona como um identificador para apenas uma thread com esse nome executar no update
    */
    setNome(nome){
        this.nome = nome;
        return this;
    }

    setCheckpoint(trueOrFalse){
        this.checkpoint = trueOrFalse;
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

            if(this.stop) return;

            while (this.pause) yield this.frame; //se estiver pausado, continua executando// A FAZER

            this.frame = frame;

            // if(this.skip) return this.endExecution(); //se quiser pular a execução, termina a animação// A FAZER

            yield frame;
        }

        this.onDelay();

        //Parte do delay
        for(let frame = this.frames; frame <= this.frames + this.delay; frame++){

            this.frame = frame;

            if(this.stop) return;

            while (this.pause) yield this.frame;

            yield this.setProgresso(1);
        }

        //Enquanto estiver com a flag para manter a execução, continue retornando o ultimo frame
        while(this.manter) {
            
            if(this.stop) return;

            yield this.setProgresso(1);
        }

        //Se tiver uma função ao terminar, executa ela
        yield this.onTermino();

        //Se tiver a flag para a volta, retorna ao estado inicial
        if(this.voltar) this.update(this.valorInicial);
    }

    setProgresso(progresso){

        const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, this.curva(peso));

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
                                     )
                                     .setCheckpointAll(false)
    }

    recalculateFrames(){

        this.frames = this._calculateFrames();

        return this;
    }


    _calculateFrames(){

        return this.frames;
    }

    reverse(reverterFrames){

        const valorFinal   = this.valorFinal;
        const valorInicial = this.valorInicial;

        this.valorFinal = valorInicial;
        this.valorInicial = valorFinal;

        //Se precisar reverter animação equanto ela executa
        if(reverterFrames) this.frame = this.frames - this.frame + 1;

        return this;
    }

    execucaoTerminada(){
        return this.frame > this.frames + this.delay;
    }

    finalizarExecucao(){

        this.stop = true;

        if(this.frame < this.frames) {
            this.setProgresso(1);
            this.onDelay();
            this.onTermino();
            this.manter = false;
        }

        this.frame = this.frames + this.delay
        
        return this;
    }
}

//BUG A CONSERTAR: MANTER EXECUÇÃO TODOS
export class AnimacaoSimultanea extends Animacao{

    //** Aceita um spread de animações do tipo (anim1,anim2,anim3), MAS NÃO UMA LISTA [anim1,anim2,anim3] */
    constructor(...animacoes){
        super();

        this.animacoes = animacoes;
        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay).reduce((maior, atual) => (maior > atual)? maior : atual,0);

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

        // console.log(this.frames,this.delay)

        const actions = animacoes.map(animacao => animacao.getFrames());

        //Avança os frames simultâneamente das animações
        for(let frame = 0; frame <= this.frames; frame++){

            this.frame = frame;

            if(this.stop) return;

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

    finalizarExecucao(){

        this.stop = true;
        
        this.animacoes.map(animacao => animacao.finalizarExecucao());

        if(this.frame < this.frames) {
            this.onDelay();
            this.onTermino();
            this.manter = false;
        }

        this.frame = this.frames + this.delay

        return this;
    }
}

export class AnimacaoSequencial extends Animacao{

    //** Aceita um spread de animações do tipo (anim1,anim2,anim3), MAS NÃO UMA LISTA [anim1,anim2,anim3] */
    constructor(...animacoes){
        super();

        // console.log(animacoes.map(animacao => Object.keys(animacao)));

        this.animacoes = animacoes;

        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay)
                               .reduce((acumulado, atual) => acumulado + atual, 0) + 1;

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
            for(let i = 0; i < animacao.frames + animacao.delay; i++){

                this.frame++;

                while (this.pause) yield this.frame;

                if(this.stop) return;

                yield action.next();

            }

            //Com dois desses por algum motivo funciona
            action.next();
            action.next();
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

    setCheckpointAll(trueOrFalse){

        this.checkpoint = trueOrFalse;

        this.animacoes.map(animacao => animacao.checkpoint = trueOrFalse);

        return this;
    }

    _calculateFrames(){
        return this.animacoes.map(animacao => animacao._calculateFrames() + animacao.delay).reduce((a,b) => a+b,0);
    }

    //Frames tem que ser o maximo
    //Pense assim: se houver uma animação sequencial que tem uma animação sequencial
    //Ela vai continuar a chamar essa execução mesmo ela tendo acabado
    finalizarExecucao(){
        this.stop = true;

        this.animacoes.map(animacao => animacao.finalizarExecucao()); 

        if(this.frame < this.frames) {
            this.onDelay();
            this.onTermino();
            this.manter = false;
        }

        this.frame = this.frames + this.delay

        return this;
    }
}

/** Caso seja necessário inicializar a animação só quando começar sua execução
 *  Efetivamente é como se rodasse tudo no start de uma função
 */
export const animacaoIndependente = (funcao,duracao=300, delay=0) =>  new Animacao()
                                                                .setInterpolacao(() => null)
                                                                .setUpdateFunction(() => null)
                                                                .setDuration(duracao)
                                                                .setOnStart(funcao)
                                                                .setCheckpoint(false)
                                                                .setDelay(100)