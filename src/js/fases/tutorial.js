import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../inputs/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from '../animacoes/animation';
import { colorirAngulo } from '../animacoes/colorirAngulo';
import { Tracejado } from '../objetos/tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';
import { Fase } from './fase';
import { Output } from '../outputs/Output';
import Pythagoras from '../equations/pythagoras';
import { PythagorasCard } from '../cards/pythagorasCard';
import { apagarObjeto } from '../animacoes/apagarObjeto';

export class Tutorial extends Fase{

    constructor(){

        super();

        this.triangulo = new Triangle()
                            .render()
                            .addToScene(this.scene);

        this.objetos.push(this.triangulo);

        this.trigonometria = [];

        this.createInputs();
        this.createOutput();
        this.setupTextBox();

        this.levelDesign();
    }

    //Cria a caixa de texto onde o texto vai aparecer
    setupTextBox(){
        // Create a parent element to hold the spans
        const container = document.createElement('p');
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontSize = "25px";
        container.style.fontWeight ="italic";
        container.style.display = 'inline-block';

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
            this.text.element.appendChild(span);
        });
    }

    createInputs(){
        this.triangulo.vertices.map(vertice => new Hoverable(vertice,this.camera));

        this.triangulo.vertices.map(vertice => new Clickable(vertice,this.camera));
    }

    createOutput(){
        const highlight = new Output()
                            .setUpdateFunction(function(newState){
                                if (newState.dentro)
                                    alert("busco");
                            })

        this.triangulo.vertices.map(vertice => vertice.hoverable.addObserver(highlight));

        this.triangulo.vertices.map(vertice => vertice.clickable.addObserver(highlight));
    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    levelDesign() {
        const apagarTriangulo = apagarObjeto(this.triangulo.vertices[0]);
        const apagarTriangulo1 = apagarObjeto(this.triangulo.vertices[1]);

        apagarTriangulo.setDuration(600);
        apagarTriangulo1.setDuration(600);

        const anmSeq = new AnimacaoSequencial(apagarTriangulo, apagarTriangulo1);
        
        this.animar(anmSeq);
    }

    //Interface gráfica
    /*
    setupInterface(){
        const gui = new dat.GUI();

        //Configurações
        const options = {
        "tamanho da esfera": 0.1,
        "grossura": 0.05,
        "raio do ângulo": 0.7,
        "atualizar": false,
        "duração da animação":90,

        mudarFuncaoTrigonometrica: {
            toggleFunction: function() { 
                button.name(`Mostrando ${this.mudarFuncaoTrigonometrica().estado.nome}`);
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
        // gui.add(options, "duração da animação",45,600).onChange((value) => {divisao.setDuration(value); divisao.delay = value/2})
        // gui.add( {onClick: () => this.trigonometria.map(trig => trig.animando = !trig.animando)}, 'onClick').name('Mostrar animação de divisão');
        // gui.add( {onClick: () => this.circunscrever()},'onClick').name('Animação de circunscrever triângulo');
        gui.add( {onClick: () => options.atualizar = !options.atualizar}, 'onClick').name('atualizar todo frame');
        let button = gui.add(options.mudarFuncaoTrigonometrica, 'toggleFunction').name('Mostrando nada');

    }
    */

    update(){
        // this.atualizarOptions();

        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
 

        // if(options.atualizar) triangle.update();

        // if (this.triangulo.equilatero()) {
        //     this.changeText("VITORIA!!!");
        //     // botar notif
        // }
    }
}