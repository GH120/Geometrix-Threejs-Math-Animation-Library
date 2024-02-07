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
import Animacao, { AnimacaoSequencial } from '../animacoes/animation';
import { Fase } from './fase';
import { Triangle } from '../objetos/triangle';

export class Fase2 extends Fase{

    constructor(){

        super();

        this.triangulo = new Triangle()
                            .render()
                            .addToScene(this.scene);
       
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

        const dialogo = ["Na fase anterior você fez um triângulo, equilátero",
                         "que nem a animação está fazendo abaixo",
                         "O seu objetivo agora é..."]

        this.changeText(dialogo[0]);

        const animacoes = dialogo.slice(1).map(texto => new TextoAparecendo(this.text.element).setOnTermino(() => this.changeText(texto)));

        const anim1 = animacoes[0];
        const anim2 = animacoes[1];
        // const anim3 = animacoes[2];
        // const anim4 = animacoes[3];
        // const anim5 = animacoes[4];
        // const anim6 = animacoes[5];
        const anim7 = new TextoAparecendo(this.text.element);
        //Bug estupido do javascript: array não funciona, por algum motivo descarta objeto passado nele


        // ANIMAÇAO DE PONTO
        const vertice = this.triangulo.vertices[0];

        const triangulo = this.triangulo;

        // x  , y = pontoX do PDFdasideias
        // 1.5, 0                1.5*raiz(3)
        const retornaEq = (x, y, h) => {

            // const l = (2*h)/Math.sqrt(3); 

            const pontoA = new THREE.Vector3(x, y + h, 0);
            const pontoB = new THREE.Vector3(x + h/Math.sqrt(3), y, 0);
            const pontoC = new THREE.Vector3(x - h/Math.sqrt(3), y, 0);

            return [pontoA, pontoB, pontoC];
        }

        const retornaAnim = (vertice, posfinal) => 
            new Animacao(vertice)
                .setValorInicial(vertice.mesh.position.clone())
                .setValorFinal(posfinal)
                .setDuration(100)
                .setInterpolacao(function(inicial,final,peso){
                    return new THREE.Vector3().lerpVectors(inicial,final,peso);
                })
                .setUpdateFunction(function(valor){
                    vertice.mesh.position.copy(valor);
                    triangulo.update();
                })
        

        // const novaAnimacao = new Animacao(vertice)
        //                         .setValorInicial(new THREE.Vector3(2,0,0))
        //                         .setValorFinal(new THREE.Vector3(-2,-2,0))
        //                         .setDuration(300)
        //                         .setInterpolacao(function(inicial,final,peso){
        //                             return new THREE.Vector3().lerpVectors(inicial,final,peso);
        //                         })
        //                         .setUpdateFunction(function(valor){
        //                             vertice.position.copy(valor);
        //                             triangulo.update();
        //                         })

        const pontosEq = retornaEq(1.5, 0, 1.5*Math.sqrt(3));

        const novaAnimacao = retornaAnim(vertice, pontosEq[0]).setOnTermino(() => this.colorirIsoceles.update());
        novaAnimacao.manter = true;
        // const novaAnimacao2 = retornaAnim(vertice, pontosEq[0]);
        // const novaAnimacao3 = retornaAnim(vertice, pontosEq[0]);
        
        this.animar(novaAnimacao)
        // FIM DA ANIMAÇAO

        const sequencia = new AnimacaoSequencial(anim1,anim2,anim7);



        this.animar(sequencia);
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
}