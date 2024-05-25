import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../inputs/clickable';

import imagemAnguloParalelogramo from '../../assets/anguloParalelogramo.png'
import Proporcionalidade from '../../js/cards/proporcionalidade';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import grid from '../../assets/grid.avif';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import KeyInput from '../inputs/keyInput';
import { Output } from '../outputs/Output';
import AnimationControler from '../animacoes/animationControler';
import { Objeto } from '../objetos/objeto';
import { HoverPosition } from '../inputs/position';

import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages'
import { Operations } from '../equations/operations';
import { AnimacaoSequencial } from '../animacoes/animation';
import MostrarTexto from '../animacoes/MostrarTexto';




class FrameRateCalculator{

    constructor(){
        this.tempo = 0;
        this.framesDesdeUltimaMedida = 1;

        this.media = 0;
    }

    calcular(tempo){

        const tempoAntigo = this.tempo;
        const framesDesdeUltimaMedida = this.framesDesdeUltimaMedida;

        this.tempo = tempo;
        this.framesDesdeUltimaMedida = 1;

        const frameRate = 1000 * framesDesdeUltimaMedida/ (tempo - tempoAntigo);

        this.media = this.media * 0.9 + frameRate*0.1;

        return frameRate;
    }

    sample(iteracoes, tempo){

        if(this.framesDesdeUltimaMedida < iteracoes) 
            this.framesDesdeUltimaMedida++;
        else 
            return {atual: this.calcular(tempo), media: this.media};
    }

}
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

        camera.fase = this; //Gambiarra para poder acessar a fase nos inputs, preguiça de refatorar
        
        this.frames = [];
        this.animacoes = [];
        this.objetos = [];
        this.animationControler = new AnimationControler(null,this,null,null,null);
        this.operadores = new Operations(null,this);
        this.dimensoes  = {width: width, height: height}
        this.controleDaCarta = null; //Serve para o controle da carta poder avisar os controles da fase
        this.pilhaDeCartas = [] //Talvez criar uma classe para isso, o baralho
        this.calculadorFrameRate = new FrameRateCalculator();
        this.mostrarFrameRate = false;

        this.informacao = {
            objetosProporcionais: [] //Usado pela carta Proporcionalidade
        }
    }

    cartas = [];
    

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        
    }

    //Dialogues go here

    //Cria a caixa de texto onde o texto vai aparecer
    setupTextBox(){
        // Create a parent element to hold the spans
        const container = document.createElement('p');
        container.style.fontFamily = "Bangers";
        container.style.fontSize = "30px";
        container.style.fontWeight ="italic";
        container.style.display = 'inline-block';
        console.log('SETUPTEXTBOX CONTAINER', container)

        container.classList.add("textoPrincipal");

        // Create the CSS2DObject using the container
        const cPointLabel = new CSS2DObject(container);       

        this.text = cPointLabel;

        this.text.position.y = 3.5;

        this.scene.add(this.text);
        console.log('SETUPTEXTBOX SCENE', this.scene)
        console.log('SETUPTEXTBOX TEXT', this.text)

        this.changeText("Crie um triangulo equilatero");
    }

    //Cria elementos css2d a partir de um texto
    createTextBox(text, position=[0,0,0], tamanhoDaFonte=25, addToScene=true){

        const container = document.createElement('p');
        container.style.fontSize = tamanhoDaFonte + "px";
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontWeight = 500;
        container.style.display = 'inline-block';

        // Split the text into individual characters
        const characters = text.split('');

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

        if(addToScene) this.scene.add(cPointLabel);

        return cPointLabel;
    }

    //Cria elementos css2d a partir de uma equação
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

    //Cria elementos css2d que renderizam MathJax a partir de um texto input
    createMathJaxTextBox(inputTex,position=[0,0,0], tamanhoDaFonte=10){

        const adaptor = liteAdaptor();
        RegisterHTMLHandler(adaptor);

        const tex = new TeX({ packages: AllPackages });
        const svg = new SVG();
        const html = mathjax.document('', { InputJax: tex, OutputJax: svg });

        const elementoDiv = document.createElement("div");
        const cPointLabel = new CSS2DObject(elementoDiv);

        cPointLabel.position.x = position[0];
        cPointLabel.position.y = position[1];
        cPointLabel.position.z = position[2];

        // Função auxiliar para mudar texto renderizado pelo mathjax dinamicamente
        cPointLabel.mudarTexto = function(text, fontsize=10){

            //Cria o html e coloca ele dentro do div
            const display = html.convert(text, { display: true });

            elementoDiv.innerHTML = adaptor.innerHTML(display);

            //Configura tamanho da fonte
            elementoDiv.children[0].style.width  = `${fontsize*text.length/10}em`;
            elementoDiv.children[0].style.height = `${fontsize*text.length/10}em`;
            elementoDiv.children[0].style.color  = 'black';

            cPointLabel.tamanhoFonte = fontsize;
            cPointLabel.text = text;

            return cPointLabel;
        }

        return cPointLabel.mudarTexto(inputTex, tamanhoDaFonte);
    }
    
    createSidenote(texto, tamanho=17){
        return this.createTextBox(texto, [-5.6, 0.6, 0], tamanho, false);
    }

    
    //Muda o conteúdo da caixa de texto
    changeText(texto, target = null){

        console.log(texto);

        if(target == null) target = this.text;

        target.element.textContent = '';

        // Split the text into individual characters
        const characters = texto.split('');

        // Create spans for each character and apply the fading effect
        characters.forEach((character,index) => {
            const span = document.createElement('span');
            span.textContent = character;
            target.element.appendChild(span);
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

        // Só uma animação com o mesmo nome, como se fossem threads
        const animacaoRepetida = this.animacoes.filter(repetida => repetida.nome && repetida.nome == animacao.nome);

        if(animacaoRepetida.length) {
            animacaoRepetida[0].finalizarExecucao();
            this.animacoes = this.animacoes.filter(animacao => animacao.name != animacaoRepetida[0].name)
            if(animacao.nome == "Dialogo Carta") {
                console.log(this.animacoes, animacaoRepetida)
            }
        }

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

        this.frames.forEach(frame => frame.next()); //Roda as animações do programa

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

        const frameRate = this.calculadorFrameRate;

        function animate(time) {

            const resultado = frameRate.sample(30, time);

            if(resultado && fase.mostrarFrameRate) 
                console.log(`fps médio: ${resultado.media}, fps instantâneo: ${resultado.atual}`);

            if(fase.stop) return;

            requestAnimationFrame( animate );
        
            //Atualiza o fase
            fase.update();
        
            renderer.render( scene, camera );
            labelRenderer.render( scene, camera );
        }
        animate();
    }
    animacaoDialogo(texto, target = null){

        if(target != null){
            return new AnimacaoSequencial(
                new MostrarTexto(target, (target.scene)? null : this.scene)
            )
            .setOnStart(() => target.element.textContent = texto)
            .setCheckpointAll(false);
        }

        return new TextoAparecendo(target? target : this.text.element)
                                  .setOnStart(
                                    () => this.changeText(texto, target)
                                  )
                                  .setValorFinal(100)
    }


    animacaoMostrarDialogo(texto, target = this.text){
        
        return new MostrarTexto(target? target : this.text.element)
                                  .setOnStart(
                                    () => target.element.textContent = texto
                                  )
                                  .setValorFinal(25* texto.length)
    
    }

    animacoesDialogo(...textos){
        return new AnimacaoSequencial().setAnimacoes(textos.map(texto => this.animacaoDialogo(texto)));
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

    outputTesteClick(){

        const testeClick = new Output()
                           .setUpdateFunction(function(novoEstado){
            
                                if(novoEstado.clicado == true){
                                    this.estado.clicado = true;
                                }

                                if(novoEstado.position && this.estado.clicado){
                                    console.log(novoEstado.position);

                                    this.estado.clicado = false;
                                }
                           })


        const planoMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial());
        const plano = Objeto.fromMesh(planoMesh);

        new HoverPosition(plano, this.camera);
        new Clickable(plano, this.camera)

        plano.hoverposition.addObserver(testeClick);
        plano.clickable.addObserver(testeClick);

        plano.visible = false;
        
        this.scene.add(plano);
    }

    appendOperadoresAJanelaEquacao(equationWindow){
        
        const selecionador = this.operadores.getOptions();

        equationWindow.appendChild(selecionador);
    }

    //Adiciona o controle da carta em execução, verificar necessidade de tornar uma pilha
    adicionarControleDaCarta(controle){
        this.controleDaCarta = controle;

        return this;
    }
}