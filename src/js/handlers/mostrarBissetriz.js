import MostrarTracejado from "../animacoes/mostrarTracejado";
import { Tracejado } from "../objetos/Tracejado";

export class MostrarBissetriz{

    constructor(triangulo, angulo, scene){
        this.triangulo = triangulo;
        this.angulo = angulo;
        this.vertice = triangulo.vertices[angulo.index];
        this.ladoOposto = triangulo.edges[(angulo.index+1)%3];
        this.scene = scene;
        this.tracejado = {mesh:null};
    }
    update(){

    }

    onHover(inside){

        this.scene.remove(this.tracejado.mesh);

        if(inside){
            const origem  = this.vertice.position.clone();
            const destino = this.ladoOposto.mesh.position.clone();

            console.log(origem, destino)

            this.tracejado = new Tracejado(origem,destino);
            this.scene.add(this.tracejado.mesh);

            this.animar(new MostrarTracejado(this.tracejado, this.scene));
        }
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }
}