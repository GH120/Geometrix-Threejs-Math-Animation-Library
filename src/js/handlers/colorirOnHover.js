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

    update(estado){


        if(estado.dentro){

            const animacao = colorirAngulo(this.objeto)
                             .setValorInicial(this.corInicial)
                             .setValorFinal(this.corFinal)
                             .setDuration(30)
                             .voltarAoInicio(false)
                             .manterExecucao(true)
                             .setCurva(x => x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2)

            this.animation = animacao;

            this.animar(animacao);
        }

    }
}