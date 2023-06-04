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