import { MostrarAngulo } from "../outputs/mostrarAngulo";
import { PopInAngles } from "./PopInAngles";
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from "./animation";
import { apagarObjeto } from "./apagarObjeto";
import DesenharMalha from "./desenharMalha";
import MostrarTracejado from "./mostrarTracejado";

//**Adiciona a fase automaticamente ao realizar animação de desenhar o polígono */
export default class DesenharPoligono extends AnimacaoSequencial{

    constructor(poligono, scene, aparecerGraus=true){
        super();

        const fadeInVertices = poligono.vertices.map((vertex,index) => apagarObjeto(vertex)
                                                               .setValorInicial(0)
                                                               .setValorFinal(1)
                                                               .setDuration(30)
                                                               .setProgresso(0)
                                                               .filler(30 + 5*index)
                                                    )

        const drawEdges =  poligono.edges.map((aresta, index) => new MostrarTracejado(aresta, scene))

        const drawAngles = poligono.angles.map((angle,index) => PopInAngles(angle,scene).filler(index*20))

        //Fazer depois
        // const showDegrees = poligono.angles.map(angle => this.mostrarAngulo(angle));

        // const grausDosAngulos = new AnimacaoSimultanea().setAnimacoes(showDegrees);

        //Adiciona a cena antes de criar os vertices, 
        //seta o comprimento das arestas para 0, para animação seguinte de desenhar arestas
        const funcaoSetup = () => {
            poligono.addToScene(scene);
            drawEdges.map(desenharAresta => desenharAresta.setProgresso(0));
            drawAngles.map(desenharAngulo => desenharAngulo.setProgresso(0));
        }

        const desenharAngulos = new AnimacaoSimultanea().setAnimacoes(drawAngles);

        const desenharArestas = new AnimacaoSimultanea().setAnimacoes(drawEdges);

        const desenharVertices = new AnimacaoSimultanea().setAnimacoes(fadeInVertices).setOnStart(funcaoSetup)

        
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