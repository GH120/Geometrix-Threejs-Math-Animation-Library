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
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import grid from '../../assets/grid.avif';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import KeyInput from '../inputs/keyInput';
import { Output } from '../outputs/Output';
import AnimationControler from '../animacoes/animationControler';

export class Fase {

    
    constructor(){

        //TODO: Ajeitar proporções para ficar proporcional a tela
        const width = 16;
        const height = 8;

        // === THREE.JS CODE START ===
        const scene = new THREE.Scene();
        // const camera = new THREE.PerspectiveCamera(75, window.screen.width / window.innerHeight, 0.1, 1000);
        const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2+1, height / - 2 +1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        const wBody = document.getElementsByTagName('body')[0].offsetWidth;
        const hBody = document.getElementsByTagName('body')[0].offsetHeight;

        renderer.domElement.id = 'MEUCANVAS';
        renderer.setSize(window.screen.width, window.innerHeight);

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.screen.width, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        labelRenderer.domElement.hidden = false;
        labelRenderer.domElement.id = "dialogo"

        this.setupThreejs({scene, 
            width: window.screen.width,
            height: window.innerHeight,
            renderer,
            camera,
            labelRenderer})

        const container = document.createElement('p');
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontSize = "25px";
        container.style.fontWeight ="italic";
        container.style.display = 'inline-block';
        console.log('SETUPTEXTBOX CONTAINER', container)

        camera.position.z = 150;
        
        this.frames = [];
        this.animacoes = [];
        this.objetos = [];
        this.animationControler = new AnimationControler(null,this,null,null,null);
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
        console.log('SETUPTEXTBOX CONTAINER', container)

        // Create the CSS2DObject using the container
        const cPointLabel = new CSS2DObject(container);       

        this.text = cPointLabel;

        this.text.position.y = 3.5;

        this.scene.add(this.text);
        console.log('SETUPTEXTBOX SCENE', this.scene)
        console.log('SETUPTEXTBOX TEXT', this.text)

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
    createInputs(){
        
    }

    //Inputs que são ligados ao drag, hover e click
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

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        this.animationControler.handleCheckpoint();
    }

    // event listener funcionando 
    setupThreejs({scene, width, height, renderer, camera, labelRenderer}) {

        scene.background = new THREE.TextureLoader().load(grid);

        this.scene = scene;
        this.width = width;
        this.height = height;
        this.renderer = renderer;
        this.labelRenderer = labelRenderer;
        this.camera = camera;
        this.canvas = renderer.domElement;

        window.addEventListener('resize', function() {
            camera.aspect = window.screen.width / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.screen.width, window.innerHeight);
            labelRenderer.setSize(window.screen.width, window.innerHeight);
        });

    }

    //Começa a execução do programa inicializando o loop de animações
    start(){

        const fase      = this;
        const labelRenderer = this.labelRenderer;
        const renderer      = this.renderer;
        const scene         = this.scene;
        const camera        = this.camera;

        function animate() {

            if(fase.stop) return;

            requestAnimationFrame( animate );
        
            //Atualiza o fase
            fase.update();
        
            renderer.render( scene, camera );
            labelRenderer.render( scene, camera );
        }
        animate();
    }

    getTranslatedPositionRelativeToDocument(element) {
        let x = 0;
        let y = 0;
        let currentElement = element;

        // Traverse up the DOM tree to accumulate transformations
        while (currentElement) {
            const rect = currentElement.getBoundingClientRect();
            const style = window.getComputedStyle(currentElement);

            console.log(!!style.transform,currentElement.style,currentElement.style.transform);

            if(style.transform){

                const translateX = parseFloat(style.transform.match(/translate\((-*\s*[0-9]*px?,-*.*[0-9]*px?)\)/)[0]);
                const translateY = parseFloat(style.transform.match(/translate\((-*\s*[0-9]*px?,-*.*[0-9]*px?)\)/)[1]);

                console.log(translateX, style.transform.match(/translate\((-*\s*[0-9]*px?,-*.*[0-9]*px?)\)/))

                const transformOriginX = parseFloat(style.transformOrigin.split(" ")[0]);
                const transformOriginY = parseFloat(style.transformOrigin.split(" ")[1]);

            }

            if(!currentElement.parentElement && !!style.transform) continue;

            currentElement = currentElement.parentElement;
        }

        return { x, y };
    }

    htmlToWorld(elemento){

        const {x,y} = this.getTranslatedPositionRelativeToDocument(elemento);


        console.log(x,y)

        const ponto = this.pixelToCoordinates(x, y );

        return new THREE.Vector3(ponto.x, ponto.y, 0.0);
    }

    /**Transforma o pixel da tela em uma coordenada para o canvas, 
     * útil para escrever textos quando a câmera constantemente muda de posição
     * Ou quer ter certeza que vai aparecer em certo lugar idependente to tamanho do monitor**/
    pixelToCoordinates(x,y){
    
        const raycaster = new THREE.Raycaster();
    
        raycaster.setFromCamera(this.normalizar(x,y), this.camera);
        
        const intersects = raycaster.intersectObject(new THREE.Mesh(
        new THREE.PlaneGeometry(100,100),
        new THREE.MeshBasicMaterial({color:0xffffff})
        ));
    
        if (intersects.length > 0) {
        // Update the object's position to the intersection point
        return intersects[0].point;
        }
    
    }
    
    normalizar(x, y) {

        const canvas = this.canvas;

        const rect = this.canvas.getBoundingClientRect();
        const normalizedX = (x - rect.left) / canvas.width * 2 - 1;
        const normalizedY = -(y - rect.top) / canvas.height * 2 + 1;
        return new THREE.Vector2(normalizedX,normalizedY);
    }


}