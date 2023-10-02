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
import { Angle } from '../objetos/angle';

export class Fase5  extends Fase{

    constructor(){

        super();

        this.triangulo = new Triangle([
            [-1,-1,0],
            [1,2.5,0],
            [4,1.6,0]
        ])
                        .render()
                        .addToScene(this.scene);


        this.trigonometria = [];

        this.createHandlers();
        this.createInputs();
        this.setupTextBox();

        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        
        const dialogo = ['Mostraremos como a soma dos ângulos de um triângulo é 180°',
                         'Clique em um dos vértices do triângulo']

        const anim1 = this.firstAnim(dialogo);

        this.animar(new AnimacaoSequencial(anim1));

    }

    // primeiros dialogos
    firstAnim(textos) {

        const animacoesTextos = [];

        textos.forEach((texto) => {
            animacoesTextos.push(
                new TextoAparecendo(this.text.element)
                    .setOnStart(
                        () => {
                            this.changeText(texto);
                        })
                    .setDelay(100)
            )
        })
        
        //Bug de threads consertado, usar setAnimações toda vez que lidar com listas de animações
        //Do tipo [anim1,anim2,anim3,anim4...]
        const sequencial = new AnimacaoSequencial().setAnimacoes(animacoesTextos);
        
        return sequencial;
            
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
        //Inputs
        const clickableVertice = this.triangulo.vertices.map((vertice) => new Clickable(vertice, this.camera))
        for (let i = 0; i < 3; ++i) {
            clickableVertice[i].addObserver(this.handlerClickVertice[i])
        }

        const angleDragglable = this.triangulo.angles.map((angle) => new Draggable(angle, this.camera))
        for (let i = 0; i < 3; ++i) {
            angleDragglable[i].addObserver(this.handlerDragAngle[i])
        }
    }

    createHandlers(){
        //Inputs
        this.handlerClickVertice = this.triangulo.vertices.map(vertex => this.criarTracejado(vertex))
        this.handlerDragAngle = this.triangulo.angles.map(angle => this.criarMovimentacaoDeAngulo(angle))
    }

