// TODO: REFATORAR ISSO AQUI

import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../inputs/clickable';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from '../animacoes/animation';
import { colorirAngulo } from '../animacoes/colorirAngulo';
import { Tracejado } from '../objetos/tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';
import Bracket from '../objetos/bracket';
import Pythagoras from '../equations/pythagoras';
import { Addition, Value, Variable } from '../equations/expressions';
import { Fase } from './fase';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import grid from '../../assets/grid.avif';

  

export class Fase3 extends Fase{

    constructor(){

        super()

        this.triangulo = new Triangle()
                        .render()
                        .addToScene(this.scene);


        this.triangulo.edges[0].valor = new Addition(new Variable("x"), new Value(-1));
        this.triangulo.edges[1].valor = new Addition(new Variable("x"), new Value(-2));
        this.triangulo.edges[2].valor = new Variable("x");


        this.objetos.push(this.triangulo);
        
        this.trigonometria = [];

        this.createInputs();
        this.createHandlers();
        this.setUpAnimar();
        this.addToScene(this.scene);
        // this.setupInterface();
        this.setupTextBox();

        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        const dialogo = ["Encontre o valor de x"]

        this.changeText(dialogo[0]);

        const lado1 = this.createEquationBox("(x - 1)",[3.8,1.8,0])
        const lado2 = this.createEquationBox("(x - 2)",[1.5,-0.5,0])
        const lado3 = this.createEquationBox("x",[1,2.5,0])

        const bracket = new Bracket(0.2).addToScene(this.scene);
        const bracket2 = new Bracket(0.2, [-0.4,-0.35,0], [2.6,-0.35,0]).addToScene(this.scene)
        const bracket3 = new Bracket(-0.2, [-0.3,0.3,0], [2.7,3.3,0]).addToScene(this.scene)

        const anim1 = new AnimacaoSimultanea(bracket.animacao(), new TextoAparecendo(lado1.element).setProgresso(0))
        const anim2 = new AnimacaoSimultanea(bracket2.animacao(), new TextoAparecendo(lado2.element).setProgresso(0))
        const anim3 = new AnimacaoSimultanea(bracket3.animacao(), new TextoAparecendo(lado3.element).setProgresso(0))
        const anim4 = new TextoAparecendo(this.text.element).setProgresso(0);
        
        const removeAll = () => {this.scene.remove(bracket.mesh);    
                                 this.scene.remove(bracket2.mesh); 
                                 this.scene.remove(bracket3.mesh);
        }

        const animacaoCompleta = new AnimacaoSequencial(anim1,anim2,anim3,anim4).manterExecucaoTodos(true).setOnTermino(removeAll);

        animacaoCompleta.animacoes.map(subAnimacao => subAnimacao.checkpoint = false);

        // this.animar(new AnimacaoSequencial(anim1,anim2,anim3.setOnTermino(removeAll),anim4).manterExecucaoTodos(true))
        this.animar(animacaoCompleta)


        // new Pythagoras(this);
    }

    // Cria a caixa de texto onde o texto vai aparecer
    setupTextBox(){
        // Create a parent element to hold the spans
        const container = document.createElement('p');
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontSize = "25px";
        container.style.fontWeight ="italic";
        container.style.display = 'inline-block';
        container.style.zIndex = 1000;

        // Create the CSS2DObject using the container
        const cPointLabel = new CSS2DObject(container);       

        this.text = cPointLabel;

        this.text.position.y = 3.5;

        this.scene.add(this.text);

        this.changeText("Crie um triangulo equilatero");
    }

    //Muda o conteúdo da caixa de texto
    changeText(texto){

        console.log(texto);

        this.text.element.textContent = '';

        // Split the text into individual characters
        const characters = texto.split('');

        // Create spans for each character and apply the fading effect
        characters.forEach((character,index) => {
            const span = document.createElement('span');
            span.textContent = character;
            span.style.zIndex = 1000;
            this.text.element.appendChild(span);
        });
    }

    createEquationBox(equation, position){

        const container = document.createElement('p');
        container.style.fontSize = "25px";
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontWeight = 500;
        container.style.display = 'inline-block';

        // Split the text into individual characters
        const characters = equation.split('');

        // Create spans for each character and apply the fading effect
        characters.forEach((character,index) => {
            const span = document.createElement('span');
            span.textContent = character;
            container.appendChild(span);
        });

        // Create the CSS2DObject using the container
        const cPointLabel = new CSS2DObject(container);       

        cPointLabel.position.x = position[0];
        cPointLabel.position.y = position[1];
        cPointLabel.position.z = position[2];

        this.scene.add(cPointLabel);

        return cPointLabel;
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
        this.moverVertice = triangulo.vertices.map(vertex => new MoverVertice(vertex));
        //É um observer, quando onHover é acionado, adiciona ou remove o texto do ângulo
        this.mostrarAngulo = triangulo.angles.map(angle => new MostrarAngulo(angle).addToScene(this.scene));
        //É um observer, colore os ângulos quando o triangulo é isóceles/equilatero
        this.colorirIsoceles = new ColorirIsoceles(triangulo);
        // //É um observer, mostra o tipo desse triângulo
        this.mostrarTipo = new MostrarTipo(triangulo).addToScene(this.scene);
        // //É um observer, mostra a bissetriz do ângulo
        this.bissetrizes = triangulo.angles.map(angle => new MostrarBissetriz(triangulo, angle,this.scene));

        // //Liga esses observers ao hover/drag, quando acionados, eles avisam seus observers
        this.hoverable.map((hoverable,index) => hoverable.addObserver(this.mostrarAngulo[index]));
        // this.hoverable.map((hoverable,index) => hoverable.addObserver(this.bissetrizes[index]));
        // this.clickable.map((clickable, index)=> clickable.addObserver(this.bissetrizes[index]));
        // this.draggable.map((draggable,index) => draggable.addObserver(this.bissetrizes[index]));
        // this.draggable.map((draggable,index) => draggable.addObserver(this.moverVertice[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.mostrarAngulo[index]));
        this.draggable.map( draggable => draggable.addObserver(this.colorirIsoceles));
        // this.draggable.map( draggable => draggable.addObserver(this.mostrarTipo));
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
}