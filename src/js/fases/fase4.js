import {Draggable} from '../controles/draggable';
import {Hoverable} from '../controles/hoverable';
import {MostrarAngulo} from '../handlers/mostrarAngulo';
import { ColorirIsoceles } from '../handlers/colorirIsoceles';
import { MostrarTipo } from '../handlers/mostrarTipo';
import  MoverVertice  from '../handlers/moverVertice';
import { MostrarBissetriz } from '../handlers/mostrarBissetriz';
import { Clickable, MultipleClickable } from '../controles/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {TGALoader} from 'three/examples/jsm/loaders/TGALoader';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import FixarAoCirculo from '../handlers/fixarAoCirculo';



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
import { Addition, Equality, Value, Variable, VariableMultiplication } from '../equations/expressions';
import Circle from '../objetos/circle';
import DesenharMalha from '../animacoes/desenharMalha';
import RelogioGLB from '../../assets/Relogio.glb'
import { Angle } from '../objetos/angle';
import ColorirOnHover from '../handlers/colorirOnHover';
  

export class Fase4 {

    constructor(triangle, scene, camera){
        this.triangulo = triangle;
        this.scene  = scene;
        this.camera = camera;
        this.frames = [];
        this.animacoes = [];
        this.trigonometria = [];

        // this.createControlers();
        // this.createHandlers();
        // this.setUpAnimar();
        // this.addToScene(scene);
        // this.setupInterface();
        this.setupTextBox();

        this.progresso = 0;
        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        //Tira o triângulo padrão da cena
        this.triangulo.removeFromScene();

        const dialogo = ["O círculo é uma das figuras geométricas mais básicas",
                         "Ele tem um centro",
                         "e um raio",
                         "Como pode ver, todos os pontos no círculo estão na mesma distância do raio",
                         "Então a única diferença entre dois pontos é o giro entre eles",
                         "Esse giro é o chamado ângulo,",
                         "Por padrão, dividimos o círculo em 360 partes, em graus",
                         "e o ângulo é medido neles.",
                         "Quantos graus tem uma hora no relógio?"]

        //Desenha o círculo
        const circulo         = new Circle(new THREE.Vector3(0,0,0), 3).addToScene(this.scene);
        const desenharCirculo = new DesenharMalha(circulo, this.scene)
                                    .setDuration(300)
                                    .setOnTermino(() => null);

        this.circulo = circulo;

        //Efeito de popIn do position
        const position           = new Circle(new THREE.Vector3(0,0,0), 0.1, 0.2);
              position.material  = new THREE.MeshBasicMaterial({color:0x960000});
        const circuloCrescendo = this.circuloCrescendoAnimacao(position);

        //Animações de mostrarTexto de cada diálogo
        const animacoes = dialogo.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)));

        const anim1 = new AnimacaoSimultanea(animacoes[0], desenharCirculo);
        const anim2 = new AnimacaoSimultanea(animacoes[1], circuloCrescendo);
        const anim3 = this.thirdDialogue(animacoes[2], position, circulo);
        const anim4 = animacoes[3].setValorFinal(100);
        const anim5 = this.fifthDialogue( animacoes[4], circulo);
        const anim6 = animacoes[5];
        const anim7 = this.seventhDialogue(animacoes[6]);
        const anim8 = this.eigthDialogue(animacoes[7].setValorFinal(120).setDuration(200)).setDelay(50);
        const anim9 = this.ninthDialogue(animacoes[8]);

        

        this.animar(new AnimacaoSequencial(anim1,anim2,anim3,anim4,anim5,anim6,anim7,anim8,anim9));
    }

    thirdDialogue(dialogue, center, circulo){

        const pontoDoCirculo = new Circle(new THREE.Vector3(0,3,0), 0.1, 0.2);

        pontoDoCirculo.material = new THREE.MeshBasicMaterial({color:0x960000});

        this.ponto1 = pontoDoCirculo;

        const criarPonto = this.circuloCrescendoAnimacao(pontoDoCirculo);

        const tracejado = new Tracejado(circulo.position, pontoDoCirculo.position);

        this.ponto1.tracejado = tracejado;
        

        const moverPonto = (posicaoFinal) => new Animacao(pontoDoCirculo)
                                        .setValorInicial(0)
                                        .setValorFinal(2*Math.PI)
                                        .setInterpolacao((inicial, final, peso) => inicial*(1-peso) + final*peso)
                                        .setDuration(200)
                                        .setCurva(x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
                                        .setUpdateFunction((angulo) => {
                                            const posicao = new THREE.Vector3(3*Math.sin(angulo), 3*Math.cos(angulo), 0)
                                            pontoDoCirculo.position = posicao;
                                            tracejado.destino = posicao.clone().multiplyScalar(0.95);
                                            pontoDoCirculo.update(); //Refatorar circulo, update deve ser apenas update
                                            tracejado.update();
                                        })
        
        const demonstrarRaio = new AnimacaoSequencial(
                                    new AnimacaoSimultanea(criarPonto, new MostrarTracejado(tracejado, this.scene)),
                                    moverPonto(new THREE.Vector3(3,0,0)).setOnStart(() => tracejado.addToScene(this.scene))
                                )

        return new AnimacaoSimultanea(dialogue, demonstrarRaio)
    }

    fifthDialogue(dialogue, circulo){

        const pontoDoCirculo = new Circle(new THREE.Vector3(3*Math.sin(Math.PI*0.3),3*Math.cos(Math.PI*0.3),0), 0.1, 0.2);

        pontoDoCirculo.material = new THREE.MeshBasicMaterial({color:0x960000});

        this.ponto2 = pontoDoCirculo;

        const angle = new Angle([circulo, this.ponto2, this.ponto1], 0).render()

        const mostrarAngulo = new MostrarAngulo({vertices:[circulo,this.ponto2, this.ponto1], angles:[angle]}, 0).addToScene(this.scene);

        const criarPonto = this.circuloCrescendoAnimacao(pontoDoCirculo);

        const tracejado = new Tracejado(circulo.position, pontoDoCirculo.position);

        this.angle = angle;

        this.ponto2.tracejado = tracejado;
        
        //Função para dar update em todos os observadores dependetes do ponto
        pontoDoCirculo.updateObservers = () => {
            tracejado.destino = pontoDoCirculo.position.clone().multiplyScalar(0.95);
            pontoDoCirculo.update(); //Refatorar circulo, update deve ser apenas update
            tracejado.update();
            angle.update()
            mostrarAngulo.update({dentro:true})
        }
        
        const desenharAngulo = new DesenharMalha(angle, this.scene)

        const moverPonto = (posicaoFinal) => new Animacao(pontoDoCirculo)
                                        .setValorInicial(Math.PI*0.3)
                                        .setValorFinal(Math.PI*2/3)
                                        .setInterpolacao((inicial, final, peso) => inicial*(1-peso) + final*peso)
                                        .setDuration(200)
                                        .setCurva(x => {
                                            const n1 = 7.5625;
                                            const d1 = 2.75;
                                            
                                            if (x < 1 / d1) {
                                                return n1 * x * x;
                                            } else if (x < 2 / d1) {
                                                return n1 * (x -= 1.5 / d1) * x + 0.75;
                                            } else if (x < 2.5 / d1) {
                                                return n1 * (x -= 2.25 / d1) * x + 0.9375;
                                            } else {
                                                return n1 * (x -= 2.625 / d1) * x + 0.984375;
                                            }
                                            }
                                        )
                                        .setUpdateFunction((angulo) => {
                                            const posicao = new THREE.Vector3(3*Math.sin(angulo), 3*Math.cos(angulo), 0)
                                            pontoDoCirculo.position = posicao;
                                            pontoDoCirculo.update(); //Refatorar circulo, update deve ser apenas update
                                            pontoDoCirculo.updateObservers();
                                        })
        
        const demonstrarRaio = new AnimacaoSequencial(
                                    new AnimacaoSimultanea(criarPonto, new MostrarTracejado(tracejado, this.scene)),
                                    desenharAngulo,
                                    moverPonto(new THREE.Vector3(3,0,0)).setOnStart(() => tracejado.addToScene(this.scene))
                                )

        this.mostrarAngulo = mostrarAngulo;

        return new AnimacaoSimultanea(dialogue, demonstrarRaio)
    }

    seventhDialogue(dialogue){

        const getPoint = angulo => new THREE.Vector3(3.1*Math.sin(angulo), 3.1*Math.cos(angulo), 0);

        const tracejados = new Array(360)
                                    .fill(0)
                                    .map((e,index) => index*Math.PI/180)
                                    .map(angulo => new Tracejado(getPoint(angulo).multiplyScalar(0.95), getPoint(angulo),0.01))
        
        tracejados.map(tracejado => tracejado.material = new THREE.MeshBasicMaterial({color:0x000000}))

        const scene = this.scene;

        //Adiciona um por um os retângulos dos graus
        const sequencial = new Animacao(tracejados)
                           .setValorInicial(0)
                           .setValorFinal(360)
                           .setDuration(360)
                           .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                           .setUpdateFunction(function(index){
                                const inicio = (this.counter)? this.counter : 0;

                                console.log(this.counter,inicio)

                                for(let i = inicio; i < index; i++){

                                    const tracejado = this.objeto[i];
                                    tracejado.addToScene(scene);
                                    tracejado.update();
                                }

                                this.counter = Math.ceil(index);
                           })

        //Transformar isso em apenas uma animação, usar um array de tracejados que dá pop
        //Deletar os angulos maiores que 120
        //Juntar os tracejados em um contador que vira depois 120 graus

        const descolorir = tracejados.map(tracejado => colorirAngulo(tracejado)
                                                                    .setValorInicial(0x000000)
                                                                    .setValorFinal(0xffffff)
                                                                    .setDuration(50)
                                                                    .setOnStart(() => tracejado.scene = this.scene)
                                                                    .setCurva(x => 1 - Math.sqrt(1 - Math.pow(x, 2)))
                                                                    .setOnTermino(() => this.scene.remove(tracejado.mesh))
        );

        const simultanea = new AnimacaoSimultanea();

        simultanea.setDuration(50);

        simultanea.setOnStart(() => {
            const graus          = Math.round(this.angle.degrees);
            simultanea.animacoes = descolorir.slice(graus, 360)
            this.tracejados      = tracejados.slice(0, graus + 1);
        })

        return new AnimacaoSimultanea(dialogue, new AnimacaoSequencial(sequencial,simultanea));
    }

    eigthDialogue(dialogue){

        const mostrarAngulo = this.mostrarAngulo;

        const textHtml = mostrarAngulo.text.elemento.element;

        mostrarAngulo.increment = (() => {let a = 0; return () => {textHtml.textContent = `${Math.round(this.angle.degrees)}° = ${a++} segmentos`}})()

        const simultanea = new AnimacaoSimultanea();

        //Vai esperar a animação ser executada antes de pegar os tracejados
        simultanea.setOnStart(() => {
            const animacoes = this.tracejados.map((tracejado, index) => this.moverTracejado(tracejado,index));

            animacoes.map(tracejado => tracejado.setOnTermino(function(){
                                            mostrarAngulo.increment();
                                            mostrarAngulo.text.elemento.position.x = 1.8
                                        })
                        )

            simultanea.animacoes = animacoes;
        })

        simultanea.frames = 240;

        return new AnimacaoSimultanea(dialogue, simultanea);
    }

    ninthDialogue(dialogue){


        const light = new THREE.AmbientLight(0xffffff,1);

        this.scene.add(light);

        this.draggable = new Draggable(this.ponto2, this.camera);

        //Atualiza a posição do ponto no arraste para ficar restrita ao círculo
        this.draggable.addObserver(new FixarAoCirculo(this.circulo, this.ponto2))

        //Atualiza todos os objetos dependentes da posição do ponto
        this.draggable.addObserver({
            update: this.ponto2.updateObservers
        })

        this.hoverable = new Hoverable(this.ponto2,this.camera);

        const colorirPonto = new ColorirOnHover(this.ponto2,0xaa0000,0xffff33).setCanvas(this);
        const colorirTracejado = new ColorirOnHover(this.ponto2.tracejado, 0xaa0000, 0xffff33).setCanvas(this);

        this.hoverable.addObserver(colorirPonto)
        this.hoverable.addObserver(colorirTracejado)
        this.draggable.addObserver(colorirPonto)
        this.draggable.addObserver(colorirTracejado)


        dialogue.setOnTermino(() =>{

            this.mostrarAngulo.update({dentro:true})

            var loader = new GLTFLoader();
            loader.load(
                RelogioGLB,
                ( gltf ) =>  {
                    console.log(gltf.scene.children[0])
                    console.log(gltf);
                    const relogio = gltf.scene.children[0];
                    relogio.scale.set(7,7,1)
                    relogio.position.z = -0.5
                    this.scene.add(gltf.scene);
                },
          );
        })

        return dialogue;
    }

    moverTracejado(tracejado, filler){


        const translation = new THREE.Vector3();

        tracejado.mesh.children[0].getWorldPosition(translation);

        const posicaoFinal = new THREE.Vector3(1.5,0.5,0).add(translation.negate())

        return new Animacao(tracejado.mesh)
               .setValorInicial(new THREE.Vector3(0,0,0))
               .setValorFinal(posicaoFinal)
               .setDuration(100)
               .setInterpolacao((inicial,final,peso) => new THREE.Vector3().lerpVectors(inicial,final,peso))
               .setUpdateFunction(function(posicao){

                    tracejado.mesh.position.copy(posicao);
               })
               .voltarAoInicio(false)
               .setOnTermino(() => this.scene.remove(tracejado.mesh))
               .filler(filler)
    }

    circuloCrescendoAnimacao(circulo){

        return new Animacao(circulo)
                .setValorInicial(0.001)
                .setValorFinal(0.1)
                .setDuration(140)
                .setInterpolacao((inicial,final,peso) => inicial*(1 - peso) + final*peso)
                .setCurva((x) => {
                    const c5 = (2 * Math.PI) / 4.5;
                    
                    return x === 0
                        ? 0
                        : x === 1
                        ? 1
                        : x < 0.5
                        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
                    })
                .setUpdateFunction((valor) => {
                    circulo.raio = valor;
                    circulo.update();
                })
                .setOnStart(() => circulo.addToScene(this.scene))
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
        // this.atualizarOptions();

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        // if(options.atualizar) triangle.update();

        const problema = this.problemas[this.progresso];

        if(!problema) return console.log("Finalizado");

        if(problema.satisfeito(this)){
            problema.consequencia(this);
            this.progresso++;
        }
    }

    //Adicionar equação 4 horas = 120 graus, onde graus e horas são variáveis
    //Adicionar possibilidade de resolver equação por meios algébricos
    //Adicionar menu de perguntas
    problemas = {

        0: {
            satisfeito(fase){

                console.log(fase.angle.degrees)

                return Math.round(30 - fase.angle.degrees) == 0;
            },

            consequencia(fase){

                const dialogo1 = `Uma hora tem 30°, como acabou de demonstrar`

                const animacao1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo1))

                const dialogo2 = `Agora, consegue mostrar quanto vale 5 horas?`

                const animacao2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo2))

                fase.animar(new AnimacaoSequencial(animacao1,animacao2))
            }
        },

        1: {
            satisfeito(fase){

                console.log(fase.angle.degrees)

                return Math.round(150 - fase.angle.degrees) == 0;
            },

            consequencia(fase){

                const dialogo1 = `5 horas tem 150°, como acabou de demonstrar`

                const animacao1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo1))

                const dialogo2 = `Mas será que é preciso medir os graus toda vez?`

                const animacao2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo2))

                const dialogo3 = "Veja, você sabe que uma hora tem 30°"

                const animacao3 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo3));

                const mostrarHora = fase.mostrarHora();

                fase.animar(new AnimacaoSequencial(animacao1,animacao2, new AnimacaoSimultanea(mostrarHora)))
            }
        }
    }

    //Animações dos problemas

    mostrarHora(){

        const moverPonteiro =  new Animacao(this.ponto2)
                                .setValorInicial(Math.PI*150/180)
                                .setValorFinal(Math.PI*1/6)
                                .setInterpolacao((inicial, final, peso) => inicial*(1-peso) + final*peso)
                                .setDuration(200)
                                .voltarAoInicio(false)
                                .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                .setUpdateFunction((angulo) => {
                                    const posicao = new THREE.Vector3(3*Math.sin(angulo), 3*Math.cos(angulo), 0)
                                    this.ponto2.position = posicao;
                                    this.ponto2.update(); //Refatorar circulo, update deve ser apenas update
                                    this.ponto2.updateObservers();
                                });

        const equacao = new Equality(
                                new VariableMultiplication(new Value(1), new Variable(" horas")),
                                new VariableMultiplication(new Value(30), new Variable("°"))
                            );

        const placeholder = this.createEquationBox("1 hora = ", new THREE.Vector3(4,2,0));

        const PlaceholderAparecendo = new TextoAparecendo(placeholder.element);

        this.scene.add(placeholder);

        console.log(placeholder)

        //Forma algébrica, desenvolver animações para lidar com isso (criar carta e mover)
        //Adicionar carta (círculo tem 360°)
        //Adicionar carta (relógio tem 12 horas)
        //Adicionar carta (relógio é um círculo)
        //Resolução: 12 horas tem 360°
        //Então 6 horas tem 180°
        //e 1 hora tem 30°
        //Shortcut,adicionar bônus se resolver por essa maneira

        const anguloText = this.mostrarAngulo.text.elemento

        const moverAngulo = new Animacao(anguloText)
                                .setValorInicial(anguloText.position.clone())
                                .setValorFinal(new THREE.Vector3(5,2,0))
                                .setDuration(200)
                                .voltarAoInicio(false)
                                .setInterpolacao((inicial,final,peso) => new THREE.Vector3().lerpVectors(inicial,final,peso))
                                .setUpdateFunction(value => {
                                    anguloText.position.copy(value);
                                })
        //Animação desativar mostrarÂngulo, mover texto do ângulo
        //Criar texto 1 hora = {Angulo}

        return new AnimacaoSequencial(
                    moverPonteiro, 
                    new AnimacaoSimultanea(
                        PlaceholderAparecendo, 
                        moverAngulo
                    )
                );
    }
}
