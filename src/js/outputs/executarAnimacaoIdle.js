import { curvas } from "../animacoes/animation";
import { Output } from "./Output";

/**Controle output que seta timer para iniciar animação idle, qualquer input termina a execução da animação */
export default class ExecutarAnimacaoIdle extends Output{

    constructor(animacao, fase, delay = 5, curva = curvas.easeInOutSine, usarSuavisacao=true){
        super();

        this.fase = fase;

        this.animacaoIdle = animacao.idleAnimation(fase, curva, usarSuavisacao);

        this.delay = delay;

        this.desativarMudancaCursor(true);

        
    }

    _update(novoEstado){

        if(novoEstado.ativarAnimacaoIdle){
            this.start();
        }
        else if(novoEstado){
            this.animacaoIdle.idle = false;
            this.animacaoIdle.setDuration(60);
        }
    }

    start(){

        const animacaoIdle = this.animacaoIdle;

        const fase = this.fase;


        setTimeout(() => (animacaoIdle.idle)? fase.animar(animacaoIdle) : null, this.delay * 1000);
    }
}