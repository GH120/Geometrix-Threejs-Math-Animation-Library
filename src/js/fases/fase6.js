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
import { mover } from '../animacoes/mover';
import { Edge } from '../objetos/edge';
import { Objeto } from '../objetos/objeto';
import { HoverPosition } from '../inputs/position';

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


        this.poligono.inserirVertice(3, [1,3,0])


        this.trigonometria = [];

        this.createInputs();
        this.createOutputs();
        this.setupTextBox();

        this.informacao = {}

        this.levelDesign();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        
        const dialogo = ["Polígonos são figuras geométricas muito conhecidas",
                         "Triângulos, quadrados, pentagonos...",
                         "Todos eles tem em comum terem pontos, os vertices",
                         "ligados por arestas, linhas",
                         "Um poligono regular é aquele onde seus lados são iguais",
                         "Veja, o lado é igual a todos os outros",
    ]

        const anim1 = this.firstAnim(dialogo);

        this.animar(new AnimacaoSequencial(anim1));

    }

    // primeiros dialogos
    firstAnim(textos) {

        const animacoesTextos = [];

        const efeitos = {
            0: () => this.animCreateVertices(this.poligono),

            1: this.animCriarPoligonos,
            
            2: this.animColorirVertices,
            
            3: this.animColorirArestas,

            4: this.animCriarPentagono,

            5: this.animMostrarIgualdadeLado
        };

        textos.forEach((texto, index) => {

            const efeito = efeitos[index];

            const dialogo = new TextoAparecendo(this.text.element)
                            .setOnStart(
                                () => {
                                    this.changeText(texto);
                                })
                            .setDelay(100);

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
        const vertices     = this.poligono.vertices;

        //Adiciona o clickable ao vertice, agora todo vertice tem vertice.clicable
        vertices.forEach((vertice) => new Clickable(vertice, this.camera));
        vertices.forEach((vertice) => new Hoverable(vertice, this.camera));
        
        const plano        = Objeto.fromMesh(new THREE.Mesh(
            new THREE.PlaneGeometry(100,100),
            new THREE.MeshBasicMaterial({color:0xffffff})
        ))
        
        this.plano = plano;

        new HoverPosition(plano, this.camera);
    }

    createOutputs(){

        const vertices   = this.poligono.vertices;

        const tracejados = vertices.map(v => new Tracejado().addToScene(this.scene))

        //Outputs
        this.outputSelecionarVertice    =  vertices.map(vertex => this.selecionarVertice(vertex))
        this.outputAdicionarVertice     =  vertices.map(vertex => this.adicionarVertice(vertex))
        this.outputHighlightArestas     =  vertices.map((vertex,index)  => this.highlightArestas(vertex, index))
        this.outputDesenharTracejado    =  vertices.map((vertex, index) => this.desenharTracejado(vertex, tracejados[index]))
    }

    resetarInputs(){

        const vertices = this.poligono.vertices;

        vertices.map(vertice => vertice.clickable.removeObservers());
        vertices.map(vertice => vertice.hoverable.removeObservers());

        this.plano.hoverposition.removeObservers();

    }

    //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
    Configuracao1(){

        this.resetarInputs();

        var index = 0;
        for(const vertice of this.poligono.vertices){
            const criarTriangulo = this.outputSelecionarVertice[index];

            vertice.clickable.addObserver(criarTriangulo);

            index++;
        }
    }

    Configuracao2(informacao){

        this.resetarInputs();

        // Adicionar tracejados?

        this.informacao = {...this.informacao, ...informacao};

        const selecionados = this.informacao.VerticesSelecionados;

        var index = 0;
        for(const vertice of this.poligono.vertices){
            
            if(vertice in selecionados) continue;

            const adicionarVertice = this.outputAdicionarVertice[index];
            const highlightAresta  = this.outputHighlightArestas[index];

            vertice.clickable.addObserver(adicionarVertice);
            vertice.hoverable.addObserver(highlightAresta);
            vertice.clickable.addObserver(highlightAresta);

            index++;
        }

        this.Configuracao2b({})
    }

    //Ativa o desenhar tracejado dos vertices selecionados
    Configuracao2b(informacao){

        this.plano.hoverposition.removeObservers();


        this.informacao = {...this.informacao, ...informacao};

        const selecionados = this.informacao.VerticesSelecionados;


        var index = 0;
        for(const vertice of this.poligono.vertices){

            const desenharTracejado = this.outputDesenharTracejado[index];

            if(selecionados.includes(vertice)){

                this.plano.hoverposition.addObserver(desenharTracejado);

            }

            index++;
        }
    }

    Configuracao3(novaInformacao){

        this.resetarInputs();

        this.informacao     = {...this.informacao, ...novaInformacao};

        const informacao    = this.informacao;

        if(!informacao.triangulosAtivos) 
            informacao.triangulosAtivos = [];
        if(!informacao.verticesUsados)
            informacao.verticesUsados   = [];
        
        const novoTriangulo = informacao.trianguloDesenhado;

        informacao.triangulosAtivos.push(novoTriangulo);

        console.log(informacao)

        var index = 0;
        for(const vertice of this.poligono.vertices){
            const criarTriangulo = this.outputSelecionarVertice[index];

            vertice.clickable.addObserver(criarTriangulo);

            index++;
        }
    }

    //Outputs
    selecionarVertice(vertice){

        const fase = this;
        
        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;

                    if(estado.clicado){

                        fase.Configuracao2({
                            VerticesSelecionados: [vertice, ]
                        });

                         vertice.mesh.material = new THREE.MeshBasicMaterial({color:0xaa00aa})

                    }
               })
    }

    adicionarVertice(vertice){

        const fase = this;

        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;

                    const selecionados = fase.informacao.VerticesSelecionados;
                
                    //Adiciona vértice ao triangulo a ser formado
                    if(estado.clicado){

                        vertice.mesh.material = new THREE.MeshBasicMaterial({color:0xff0000})

                        fase.Configuracao2b({
                            VerticesSelecionados: [...selecionados, vertice]
                        })
                    }

                    //Três vértices selecionados, então triangulo está pronto para ser desenhado
                    if(selecionados.length >= 3){

                        const triangulo = desenharTriangulo();

                        fase.Configuracao3({
                            trianguloDesenhado: triangulo
                        });

                    }
               })

        function desenharTriangulo(){

            const vertices  = fase.informacao.VerticesSelecionados;

            const posicoes  = vertices.map(vertice => vertice.getPosition())

            //Calcula a cor a ser usada na malha

            const inteiroAleatorio = (fator) => Math.round(Math.random() * fator);

            const corAleatoria     = () => [0xff0000,0x00ff00,0x0000ff]
                                           .map(cor => inteiroAleatorio(cor))
                                           .reduce((a,b) => a + b);

            //Verifica se está no sentido anti-horário
            const v1 = new THREE.Vector3().copy(posicoes[1]).sub(posicoes[0]);
            const v2 = new THREE.Vector3().copy(posicoes[2]).sub(posicoes[0]);
            const crossProduct = v1.cross(v2);

            if(crossProduct.z < 0){
                const temporario = posicoes[1];
                posicoes[1] = posicoes[0];
                posicoes[0] = temporario
            }

            //Constrói a malha
            const geometry = new THREE.BufferGeometry().setFromPoints(posicoes);
            const material = new THREE.MeshBasicMaterial({ color: corAleatoria() });  

            const trianguloTransparente = new THREE.Mesh(geometry, material);
            
            fase.scene.add(trianguloTransparente);

            const animarAparecendo = apagarObjeto(Objeto.fromMesh(trianguloTransparente))
                                    .reverse()
                                    .setDuration(2000)
                                    .setValorFinal(0.5)

            fase.animar(animarAparecendo)

            return trianguloTransparente;
        }
    }

    removerVertice(vertice){
        
    }

    desenharTracejado(vertice, tracejado){

        //Input hover do plano, diz a posição do mouse

        const fase = this;

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    this.estado = {...this.estado, novoEstado};

                    const estado = novoEstado;

                    //Pega tracejado e desenha ele do vértice até a posição do mouse
                    //Desenha um tracejado desse vértice até o ponto

                    tracejado.origem  = vertice.getPosition();

                    tracejado.destino = estado.position;

                    tracejado.update();
               })
    }

    highlightArestas(vertex){

        //Inputs hover dos vértices para ativar a aresta
        //       click dos vértices para fixar sua cor

        const fase = this;

        var aresta;
        var materialAntigoAresta;
        var materialAntigoVertex;

        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    this.estado = {...this.estado, ...estadoNovo};

                    const estado = this.estado;

                    if(estado.finalizado) return;

                    if(!aresta) encontrarAresta();

                    if(estado.dentro){

                        estado.valido = true;

                        mudarCor();
                    }

                    if(estado.valido && estado.clicado){

                        estado.finalizado = true;

                        aresta = null;
                    }

                    if(estado.valido && !estado.dentro){

                        estado.valido = false;
                        
                        voltarCorInicial();
                    }
               })

        //Funções auxiliares
        function mudarCor(){

            materialAntigoVertex  = vertex.material.clone();

            vertex.material = new THREE.MeshBasicMaterial({color:0xcc0000});

            vertex.update();

            if(!aresta) return;

            materialAntigoAresta  = aresta.material.clone();

            aresta.material = new THREE.MeshBasicMaterial({color:0xaa2233});

            aresta.update();
        }

        function voltarCorInicial(){

            vertex.material = materialAntigoVertex;

            vertex.update();

            if(!aresta) return;
            
            aresta.material = materialAntigoAresta;

            aresta.update();

            console.log(aresta)
        }

        function encontrarAresta(){

            const vertex2 = fase.informacao.VerticesSelecionados.slice(-1)[0];

            const arestasValidas = fase.poligono.edges.map(edge => (edge.origem.equals(vertex2.getPosition()) && 
                                                            edge.destino.equals(vertex.getPosition())) ||
                                                            (edge.origem.equals(vertex.getPosition())  &&
                                                            edge.destino.equals(vertex2.getPosition()))
                                                            )

            const indices = arestasValidas.map((valida, index) => (valida)? index : -1).filter(valor => valor != -1);

            console.log(arestasValidas, indices)

            aresta = (indices.length)? fase.poligono.edges[indices[0]] : null;
        }
    }

    animCreateVertices(poligono){
        // .addToScene(this.scene);

        const verticesAnim = poligono.vertices.map((vertice,index) => apagarObjeto(vertice).reverse().setDuration(50 + 50*index));

        const arestasAnim  = poligono.edges.map((edge, index) => apagarObjeto(edge)
                                                                     .reverse()
                                                                     .setProgresso(0)
                                                                     .setDuration(30)
                                                                     .filler(40*-(Math.cos(Math.PI * index/4) - 1) / 2)
                                                                     .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                                     )

        const mostrarVertices = new AnimacaoSimultanea()
                                .setAnimacoes(verticesAnim)
                                .setOnStart(() => poligono.vertices.map(vertice => vertice.addToScene(this.scene)));

        const mostrarArestas  = new AnimacaoSimultanea()
                                .setAnimacoes(arestasAnim)
                                .setOnStart(() => poligono.edges.map(edge => edge.addToScene(this.scene)));
        
        const animacaoConjunta = new AnimacaoSequencial(mostrarVertices, mostrarArestas);

        return animacaoConjunta.setOnTermino(() => {
            this.poligono.addToScene(this.scene);

            this.poligono.angles.map(angle => angle.removeFromScene())
        });
        
    }

    animCriarPoligonos(){

        const triangulo = new Poligono([[-4,0,0],[-2,0,0],[-2,2,0]]).render()

        const quadrado  = new Poligono([[-3,-3,0],[-3,-1.5,0],[-1.5,-1.5,0], [-1.5, -3, 0]]).render();

        this.poligonos = [triangulo, quadrado];

        return new AnimacaoSimultanea(
            this.animCreateVertices(triangulo),
            this.animCreateVertices(quadrado)
        )

    }

    animColorirVertices(){

        const colorirVertice = (vertice) => colorirAngulo(vertice)
                                            .setValorInicial(0x8c8c8c)
                                            .setValorFinal(0xff0000)
                                            .setDuration(30)
                                            .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                            .voltarAoInicio(false)


        const vertices  = this.poligono.vertices.concat(this.poligonos[0].vertices).concat(this.poligonos[1].vertices);
        
        const animacoes = vertices.map(vertice => new AnimacaoSequencial(colorirVertice(vertice).setDelay(140), colorirVertice(vertice).reverse()))

        return new AnimacaoSimultanea().setAnimacoes(animacoes);

    }

    animColorirArestas(){

        const colorirAresta = (aresta) => colorirAngulo(aresta)
                                            .setValorInicial(0xe525252)
                                            .setDuration(30)
                                            .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                            .voltarAoInicio(false)

        const arestas  = this.poligono.edges.concat(this.poligonos[0].edges).concat(this.poligonos[1].edges);
        
        const animacoes = arestas.map(edge => new AnimacaoSequencial(colorirAresta(edge).setDelay(100), colorirAresta(edge).reverse()))

        const simultanea = new AnimacaoSimultanea().setAnimacoes(animacoes);

        return simultanea;

    }

    animCriarPentagono(){

        const objetos = this.poligonos.flatMap(poligono => poligono.edges.concat(poligono.vertices));

        const apagarExemplos = new AnimacaoSimultanea().setAnimacoes(objetos.map(objeto => apagarObjeto(objeto)));

        const sin = (inteiro) => 1.3*Math.sin(Math.PI*inteiro/5);
        const cos = (inteiro) => 1.3*Math.cos(Math.PI*inteiro/5);

        let novasPosicoes = [
            [sin(2),  cos(2),  0],
            [sin(4),  cos(4),  0],
            [sin(6),  cos(6),  0],
            [sin(8),  cos(8),  0],
            [sin(10), cos(10), 0]
        ];

        novasPosicoes = novasPosicoes.map(posicao => new THREE.Vector3(...posicao));

        const movimentos = this.poligono.vertices.map((vertice, index) => mover(vertice, vertice.getPosition(), novasPosicoes[index])
                                                                         .voltarAoInicio(false)
                                                                        //  .filler(50*-(Math.cos(Math.PI * index) - 1) / 2)
                                                    )


        const atualizarPoligono = new Animacao(this.poligono)
                                 .setInterpolacao(() => null)
                                 .setUpdateFunction(() => {
                                    this.poligono.edges.map(edge => edge.removeFromScene())
                                    this.poligono.renderEdges();
                                    this.poligono.edges.map(edge => edge.addToScene(this.scene))

                                 })
                                 .setDuration(500)

        const moverVertices = new AnimacaoSimultanea().setAnimacoes(movimentos);
        
        return new AnimacaoSimultanea(apagarExemplos, moverVertices, atualizarPoligono).setOnTermino(() => this.animMostrarIgualdadeLado());

    }

    animMostrarIgualdadeLado(){

        const fase = this;

        const vertice1  = this.poligono.vertices[0];
        const vertice2  = this.poligono.vertices[1];
        const vertice3  = this.poligono.vertices[2];
        const vertice4  = this.poligono.vertices[3];
        const vertice5  = this.poligono.vertices[4];
 
        const lado = new Edge(vertice1.getPosition(),vertice2.getPosition());

        lado.grossura = 0.06

        const colorir = colorirAngulo(lado)
                        .setValorInicial(0x525252)
                        .setValorInicial(0xff0000)
                        .voltarAoInicio(false)
                        .setOnStart(() => {
                            lado.addToScene(this.scene);
                            lado.origem  = vertice1.getPosition();
                            lado.destino = vertice2.getPosition();
                            lado.update();
                        })



        return new AnimacaoSequencial(
            colorir,
            this.animGirarLado(lado, vertice1, vertice2, vertice3, vertice2),
            this.animGirarLado(lado, vertice2, vertice3, vertice4, vertice3),
            this.animGirarLado(lado, vertice3, vertice4, vertice5, vertice4),
            this.animGirarLado(lado, vertice4, vertice5, vertice1, vertice5).setDelay(100),
        )
        .setOnTermino(() => {
            lado.removeFromScene();
            fase.Configuracao1(); //Inicializa a configuração 1 dos controles
        })
    }

    animGirarLado(lado, origem, destino, origem2, pivot){

        var vectorA;
        var vectorB;
        var vectorC;

        var length;

        const scene = this.scene;

        const pivoNaOrigem = lado.origem.equals(pivot.getPosition())

        return new Animacao(lado)
               .setInterpolacao((inicio,final,peso) => new THREE.Vector3().lerpVectors(inicio,final, peso).normalize())
               .setUpdateFunction(function(interpolado){

                    const posicao = pivot.getPosition().add(interpolado.clone().multiplyScalar(length))

                    if(pivoNaOrigem){

                        lado.destino = posicao
                    }
                    else{
                        lado.origem  = posicao
                    }

                    lado.update();

               })
               .setOnStart(function(){


                    lado.origem  = origem.getPosition();
                    lado.destino = destino.getPosition();
                    lado.update();

                    // Define vectors A, B, and C
                    vectorA = pivot.getPosition();  // Replace with your values
                    vectorB = origem.getPosition();  // Replace with your values
                    vectorC = origem2.getPosition();  // Replace with your values
                    
                    
                    // Calculate normalized vectors from A to B and A to C
                    vectorB.subVectors(vectorB, vectorA);
                    vectorC.subVectors(vectorC, vectorA);

                    length = vectorB.length();

                    this.setValorInicial(vectorB.clone().normalize());
                    this.setValorFinal(vectorC.clone().normalize())
                })
               .setDuration(100)
               .setDelay(25)
               .voltarAoInicio(false);

    }

    animar(animacao){

        animacao.animationFrames = animacao.getFrames();

        this.frames.push(animacao.animationFrames);

        this.animacoes.push(animacao);

        return this;
    }

    update(){

        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
        this.frames.map(frame => frame.next()); //Roda as animações do programa
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