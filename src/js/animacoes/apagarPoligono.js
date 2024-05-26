import { AnimacaoSimultanea } from "./animation";
import { apagarObjeto } from "./apagarObjeto";

export class ApagarPoligono extends AnimacaoSimultanea{

    constructor(poligono, apagarNoTermino=false){

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

        if(!apagarNoTermino) this.setOnTermino(() => null)

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

    ignorarObjetos(objetos){

        this.animacoes = this.animacoes.filter(animacao => !objetos.includes(animacao.objeto))

        return this;
    }
}