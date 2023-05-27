import {Draggable} from './controles/draggable';
import {Hoverable} from './controles/hoverable';
import {MostrarAngulo} from './handlers/mostrarAngulo';
import { ColorirIsoceles } from './handlers/colorirIsoceles';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import { MostrarTipo } from './handlers/mostrarTipo';

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
        this.trigonometria = null;

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

        const adicionarObserver = (hoverable,index) => hoverable.addObserver(new trigHandler().setTriangulo(this.triangulo,index));

        this.hoverable.map(adicionarObserver);

        return this;
    }

    getEstados(){
        this.estados = [
            {name: "nada",    funcao: null,            index:0},
            {name: "sin",     funcao: SenoOnHover,     index:1},
            {name: "cos",     funcao: CossenoOnHover,  index:2},
            {name: "tan",     funcao: TangenteOnHover, index:3}
        ];

        this.estado = this.estados[0];

        return this;
    }
}