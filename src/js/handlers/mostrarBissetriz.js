import MostrarTracejado from "../animacoes/mostrarTracejado";
import { Tracejado } from "../objetos/Tracejado";

//No ato de criar uma bissetriz, criar um novo triangulo?
export class MostrarBissetriz{

    constructor(triangulo, angulo, scene){
        this.triangulo = triangulo;
        this.angulo = angulo;
        this.vertice = triangulo.vertices[angulo.index];
        this.ladoOposto = triangulo.edges[(angulo.index+1)%3];
        this.scene = scene;
        this.estado = {};

        const origem  = this.vertice.position.clone();
        const destino = this.ladoOposto.mesh.position.clone();

        this.tracejado = new Tracejado(origem,destino);
    }

    update(estadoNovo){

        this.estado = {...this.estado, ...estadoNovo};

        this.scene.remove(this.tracejado.mesh);

        if(this.estado.dentro){

            this.tracejado.origem  = this.vertice.position.clone();
            this.tracejado.destino = this.ladoOposto.mesh.position.clone();
            this.tracejado.renderMalha();

            this.scene.add(this.tracejado.mesh);

            const animacao = new MostrarTracejado(this.tracejado, this.scene);

            if(this.novaAnimacao(animacao)) this.animar(animacao);
        }
        else{
            //if !this.estado.clicado
            if(this.animacao) this.animacao.animationFrames.return();
        }
    }

    //Enquanto a animação não estiver terminada, não adicionar animação
    novaAnimacao(animacao){

        if(this.animacao && this.animacao.animationFrames.next().done){
            this.animacao = animacao;
            return true;
        }

        if(this.animacao) return false;

        this.animacao = animacao;

        return true;
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }
}