import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from "./animation";
import { apagarObjeto } from "./apagarObjeto";
import DesenharMalha from "./desenharMalha";
import MostrarTracejado from "./mostrarTracejado";

export default class DesenharPoligono extends AnimacaoSequencial{

    constructor(poligono){
        super();

        console.log("sim")
        const fadeInVertices = poligono.vertices.map((vertex,index) => apagarObjeto(vertex)
                                                               .setValorInicial(0)
                                                               .setValorFinal(1)
                                                               .setDuration(30)
                                                               .setProgresso(0)
                                                               .filler(30 + 5*index)
                                                    )

        const drawEdges =  poligono.edges.map((aresta, index) => new MostrarTracejado(aresta, aresta.mesh.parent).setProgresso(0))

        const drawAngles = poligono.angles.map((angle,index) => new DesenharMalha(angle, angle.mesh.parent))

        const desenharAngulos = new AnimacaoSequencial().setAnimacoes(drawAngles)

        const desenharArestas = new AnimacaoSimultanea().setAnimacoes(drawEdges);

        const desenharVertices = new AnimacaoSimultanea().setAnimacoes(fadeInVertices);

        
        this.setAnimacoes([desenharVertices, desenharArestas, desenharAngulos]);

        this.frames = 300


    }
}