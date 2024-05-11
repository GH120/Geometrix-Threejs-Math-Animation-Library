import { AnimacaoSimultanea } from "./animation";
import { apagarObjeto } from "./apagarObjeto";

//Transformar isso numa classe, adicionar helper methods overriding a superclasse Animacao
export const apagarPoligono = (poligono) => new AnimacaoSimultanea(
                                                new AnimacaoSimultanea().setAnimacoes(poligono.angles.map(angle => apagarObjeto(angle))),
                                                new AnimacaoSimultanea().setAnimacoes(poligono.edges.map(edge => apagarObjeto(edge))),
                                                new AnimacaoSimultanea().setAnimacoes(poligono.vertices.map(vertex => apagarObjeto(vertex)))
                                            )

export class ApagarPoligono extends AnimacaoSimultanea{

    constructor(poligono){

        super();

        this.poligono = poligono;

        this.valorFinal   = 0;
        this.valorInicial = 1;

        this.setAnimacoes([
            ...poligono.angles.map(angle => apagarObjeto(angle)),
            ...poligono.edges.map(edge => apagarObjeto(edge)),
            ...poligono.vertices.map(vertex => apagarObjeto(vertex))  
        ])

        this.frames = 200;

    }

    setValorInicial(valor){
        this.animacoes.map(animacao => animacao.setValorInicial(valor));

        return this;
    }

    setValorFinal(valor){
        this.animacoes.map(animacao => animacao.setValorFinal(valor));

        return this;
    }

    setDuration(valor){
        this.animacoes.map(animacao => animacao.setDuration(valor));

        return this;
    }

    reverse(){

        const valorInicial = this.valorInicial;
        const valorFinal   = this.valorFinal;

        this.setValorFinal(valorInicial);
        this.setValorInicial(valorFinal);

        this.setOnTermino(() => null)

        return this;
    }

    onTermino(){
        this.poligono.removeFromScene();
        return this;
    }
}