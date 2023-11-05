import {Draggable} from './inputs/draggable';
import {Hoverable} from './inputs/hoverable';
import {MostrarAngulo} from './outputs/mostrarAngulo';
import { ColorirIsoceles } from './outputs/colorirIsoceles';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './outputs/trigonometry';
import { MostrarTipo } from './outputs/mostrarTipo';
import  MoverVertice  from './outputs/moverVertice';
import Circle from './objetos/circle';
import * as THREE from 'three'
import Circunscrever from './animacoes/circunscrever';
import { MostrarBissetriz } from './outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from './inputs/clickable';
import FixarAoCirculo from './outputs/fixarAoCirculo';

import * as dat from 'dat.gui';

//Responsável por adiconar os controles de arrasto e hover
//liga os handlers aos Inputs
//handlers são objetos que fazem ações quando acionados pelos controles
//Nesse caso, são os handlers que mostram o texto, criam animações, mudam cor...
export class Programa {

    constructor(triangulo, scene, camera){
        this.triangulo = triangulo;
        this.scene  = scene;
        this.camera = camera;
        this.frames = [];
        this.animacoes = [];
        this.trigonometria = [];

        this.createInputs();
        this.createHandlers();
        this.setUpAnimar();
        this.addToScene(scene);
        this.setupInterface();
        this.getEstados();
    }

    createInputs(){
        
        const triangulo = this.triangulo;
        const camera = this.camera;

        const selecionar = new MultipleClickable(triangulo.angles, camera)
        
        this.clickable = triangulo.angles.map(   angle  => selecionar);
        this.hoverable = triangulo.angles.map(   angle  => new Hoverable(angle , camera));
        this.draggable = triangulo.vertices.map( vertex => new Draggable(vertex, camera));

        return this;
    }

    createHandlers(){

        const triangulo = this.triangulo;

        //É um observer, quando há um arraste do objeto, ele move o objeto para a nova posição
        this.moverVertice = triangulo.vertices.map(vertex => new MoverVertice(triangulo,vertex));
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
        this.clickable.map((clickable, index)=> clickable.addObserver(this.bissetrizes[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.bissetrizes[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.moverVertice[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.mostrarAngulo[index]));
        this.draggable.map( draggable => draggable.addObserver(this.colorirIsoceles));
        this.draggable.map( draggable => draggable.addObserver(this.mostrarTipo));
        this.draggable.map(draggable => draggable.addObserver(this.triangulo));

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

        const circulo = criarCirculo.circulo;

        //Dá para usar isso como um puzzle, achar o centro do círculo
        this.fixarAoCirculo = this.triangulo.vertices.map(vertice => new FixarAoCirculo(circulo,vertice));

        criarCirculo.setOnTermino(() => {
            this.draggable.map(draggable => draggable.removeObserver(observer => !this.moverVertice.filter(a => a == observer).length));
            this.draggable.map((draggable,index) => draggable.addObserver(this.fixarAoCirculo[index]));
        })

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

    setupInterface(){
        const gui = new dat.GUI();

        const programa = this;

        //Configurações
        const options = {
        "tamanho da esfera": 0.1,
        "grossura": 0.05,
        "raio do ângulo": 0.7,
        "atualizar": false,
        "duração da animação":90,

        mudarFuncaoTrigonometrica: {
            toggleFunction: function() { 
                button.name(`Mostrando ${programa.mudarFuncaoTrigonometrica().estado.nome}`);
            }
        }
        };

        //Atualizar configurações
        this.atualizarOptions = () => {
            this.triangulo.edges.map(edge => edge.grossura = options.grossura);
            this.triangulo.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
            this.triangulo.angles.map(angle => angle.angleRadius = options["raio do ângulo"])
        }

        //Botões da interface
        gui.add(options, 'grossura', 0.01, 0.2).onChange( () => this.triangulo.update());
        gui.add(options, 'tamanho da esfera', 0.1, 2).onChange( () => this.triangulo.update());
        gui.add(options, 'raio do ângulo', 0.05, 3).onChange( () => this.triangulo.update());
        gui.add(options, "duração da animação",45,600).onChange((value) => {divisao.setDuration(value); divisao.delay = value/2})
        gui.add( {onClick: () => this.trigonometria.map(trig => trig.animando = !trig.animando)}, 'onClick').name('Mostrar animação de divisão');
        gui.add( {onClick: () => this.circunscrever()},'onClick').name('Animação de circunscrever triângulo');
        gui.add( {onClick: () => options.atualizar = !options.atualizar}, 'onClick').name('atualizar todo frame');
        let button = gui.add(options.mudarFuncaoTrigonometrica, 'toggleFunction').name('Mostrando nada');

    }

    update(){
        this.atualizarOptions();

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        // if(options.atualizar) triangle.update();
    }
}