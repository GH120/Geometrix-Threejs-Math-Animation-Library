import { Tracejado } from "../objetos/tracejado";
import Animacao from "./animation";

export default class MostrarTracejado extends Animacao{

    constructor(tracejado, scene){
        super(tracejado);

        this.scene = scene;

        this.valorInicial = tracejado.origem.clone();
        this.valorFinal   = tracejado.destino.clone();
        this.frames = 50;
        this.voltar = false;

        this.setUpdateFunction(function(posicao){

            const scene     = this.scene;
            const tracejado = this.objeto;

            scene.remove(tracejado.mesh);

            tracejado.destino = posicao;

            tracejado.renderMalha();

            scene.add(tracejado.mesh);
        })
    }

    interpolacao(inicial, final, peso){

        const curva = (x) =>  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

        return inicial.clone().lerp(final, curva(peso));
    }
}