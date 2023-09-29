import {Draggable} from '../controles/draggable';
import {Hoverable} from '../controles/hoverable';
import {MostrarAngulo} from '../handlers/mostrarAngulo';
import { ColorirIsoceles } from '../handlers/colorirIsoceles';
import { MostrarTipo } from '../handlers/mostrarTipo';
import  MoverVertice  from '../handlers/moverVertice';
import { MostrarBissetriz } from '../handlers/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../controles/clickable';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import grid from '../../assets/grid.avif';

export class Fase {

    constructor(){

        this.setupThreejs();
        
        this.frames = [];
        this.animacoes = [];
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        
    }

    //Dialogues go here

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

    //Inputs de drag, hover, click...
    createControlers(){
        
    }

    //Outputs que são ligados ao drag, hover e click
    createHandlers(){

        
    }

    addToScene(scene){

        return this;
    }

    //Liga a função animar dos handlers para suas animações rodarem
    setUpAnimar(){
        const linkarHandler = handler => handler.animar = (animacao) => this.animar(animacao);

        this.handlers.map(linkarHandler);

        return this;
    }

    //Roda animação
    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    //Interface gráfica, caso necessário
    setupInterface(){
        
    }

    //** O update que roda no loop de animações*/
    update(){
        this.atualizarOptions();

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        // if(options.atualizar) triangle.update();

        if (this.triangulo.equilatero()) {
            this.changeText("VITORIA!!!");
            // botar notif
        }
    }

    setupThreejs(){


        const scene = new THREE.Scene();
        const width = window.innerWidth;
        const height = window.innerHeight;

        const canvas = document.getElementById('triangulo');
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
        renderer.setSize( window.innerWidth, window.innerHeight );

        camera.position.z = 5;

        scene.background = new THREE.TextureLoader().load(grid);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild(labelRenderer.domElement);

        this.scene  = scene;
        this.camera = camera;
        this.canvas = canvas;

        this.renderer      = renderer;
        this.labelRenderer = labelRenderer

        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    //Começa a execução do programa inicializando o loop de animações
    start(){

        const programa      = this;
        const labelRenderer = this.labelRenderer;
        const renderer      = this.renderer;
        const scene         = this.scene;
        const camera        = this.camera;

        function animate() {
            requestAnimationFrame( animate );
        
            //Atualiza o programa
            programa.update();
        
            renderer.render( scene, camera );
            labelRenderer.render( scene, camera );
        }
        animate();
    }
}