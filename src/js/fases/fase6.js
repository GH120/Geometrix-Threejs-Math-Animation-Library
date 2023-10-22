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
import { Output } from '../outputs/Output';
import Circle from '../objetos/circle';
import DesenharMalha from '../animacoes/desenharMalha';
import { Poligono } from '../objetos/poligono';
import { apagarObjeto } from '../animacoes/apagarObjeto';

export class Fase6 extends Fase{

    constructor(){

        super();

        this.poligono = new Poligono([
            [0,0,0],
            [2,0,0],
            [2,2,0],
            [0,2,0]
        ])
        .render()
        // .addToScene(this.scene);


        this.trigonometria = [];

        this.createInputs();
        this.createOutputs();
        this.setupTextBox();
        this.Configuracao1(); //É uma versão generalizada do ligar Input ao Output

        this.informacao = {}

        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        
        const dialogo = ["Polígonos são figuras geométricas muito conhecidas",
                         "Triângulos, quadrados, pentagonos...",
                         "Todos eles tem em comum terem pontos, os vertices",
                         "ligados por arestas, linhas",
    ]

        const anim1 = this.firstAnim(dialogo);

        this.animar(new AnimacaoSequencial(anim1));

    }

    // primeiros dialogos
    firstAnim(textos) {

        const animacoesTextos = [];

        const efeitos = {
            0: this.animCreateVertices,
            2: this.animColorirVertices
        };

        textos.forEach((texto, index) => {

            const efeito = efeitos[index];

            const dialogo = new TextoAparecendo(this.text.element)
                            .setOnStart(
                                () => {
                                    this.changeText(texto);
                                })
                            .setDelay(20);

            const dialogoMaisEfeito = (efeito)? new AnimacaoSimultanea(dialogo, efeito.bind(this)()) : dialogo

            animacoesTextos.push(dialogoMaisEfeito)
        })
        
        //Bug de threads consertado, usar setAnimações toda vez que lidar com listas de animações
        //Do tipo [anim1,anim2,anim3,anim4...]
        const sequencial = new AnimacaoSequencial().setAnimacoes(animacoesTextos);
        
        return sequencial;
            
    }

    createInputs(){
        //Inputs
        const vertices = this.poligono.vertices;
        const angles   = this.poligono.angles;

        //Adiciona o clickable ao vertice, agora todo vertice tem vertice.clicable
        vertices.forEach((vertice) => new Clickable(vertice, this.camera));
        vertices.forEach((vertice) => new Draggable(vertice, this.camera));

        //Adiciona o draggable ao angulo, agora todo angulo tem angulo.draggable
        angles.map((angle) => new Draggable(angle, this.camera));

    }

    createOutputs(){
        //Outputs
        // this.outputClickVertice   = this.poligono.vertices.map(vertex =>   this.criarTracejado(vertex))
        // this.outputDragAngle      = this.poligono.angles.map(  angle =>    this.criarMovimentacaoDeAngulo(angle))
        // this.outputEscolheuErrado = this.poligono.angles.map(  angle =>    this.outputAnguloErrado(angle))
        // this.outputMoverVertice   = this.poligono.vertices.map(vertice => new MoverVertice(vertice));

    }

    resetarInputs(){

        const vertices = this.poligono.vertices;
        const angles   = this.poligono.angles;

        vertices.map(vertice => vertice.draggable.removeObservers());
        vertices.map(vertice => vertice.clickable.removeObservers());
        angles.map(  angle => angle.draggable.removeObservers());

    }

    //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
    Configuracao1(){

        
    }

    animCreateVertices(){
        // .addToScene(this.scene);

        this.poligono.inserirVertice(3, [1,3,0])

        const verticesAnim = this.poligono.vertices.map((vertice,index) => apagarObjeto(vertice).reverse().setDuration(50 + 50*index));

        const arestasAnim  = this.poligono.edges.map((edge, index) => apagarObjeto(edge)
                                                                     .reverse()
                                                                     .setProgresso(0)
                                                                     .setDuration(30)
                                                                     .filler(40*-(Math.cos(Math.PI * index/4) - 1) / 2)
                                                                     .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                                     )

        const mostrarVertices = new AnimacaoSimultanea()
                                .setAnimacoes(verticesAnim)
                                .setOnStart(() => this.poligono.vertices.map(vertice => vertice.addToScene(this.scene)));

        const mostrarArestas  = new AnimacaoSimultanea()
                                .setAnimacoes(arestasAnim)
                                .setOnStart(() => this.poligono.edges.map(edge => edge.addToScene(this.scene)));
        
        const animacaoConjunta = new AnimacaoSequencial(mostrarVertices, mostrarArestas);

        return animacaoConjunta;
        
    }

    animColorirVertices(){

        const colorirVertice = (vertice) => colorirAngulo(vertice).setValorInicial(0x8c8c8c)
        
        const animacoes = this.poligono.vertices.map(vertice => new AnimacaoSequencial(colorirVertice(vertice), colorirVertice(vertice).reverse()))

        return new AnimacaoSimultanea().setAnimacoes(animacoes);

    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    update(){

        this.frames.map(frame => frame.next()); //Roda as animações do programa

        if(!this.progresso) this.progresso = "start";

        const problemaAtual = this.problemas[this.progresso];

        if(problemaAtual.satisfeito(this)){

            problemaAtual.consequencia(this);

            this.progresso = problemaAtual.proximo(this);
        }
    }

    problemas = {

        start:{
            satisfeito: (fase) => false,

            consequencia: (fase) =>{

                // // desativa o arraste inicialmente, até clicar no vértice
                // fase.outputDragAngle.map(output => output.removeInputs());

                //Muda texto quando o player clica no primeiro vértice e ativa o arraste
                // fase.clicouPrimeiroVertice  = fase.primeiroClick();   
            },

            proximo: (fase) => "clicouVertice"

        }
    }
}