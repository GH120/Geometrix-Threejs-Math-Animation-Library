import {Draggable} from '../controles/draggable';
import {Hoverable} from '../controles/hoverable';
import {MostrarAngulo} from '../handlers/mostrarAngulo';
import { ColorirIsoceles } from '../handlers/colorirIsoceles';
import { MostrarTipo } from '../handlers/mostrarTipo';
import  MoverVertice  from '../handlers/moverVertice';
import { MostrarBissetriz } from '../handlers/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../controles/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from '../animacoes/animation';
import { colorirAngulo } from '../animacoes/colorirAngulo';
import { Tracejado } from '../objetos/Tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';

export class Fase {

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
        this.setupInterface();
        this.setupTextBox();

        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        const dialogo = ["Um triângulo tem três lados e três angulos",
                         "se ele tiver dois ângulos iguais então ele é simétrico",
                         "então podemos dividir ele em dois triângulos iguais",
                        " Como eles são iguais, os lados em evidência tem o mesmo tamanho", 
                        "chamamos estes triângulos de isoceles",
                        "Você consegue fazer um triângulo com três lados iguais?"]

        this.changeText(dialogo[0]);

        const tracejado = new Tracejado(new THREE.Vector3(3,0,0), new THREE.Vector3(1.5,1.5,0));
        
        //On termino usado corretamente, apenas quando o delay e execução terminarem ele muda
        //On delay entretando já executa quando estiver no delay
        const animacoes = dialogo.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)));

        const anim1 = this.firstDialogue(animacoes[0]);
        const anim2 = this.secondDialogue(animacoes[1]);
        const anim3 = this.thirdDialogue(animacoes[2], tracejado);
        const anim4 = this.fourthDialogue(animacoes[3], tracejado);
        const anim5 = animacoes[4];
        const anim6 = animacoes[5];

        console.log(Object.keys(anim1))

        //Bug do javascript: array não funciona, por algum motivo descarta objeto passado nele
        const sequencia = new AnimacaoSequencial(anim1,anim2,anim3,anim4,anim5,anim6);
        // const sequencia = anim4

        this.animar(sequencia);
    }

    firstDialogue(dialogue){

        const fadeInAndOut = (angulo) =>  new AnimacaoSequencial(colorirAngulo(angulo)
                                                                .setValorInicial(0xff0000)
                                                                .setValorFinal(0xffff00)
                                                                .setDuration(80), 
                                                                colorirAngulo(angulo)
                                                                .setValorInicial(0xffff00)
                                                                .setValorFinal(0xff0000)
                                                                .setDuration(40)
                                                                .voltarAoInicio(false))

        const colorirAngulos = this.triangulo.angles.map(angle => fadeInAndOut(angle));

        return new AnimacaoSimultanea(new AnimacaoSequencial(...colorirAngulos),dialogue);
    }

    secondDialogue(dialogue){

        dialogue.setDelay(150);

        const colorirAngulo1 = colorirAngulo(this.triangulo.angles[0])
                              .setValorInicial(0xff0000)
                              .setValorFinal(0x0000aa)
                              .setDuration(100)
                              .voltarAoInicio(false);

        const colorirAngulo2 = colorirAngulo(this.triangulo.angles[2])
                              .setValorInicial(0xff0000)
                              .setValorFinal(0x0000aa)
                              .setDuration(100)
                              .voltarAoInicio(false);

        //Atualiza os mostrarAngulos para eles serem selecionados
        //Atualiza o colorir isoceles depois de ter efetuado as animações
        return new AnimacaoSimultanea(colorirAngulo1, colorirAngulo2, dialogue)
                   .setOnStart(() => this.mostrarAngulo.map(mostrar => mostrar.update({dentro:true})))
    }

    thirdDialogue(dialogue, tracejado){

        const mostrarTracejado = new MostrarTracejado(tracejado, this.scene).setDelay(100);

        const triangle2 = new Triangle([[3,3,0],[1.5,1.5,0],[3,0,0]])
                        .renderVertices()
                        .renderAngles()

        const triangle3 = new Triangle([[3,0,0],[1.5,1.5,0],[0,0,0]])
                        .renderVertices()
                        .renderAngles()

        return new AnimacaoSimultanea(dialogue, mostrarTracejado)
                   .setOnStart(() => {
                    //    Criar uma animação, usar aquela do circulo trigonométrico?
                       triangle3.addToScene(this.scene);
                       triangle2.addToScene(this.scene);
                       this.mostrarAngulo.map(anguloMostrado => anguloMostrado.update({dentro:false}))
                    })
                    .setOnTermino(() => {
                        
                        triangle2.removeFromScene();
                        triangle3.removeFromScene();
                    })
    }

    fourthDialogue(dialogue, tracejado) {

         // TODO: fazer divisao 
        const divisao = new Divisao(this.triangulo.edges[0],this.triangulo.edges[1]).addToScene(this.scene);

        const colorirAresta1 = colorirAngulo(this.triangulo.edges[0])
                               .setValorInicial(0xe525252)
                               .setValorFinal(0xaa0000)
                               .setDuration(50)
                               .voltarAoInicio(false);

        const colorirAresta2 = colorirAngulo(this.triangulo.edges[1])
                               .setValorInicial(0xe525252)
                               .setValorFinal(0x0000aa)
                               .setDuration(50)
                               .voltarAoInicio(false);
        
        const divisaoColorida = new AnimacaoSequencial(colorirAresta1, colorirAresta2, divisao);

        return new AnimacaoSimultanea(dialogue, divisaoColorida)
                   .setOnTermino(() => {
                         this.scene.remove(tracejado.mesh)
                         colorirAresta1.setProgresso(0);
                         colorirAresta2.setProgresso(0);
                    });
    }

    fifthDialogue(dialogue, tracejado) {

        this.scene.remove(tracejado);

        return dialogue
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

    createControlers(){
        
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
        // this.hoverable.map((hoverable,index) => hoverable.addObserver(this.bissetrizes[index]));
        // this.clickable.map((clickable, index)=> clickable.addObserver(this.bissetrizes[index]));
        // this.draggable.map((draggable,index) => draggable.addObserver(this.bissetrizes[index]));
        this.draggable.map((draggable,index) => draggable.addObserver(this.moverVertice[index]));
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

    //Interface gráfica
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
        gui.add(options, "duração da animação",45,600).onChange((value) => {divisao.setDuration(value); divisao.delay = value/2})
        // gui.add( {onClick: () => this.trigonometria.map(trig => trig.animando = !trig.animando)}, 'onClick').name('Mostrar animação de divisão');
        // gui.add( {onClick: () => this.circunscrever()},'onClick').name('Animação de circunscrever triângulo');
        gui.add( {onClick: () => options.atualizar = !options.atualizar}, 'onClick').name('atualizar todo frame');
        let button = gui.add(options.mudarFuncaoTrigonometrica, 'toggleFunction').name('Mostrando nada');

    }

    update(){
        this.atualizarOptions();

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        // if(options.atualizar) triangle.update();

        if (this.triangulo.equilatero()) {
            this.changeText("VITORIA!!!");
            // botar notif
        }
    }
}