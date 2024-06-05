import { curvas } from "../animacoes/animation";
import { Output } from "./Output";

/**Controle output que seta timer para iniciar animação idle, qualquer input termina a execução da animação */
export default class ExecutarAnimacaoIdle extends Output{

    constructor(animacao, fase, delay = 5, curva = curvas.easeInOutSine, usarSuavisacao=true){
        super();

        this.fase = fase;

        this.curva = curva;

        this.animacaoIdle = animacao.idleAnimation(fase, curva, usarSuavisacao);

        this.delay = delay;

        this.usarSuavisacao = usarSuavisacao

        this.desativarMudancaCursor(true);


        this.delayToReestart = delay;
        
        this.framesOriginais = this.animacaoIdle.frames;
    }

    _update(novoEstado){

        if(novoEstado.ativarAnimacaoIdle){
            this.start();
        }
        else if(novoEstado){
            this.animacaoIdle.idle = false;
            this.animacaoIdle.setOnDelay(() => this.animacaoIdle.setDuration(this.framesOriginais));

            this.animacaoIdle.setDuration(10)
            // this.animacaoIdle.finalizarExecucao(); 

            // if(this.estado.restart) clearTimeout(this.estado.restart);

            // this.estado.restart = setTimeout(() => (this.estado.restart) ? this.start(): null, this.delay);
            //Se um dia refatorar animação, talvez isso quebre a animação idle pois os frames vão para o final
        }
    }

    start(){

        const animacaoIdle = this.animacaoIdle;

        const fase = this.fase;

        // animacaoIdle.onDelay(); //Usa o onDelay em transições de desativação para reativação

        animacaoIdle.idleAnimation(fase, this.curva, this.usarSuavisacao)

        setTimeout(() => (animacaoIdle.idle)? fase.animar(animacaoIdle) : null, this.delay * 1000);

        return this;
    }

    transitionToCompletedAnimation(curva = curvas.easeInOutBack){
        this.animacaoIdle.idle = false;
        this.animacaoIdle.setCurva(curva);
    }
}