import {Draggable} from './controles/draggable';
import {Hoverable} from './controles/hoverable';
import {MostrarAngulo} from './handlers/mostrarAngulo';
import { ColorirIsoceles } from './handlers/colorirIsoceles';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import { MostrarTipo } from './handlers/mostrarTipo';
import  MoverVertice  from './handlers/moverVertice';
import Circle from './objetos/circle';
import * as THREE from 'three'
import Circunscrever from './animacoes/circunscrever';
import { MostrarBissetriz } from './handlers/mostrarBissetriz';

//Responsável por adiconar os controles de arrasto e hover
//liga os handlers aos controlers
//handlers são objetos que fazem ações quando acionados pelos controles
//Nesse caso, são os handlers que mostram o texto, criam animações, mudam cor...
export class Programa {

    constructor(triangle, scene, camera){
        this.triangulo = triangle;
        this.scene  = scene;
        this.camera = camera;
        this.frames = [];
        this.animacoes = [];
        this.trigonometria = [];

        this.createControlers();
        this.createHandlers();
        this.setUpAnimar();
        this.addToScene(scene);
        this.getEstados();
    }

    createControlers(){
        
        const triangulo = this.triangulo;
        const camera = this.camera;

        
        this.hoverable = triangulo.angles.map(   angle  => new Hoverable(angle , camera));
        this.draggable = triangulo.vertices.map( vertex => new Draggable(vertex, camera));

        return this;
    }

    createHandlers(){

        const triangulo = this.triangulo;

        //É um observer, quando há um arraste do objeto, ele move o objeto para a nova posição
        this.moverVertice = triangulo.vertices.map(vertex => new MoverVertice(triangulo, vertex));
        //É um observer, quando onHover é acionado, adiciona ou remove o texto do ângulo
        this.mostrarAngulo = triangulo.angles.map((angle, index) => new MostrarAngulo(triangulo, index));
        //É um observer, colore os ângulos quando o triangulo é isóceles/equilatero
        this.colorirIsoceles = new ColorirIsoceles(triangulo);
        //É um observer, mostra o tipo desse triângulo
        this.mostrarTipo = new MostrarTipo(triangulo);
        //É um observer, mostra a bissetriz do ângulo
        this.bissetrizes = triangulo.angles.map(angle => new MostrarBissetriz(triangulo, angle));

        // //Liga esses observers ao hover/drag, quando acionados, eles avisam seus observers
        this.hoverable.map((hoverable,index) => hoverable.addObserver(this.mostrarAngulo[index]));
        this.hoverable.map((hoverable,index) => hoverable.addObserver(this.bissetrizes[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.moverVertice[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.bissetrizes[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.mostrarAngulo[index]));
        this.draggable.map( draggable => draggable.addObserver(this.colorirIsoceles));
        this.draggable.map( draggable => draggable.addObserver(this.mostrarTipo));

        this.handlers = [...this.moverVertice,
                         ...this.mostrarAngulo,
                         ...this.bissetrizes, 
                         this.colorirIsoceles, 
                         this.mostrarTipo];
        
        return this;
    }

    addToScene(scene){
        this.mostrarAngulo.map(m => m.addToScene(scene));
        this.mostrarTipo.addToScene(scene);
        this.bissetrizes.map(bissetriz => bissetriz.addToScene(scene));

        return this;
    }

    setUpAnimar(){
        const linkarHandler = handler => handler.animar = (animacao) => this.animar(animacao);

        this.handlers.map(linkarHandler);

        return this;
    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        console.log(animacao, "hies")

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    mudarFuncaoTrigonometrica(){    

        //Remove o handler atual
        const notTrigFunction = (observer) => observer.name != this.estado.name;

        const removerObserver = (observable) => observable.removeObserver(notTrigFunction);

        this.hoverable.map(removerObserver);

        //Muda o estado
        const indice = this.estado.index;

        this.estado = this.estados[(indice+1)%4];

        //Adiciona o novo handler 
        const trigHandler = this.estado.funcao;

        if(trigHandler == null) return this;

        const adicionarObserver = (hoverable,index) => {

            const handler = new trigHandler().setTriangulo(this.triangulo,index);

            handler.addToScene(this.scene);

            handler.animar = (animacao) => this.animar(animacao);

            this.trigonometria[index] = handler;

            hoverable.addObserver(handler);
        }

        this.hoverable.map(adicionarObserver);

        return this;
    }

    getEstados(){
        this.estados = [
            {name: "nada",    funcao: null,            index:0, nome:"nada"},
            {name: "sin",     funcao: SenoOnHover,     index:1, nome:"seno"},
            {name: "cos",     funcao: CossenoOnHover,  index:2, nome:"cosseno"},
            {name: "tan",     funcao: TangenteOnHover, index:3, nome:"tangente"}
        ];

        this.estado = this.estados[0];

        return this;
    }

    circunscrever(){
        const criarCirculo = new Circunscrever(this.triangulo, this.scene);

        this.circulo = criarCirculo.circulo;

        this.adicionarCirculo(criarCirculo.circulo);

        this.animar(criarCirculo);

        return this;
    }

    adicionarCirculo(circle){

        this.scene.add(circle.hitbox)

        new Draggable(circle.hitbox,this.camera).addObserver(new MoverVertice(circle, circle.hitbox));

        this.scene.add(circle.mesh);
    }
}