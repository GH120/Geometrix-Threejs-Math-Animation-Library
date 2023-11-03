export default class Animacao {

    constructor(objeto){
        this.objeto = objeto;
        this.frames = 0;
        this.currentFrame = 0;
        this.delay = 0;
        this.manter = false;
        this.voltar = true;
        this.velocidade = 1312;
    }

    run(printar = false){
        
        if(!this.executable) this.executable = this.getFrames();

         // if (this.pause) return this.update(valor); //se estiver pausado, continua executando// A FAZER


         // if(this.skip) return this.endExecution(); //se quiser pular a execução, termina a animação// A FAZER


        if(this.stop) return; //se parar a execução, volta ao inicio

        this.executable.next();

        if(printar) console.log(this.info());

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

        const speed = this.velocidade;

        this.onStart();

        //Executa os frames da animação, interpolando os valores iniciais e finais
        for(let frame = 0; frame < this.frames; frame += speed){

            const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, this.curva(peso));

            const valor = lerp(Math.min(frame/this.frames, 1));

            this.update(valor);

            this.currentFrame = frame;

            yield frame;
        }

        this.onDelay();

        //Parte do delay
        for(let frame = this.currentFrame; frame < this.frames + this.delay; frame += speed){

            this.currentFrame = frame;

            this.update(this.valorFinal);

            yield frame;
        }

        //Enquanto estiver com a flag para manter a execução, continue retornando o ultimo frame
        while(this.manter) {
            
            if(this.stop) return this.update(this.valorInicial);

            yield this.update(this.valorFinal);
        }

        this.terminado = true;

        //Se tiver uma função ao terminar, executa ela
        this.onTermino();

        //Se tiver a flag para a volta, retorna ao estado inicial
        if(this.voltar) this.update(this.valorInicial);
    }

    setProgresso(progresso){

        const lerp = (peso) => this.interpolacao(this.valorInicial, this.valorFinal, peso);

        const valor = lerp(progresso);

        this.update(valor);

        return this;
    }

    calcularFrames(){
        
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

    reverse(){

        const inicial = this.valorInicial;
        
        this.valorInicial = this.valorFinal;
        this.valorFinal   = inicial;
        
        return this;
    }

    info(){
        
        const nome = (this.objeto) ? this.objeto.constructor.name : "Padrão";

        return {
            nome: "Animação " + nome,
            frameAtual: this.currentFrame,
            frameTotal: this.frames,
            progresso: this.currentFrame/this.frames,
            terminado: !!this.terminado
        };
    }
}

export class AnimacaoSimultanea extends Animacao{

    //** Aceita um spread de animações do tipo (anim1,anim2,anim3), MAS NÃO UMA LISTA [anim1,anim2,anim3] */
    constructor(...animacoes){
        super();

        this.animacoes = animacoes;

        this.calcularFrames();
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
        const speed     = this.velocidade;

        this.calcularFrames();

        //Avança os frames simultâneamente das animações
        for(let frame = 0; frame < this.frames; frame += speed){

            this.currentFrame = frame;

            yield animacoes.map(animacao => animacao.run());
        }

        //Mantém a execução do frame final de todas as animações
        while(this.manter){
            yield animacoes.map(animacao => animacao.run());
        }

        //Termina a execução
        animacoes.map(animacao => animacao.manter = false);

        this.terminado = true;

        this.onTermino();
    }

    //** Quando for colocar uma lista de animações [anim1,anim2,anim3,anim4...] ao invés de um spread */
    setAnimacoes(animacoes){
        this.animacoes = animacoes;

        this.calcularFrames();

        return this;
    }

    calcularFrames(){

        const animacoes = this.animacoes;

        animacoes.map(animacao => animacao.calcularFrames());

        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay)
                               .reduce((maior, atual) => (maior > atual)? maior : atual, 0)+animacoes.length;
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

    info(){
        
        return {
            nome: "Animação Simultanea",
            frameAtual: this.currentFrame,
            frameTotal: this.frames,
            progresso: this.currentFrame/this.frames,
            animacoes: this.animacoes.map(animacao => animacao.info())
        };
    }
}

export class AnimacaoSequencial extends Animacao{

    //** Aceita um spread de animações do tipo (anim1,anim2,anim3), MAS NÃO UMA LISTA [anim1,anim2,anim3] */
    constructor(...animacoes){
        super();

        // console.log(animacoes.map(animacao => Object.keys(animacao)));

        this.setAnimacoes(animacoes)

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

        const animacoes = [...this.animacoes];
        const speed     = this.velocidade;

        this.calcularFrames();
        
        const animacoesTerminadas = [];
        var   completedFrames     = 0;
        var   animacao            = animacoes.shift(); // Pega primeira animação

        for(let i = 0; i < this.frames; i += speed){

                this.currentAnimation = animacao;

                //Retorna um por um os frames da animação atual

                animacao.run()

                this.currentFrame = i;

                while(i > completedFrames + animacao.frames + animacao.delay && animacoes.length) {

                    animacao = animacoes.shift(); //Pega a proxima animação

                    completedFrames += animacao.frames + animacao.delay;

                    //Quando terminada, adicionar as completadas
                    animacoesTerminadas.push(animacao);

                    //Mantém a execução opcionalmente das animações completas
                    animacoesTerminadas.map(animacao => animacao.run());
                }

                yield i
        }

        //Mantém a execução do frame final de todas as animações
        while(this.manter){
            yield animacoesTerminadas.map(animacao => animacao.run());
        }

        //Termina a execução
        animacoes.map(animacao => animacao.manter = false);

        animacoesTerminadas.map(animacao => animacao.run());

        this.terminado = true;

        this.onTermino();
    }

    //** Quando for colocar uma lista de animações [anim1,anim2,anim3,anim4...] ao invés de um spread */
    setAnimacoes(animacoes){
        this.animacoes = animacoes;

        this.currentAnimation = animacoes[0]

        this.calcularFrames();

        return this;
    }

    setDuration = function(frames){
        this.animacoes.map(animacao => animacao.setDuration(frames));
        return this;
    }

    setProgresso(progresso){
        this.animacoes.map(animacao => animacao.setProgresso(progresso));

        return this;
    }

    calcularFrames(){

        const animacoes = this.animacoes;

        this.animacoes.map(animacao => animacao.calcularFrames());

        this.frames = animacoes.map(animacao => animacao.frames + animacao.delay)
                               .reduce((acumulado, atual) => acumulado + atual, 0) + animacoes.length;
    }

    setDelay(delay){

        this.delay = delay;

        this.animacoes[this.animacoes.length-1].setDelay(delay);

        return this;
    }

    info(){
        
        return {
            nome: "Animação Sequencial",
            frameAtual: this.currentFrame,
            frameTotal: this.frames,
            progresso: this.currentFrame/this.frames,
            animacaoAtual: this.currentAnimation.info(), 
            animacoes: this.animacoes.map(animacao => animacao.info())
        };
    }
}