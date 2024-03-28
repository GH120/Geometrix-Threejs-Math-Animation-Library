import { MostrarAngulo } from "../outputs/mostrarAngulo";
import { PopInAngles } from "./PopInAngles";
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from "./animation";
import { apagarObjeto } from "./apagarObjeto";
import DesenharMalha from "./desenharMalha";
import MostrarTracejado from "./mostrarTracejado";

export default class DesenharPoligono extends AnimacaoSequencial{

    constructor(poligono, aparecerGraus=true){
        super();

        const fadeInVertices = poligono.vertices.map((vertex,index) => apagarObjeto(vertex)
                                                               .setValorInicial(0)
                                                               .setValorFinal(1)
                                                               .setDuration(30)
                                                               .setProgresso(0)
                                                               .filler(30 + 5*index)
                                                    )

        const drawEdges =  poligono.edges.map((aresta, index) => new MostrarTracejado(aresta, aresta.mesh.parent).setProgresso(0))

        const drawAngles = poligono.angles.map((angle,index) => PopInAngles(angle).filler(index*20))

        //Fazer depois
        // const showDegrees = poligono.angles.map(angle => this.mostrarAngulo(angle));

        // const grausDosAngulos = new AnimacaoSimultanea().setAnimacoes(showDegrees);

        const desenharAngulos = new AnimacaoSimultanea().setAnimacoes(drawAngles)

        const desenharArestas = new AnimacaoSimultanea().setAnimacoes(drawEdges);

        const desenharVertices = new AnimacaoSimultanea().setAnimacoes(fadeInVertices);

        
        this.setAnimacoes([desenharVertices, desenharArestas, desenharAngulos]);

        this.frames = 300


    }


    mostrarAngulo(angle){

        const mostrarAngulo = new MostrarAngulo(angle);
        
        const scene = angle.mesh.parent;

        mostrarAngulo.addToScene(scene);

        mostrarAngulo.increment = ((valor) => {
            console.log(valor, "essevalor")
            return () => {
                mostrarAngulo.text.elemento.element.innerHTML = `${valor}°`
            }
        })();

        return new Animacao()
                .setValorInicial(0)
                .setValorFinal(1)
                .setInterpolacao((a,b,peso) => a*(1-peso) + b*peso)
                .setUpdateFunction(valor => {

                    mostrarAngulo.increment(2);

                })
                .setOnStart(() => {

                    mostrarAngulo.update({dentro:true})
                })
                .setDuration(100)
        
    }
}