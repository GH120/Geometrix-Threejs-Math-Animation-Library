import { colorirAngulo } from "../animacoes/colorirAngulo";
import { Handler } from "./handler";

export default class ColorirOnHover extends Handler{

    constructor(objeto, corInicial, corFinal){
        super()
        this.objeto     = objeto;
        this.corInicial = corInicial;
        this.corFinal   = corFinal;
        this.animation = null;
    }

    _update(estado){

        if(estado.position) this.selecionado = estado.dragging;

        if(this.selecionado) return;

        if(this.animation) this.animation.stop = true;

        if(estado.dentro){

            const animacao = colorirAngulo(this.objeto)
                             .setValorInicial(this.corInicial)
                             .setValorFinal(this.corFinal)
                             .setDuration(60)
                             .voltarAoInicio(false)
                             .manterExecucao(true)
                             .setCurva(x => 1 - Math.pow(1 - x, 3))

            this.animation = animacao;

            this.animar(animacao);
        }

    }
}