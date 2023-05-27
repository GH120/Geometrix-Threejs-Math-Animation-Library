import {Draggable} from './controles/draggable';
import {Hoverable} from './controles/hoverable';
import {MostrarAngulo} from './handlers/mostrarAngulo';
import { ColorirIsoceles } from './handlers/colorirIsoceles';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import { MostrarTipo } from './handlers/mostrarTipo';

export class Programa {

    constructor(triangle, scene, camera){
        this.triangulo = triangle;
        this.scene  = scene;
        this.camera = camera;
        this.frames = [];

        this.createControlers();
        this.createHandlers();
        this.setUpAnimar();
        this.addToScene(scene);
    }

    createControlers(){
        
        const triangulo = this.triangulo;
        const camera = this.camera;

        
        this.hoverable = triangulo.angles.map(   angle  => new Hoverable(angle , camera));
        this.draggable = triangulo.vertices.map( vertex => new Draggable(vertex, camera).addObserver(triangulo));

        return this;
    }

    createHandlers(){

        const triangulo = this.triangulo;

        //É um observer, quando onHover é acionado, adiciona ou remove o texto do ângulo
        this.mostrarAngulo = triangulo.angles.map((angle, index) => new MostrarAngulo(triangulo, index));
        //É um observer, colore os ângulos quando o triangulo é isóceles/equilatero
        this.colorirIsoceles = new ColorirIsoceles(triangulo);
        //É um observer, mostra o tipo desse triângulo
        this.mostrarTipo = new MostrarTipo(triangulo);

        // //Liga esses observers ao hover/drag, quando acionados, eles avisam seus observers
        this.hoverable.map((hoverable,index) => hoverable.addObserver(this.mostrarAngulo[index]));
        this.draggable.map( draggable => draggable.addObserver(this.colorirIsoceles));
        this.draggable.map(draggable => draggable.addObserver(this.mostrarTipo));

        this.handlers = [...this.mostrarAngulo, this.colorirIsoceles, this.mostrarTipo];
        
        return this;
    }

    addToScene(scene){
        this.mostrarAngulo.map(m => m.addToScene(scene));
        this.mostrarTipo.addToScene(scene);

        return this;
    }

    setUpAnimar(){
        const linkarHandler = handler => handler.animar = (animacao) => this.animar(animacao);

        this.handlers.map(linkarHandler);

        return this;
    }

    animar(animacao){
        this.frames.push(animacao.getFrames());

        console.log(this.frames);

        return this;
    }

    
}