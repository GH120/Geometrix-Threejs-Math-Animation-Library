import { colorirAngulo } from "../animacoes/colorirAngulo";
import { Output } from "./Output";

export default class ColorirOnHover extends Output{

    constructor(objeto, corInicial, corFinal){
        super()
        this.objeto     = objeto;
        this.corInicial = corInicial;
        this.corFinal   = corFinal;
        this.animation = null;
    }

    _update(estado){

        if(estado.dragging != undefined) this.selecionado = estado.dragging;

        if(this.selecionado) return;

        if(this.animation) this.animation.stop = true;

        if(estado.dentro){

            const animacao = colorirAngulo(this.objeto)
                             .setValorInicial(this.corInicial)
                             .setValorFinal(this.corFinal)
                             .setDuration(60)
                             .voltarAoInicio(false)
                             .setCurva(x => 1 - Math.pow(1 - x, 3))

            this.animation = animacao;

            this.animar(animacao);
        }
        else if(estado.dentro == false){

            const animacao = colorirAngulo(this.objeto)
                             .setValorInicial(this.corInicial)
                             .setValorFinal(this.corFinal)
                             .setDuration(60)
                             .voltarAoInicio(false)
                             .setCurva(x => 1 - Math.pow(1 - x, 3))
                             .reverse()

            this.animation = animacao;

            this.animar(animacao);
        }

    }
}