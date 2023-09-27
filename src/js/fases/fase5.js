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
import { Tracejado } from '../objetos/tracejado';
import MostrarTracejado from '../animacoes/mostrarTracejado';
import { Divisao } from '../animacoes/divisao';
import { Triangle } from '../objetos/triangle';

export class Fase5 {

    constructor(triangle, scene, camera){
        this.triangulo = triangle;
        this.scene  = scene;
        this.camera = camera;
        this.frames = [];
        this.animacoes = [];
        this.trigonometria = [];

        this.createHandlers();
        this.createControlers();
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

    createControlers(){
        const clickableVertice = this.triangulo.vertices.map((vertice) => new Clickable({mesh:vertice, hitbox: vertice}, this.camera))
        for (let i = 0; i < 3; ++i) {
            clickableVertice[i].addObserver(this.handlerClickVertice[i])
        }

        const angleDragglable = this.triangulo.angles.map((angle) => new Draggable(angle, this.camera))
        for (let i = 0; i < 3; ++i) {
            angleDragglable[i].addObserver(this.handlerDragAngle[i])
        }
    }

    createHandlers(){
        this.handlerClickVertice = this.triangulo.vertices.map(vertex => this.criarTracejado(vertex))
        this.handlerDragAngle = this.triangulo.angles.map(angle => this.criarMovimentacaoDeAngulo(angle))
    }

    criarMovimentacaoDeAngulo = (angle) => {


        return {
            update: (estado) => {
                let posicao = estado.position;
                const posAngulo = new THREE.Vector3(angle.position[0], angle.position[1], angle.position[2])

                angle.mesh.position.copy(posicao.sub(posAngulo));
                // angle.mesh.moveTo(posicao)

                if (!estado.dragging) {
                    angle.mesh.position.copy(new THREE.Vector3(0, 0, 0));
                }
            }
        }
    }

    criarTracejado = (vertex) => {

        // pegar outros dois vertices:
        const outros_dois = this.triangulo.vertices.filter((vertice) => vertice != vertex);

        let ativado = false;
        let tracejado = null;
        let desenharTracejado = null;

        return {
            update: (estado) => {
                if (estado.clicado && !ativado){
                    
                    ativado = !ativado

                    const posicao = vertex.position.clone();
                    const vetorTracejado = outros_dois[0].position.clone().sub(outros_dois[1].position.clone());
                    
                    tracejado = new Tracejado(posicao.clone().sub(vetorTracejado), posicao.clone().add(vetorTracejado))
                    tracejado.addToScene(this.scene);
                    
                    // animação
                    desenharTracejado = new Animacao(tracejado)
                        .setValorInicial(0)
                        .setValorFinal(2)
                        .setDuration(200)
                        .setInterpolacao((inicial, final, peso) => inicial * (1 - peso) + final*peso)
                        .setUpdateFunction((progresso) => {
                            tracejado.origem = posicao.clone().sub(vetorTracejado.clone().multiplyScalar(progresso))
                            tracejado.destino = posicao.clone().add(vetorTracejado.clone().multiplyScalar(progresso))
                            tracejado.update();
                        })
                        .setCurva((x) => 1 - (1 - x) * (1 - x))
                        .voltarAoInicio(false);
                    
                    this.animar(desenharTracejado);
                    

                } else if (estado.clicado) {
                    
                    ativado = !ativado
                    
                    desenharTracejado.stop = true;
                    tracejado.removeFromScene(this.scene)
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