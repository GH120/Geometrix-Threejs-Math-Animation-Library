import MostrarTracejado from "../animacoes/mostrarTracejado";
import { Handler } from './handler';
import { Tracejado } from "../objetos/Tracejado";

//No ato de criar uma bissetriz, criar um novo triangulo?
export class MostrarBissetriz extends Handler{

    constructor(triangulo, angulo, scene){
        super();
        
        this.triangulo = triangulo;
        this.angulo = angulo;
        this.vertice = triangulo.vertices[angulo.index];
        this.ladoOposto = triangulo.edges[(angulo.index+1)%3];
        this.scene = scene;

        this.estado = {selecionado:false, clicados:[]};

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
            this.tracejado.render();

            this.scene.add(this.tracejado.mesh);

            const animacao = new MostrarTracejado(this.tracejado, this.scene);

            if(this.novaAnimacao(animacao)) this.animar(animacao);
        }
        else{
            //Ignora remoção se clicado

            if(this.estaSelecionado()){
                this.scene.add(this.tracejado.mesh);
                return;
            }

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

    //Determina se o ultimo clique seleciona ou deseleciona 
    estaSelecionado(){

        const JaSelecionado = this.estado.selecionado;

        const selecionados  = this.estado.clicados.filter(colisao => colisao != null)
                                                  .map(colisao => colisao.object);

        const clicouNoVazio = this.estado.clicados.filter(colisao => colisao != null).length == 0;

        const selecionadoNesseClique = selecionados.filter(objeto => objeto == this.angulo.hitbox).length > 0;

        this.estado.selecionado = (JaSelecionado && !clicouNoVazio) || selecionadoNesseClique;

        return this.estado.selecionado;
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }
}