    criarMovimentacaoDeAngulo = (angle) => {

        let estado = {}

        return {
            update: (estadoNovo) => {

                estado = {...estado, ...estadoNovo}

                if(estado.finalizado) return;

                if(estado.dragging){
                    let posicao = estado.position.clone();
                    const posAngulo = angle.position;

                    if(posicao) angle.mesh.position.copy((posicao.sub(posAngulo)))
                }

                //Se arrastou e está em cima do ângulo invisível, estado é valido
                if(estado.dragging && estado.dentro){
                    estado.valido = true;
                    return;
                }

                //Se o estado for valido e soltar o mouse, então finaliza a execução
                if(estado.valido && !estado.dragging){
                    console.log("finalizado")
                    estado.finalizado = true;

                    const anguloInicial = angle;
                    const anguloFinal = angle.correspondente;

                    const quaternionInicial = anguloInicial.mesh.quaternion.clone(); 
                    const quaternionFinal = new THREE.Quaternion();

                    const vAnguloInicial = anguloInicial.vetor1.clone().add(anguloInicial.vetor2).normalize()
                    const vAnguloFinal = anguloFinal.vetor1.clone().add(anguloFinal.vetor2).normalize()

                    // quaternionInicial.setFromUnitVectors(vAnguloInicial, vAnguloFinal);
                    // quaternionFinal.setFromUnitVectors(vAnguloInicial, vAnguloFinal);
                    quaternionFinal.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);

                    const tempoInterpolacao = 0.5; // Define o tempo de duração da interpolação (ajuste conforme necessário)
                    const quaternionInterpolado = new THREE.Quaternion();
                    quaternionInterpolado.slerp(quaternionInicial, quaternionFinal, tempoInterpolacao);

                    console.log('V1', vAnguloInicial)
                    console.log('V2', vAnguloFinal)

                    console.log('Q1', quaternionInicial)
                    console.log('Q2', quaternionFinal)

                    const position = angle.mesh.position.clone();

                    // animação
                
                    const animacaoRodaeMoveAngulo = new Animacao()
                        .setValorInicial(quaternionInicial)
                        .setValorFinal(quaternionFinal)
                        .setDuration(100)
                        .setInterpolacao(function(inicial, final, peso) {
                            return new THREE.Quaternion().slerpQuaternions(inicial, final, peso)
                        })
                        .setUpdateFunction(function(quaternum) {
                            anguloInicial.mesh.quaternion.copy(quaternum)
                            console.log('UPDATE', quaternum)
                        })
                    
                    this.animar(animacaoRodaeMoveAngulo);
                    

                    return;
                }

                if (!estado.dragging) {
                    angle.mesh.position.copy(new THREE.Vector3(0, 0, 0));
                    
                }

                estado.valido = false;
            }
        }
    }

    criarTracejado = (vertex) => {

        // pegar outros dois vertices:
        const outros_dois = this.triangulo.vertices.filter((vertice) => vertice != vertex);

        let ativado = false;
        let tracejado = null;
        let desenharTracejado = null;

        let triangulo1 = null;
        let triangulo2 = null;

        let angulo1 = null;
        let angulo2 = null;

        return {
            update: (estado) => {
                if (estado.clicado && !ativado){
                    
                    ativado = !ativado

                    const posicao = vertex.mesh.position.clone();
                    const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                    const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());
                    
                    tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1), posicao.clone().add(vetorTracejado1))
                    tracejado.addToScene(this.scene);

                    const vtov1 = outros_dois[0].mesh.position.clone().sub(posicao);
                    const vtov2 = outros_dois[1].mesh.position.clone().sub(posicao);

                    const posVtov1 = vtov1.clone().normalize().add(posicao);
                    const posVtov2 = vtov2.clone().normalize().add(posicao);

                    const posVtracejado1 = vetorTracejado1.clone().normalize().add(posicao);
                    const posVtracejado2 = vetorTracejado2.clone().normalize().add(posicao);

                    triangulo1 = new Triangle();
                    triangulo1.positions = [posicao, posVtov1, posVtracejado1].map((vetor) => vetor.toArray());
                    
                    triangulo2 = new Triangle();
                    triangulo2.positions = [posicao, posVtov2, posVtracejado2].map((vetor) => vetor.toArray());

                    triangulo1.render();
                    triangulo2.render();

                    angulo1 = new Angle(triangulo1.vertices);
                    angulo2 = new Angle(triangulo2.vertices);
                    angulo1.angleRadius = 1;
                    angulo2.angleRadius = 1;

                    angulo1.render();
                    // angulo1.addToScene(this.scene);
                    angulo2.render();
                    // angulo2.addToScene(this.scene)

                    this.hoverInvisivel1 = new Hoverable(angulo1, this.camera)
                    this.hoverInvisivel2 = new Hoverable(angulo2, this.camera)

                    this.handlerDragAngle.forEach((handler,index) => {

                        //Apenas liga se o ângulo for o mesmo
                        const angle = this.triangulo.angles[index];

                        if(angle.igual(angulo1)) {
                            this.hoverInvisivel1.addObserver(handler);
                            angle.correspondente = angulo1;
                        }
                        if(angle.igual(angulo2)) {
                            this.hoverInvisivel2.addObserver(handler);
                            angle.correspondente = angulo2;
                            
                        }
                    })

                    // animação
                    desenharTracejado = new Animacao(tracejado)
                        .setValorInicial(0)
                        .setValorFinal(2)
                        .setDuration(200)
                        .setInterpolacao((inicial, final, peso) => inicial * (1 - peso) + final*peso)
                        .setUpdateFunction((progresso) => {
                            tracejado.origem = posicao.clone().sub(vetorTracejado1.clone().multiplyScalar(progresso))
                            tracejado.destino = posicao.clone().add(vetorTracejado1.clone().multiplyScalar(progresso))
                            tracejado.update();
                        })
                        .setCurva((x) => 1 - (1 - x) * (1 - x))
                        .voltarAoInicio(false);
                    
                    this.animar(desenharTracejado);
                    

                } else if (estado.clicado) {
                    
                    ativado = !ativado
                    
                    desenharTracejado.stop = true;
                    tracejado.removeFromScene(this.scene)
                    angulo1.removeFromScene(this.scene)
                    angulo2.removeFromScene(this.scene)
                }
            }
        }
    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    update(){

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        // if(options.atualizar) triangle.update();

        if (this.triangulo.equilatero()) {
            this.changeText("VITORIA!!!");
            // botar notif
        }
    }
}