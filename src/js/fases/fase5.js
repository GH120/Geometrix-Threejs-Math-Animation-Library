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
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea, animacaoIndependente } from '../animacoes/animation';
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
import Estado from './estado';
import { Poligono } from '../objetos/poligono';
import ColorirOnHover from '../outputs/colorirOnHover';
import InsideElipse from '../outputs/insideElipse';
import { Edge } from '../objetos/edge';
import { ApagarPoligono } from '../animacoes/apagarPoligono';
import { mover } from '../animacoes/mover';
import { engrossarLado } from '../animacoes/engrossarLado';
import { apagarObjeto } from '../animacoes/apagarObjeto';

export class Fase5  extends Fase{

    constructor(){

        super();

        this.setupObjects();
        this.createInputs();
        this.createOutputs();
        this.setupTextBox();
        this.Configuracao1(); //É uma versão generalizada do ligar Input ao Output


        this.debug = true;

        this.aceitaControleDeAnimacao = true;

        this.informacao = {}

    }

    resetObjects(){
        this.objetos.map(objeto => objeto.removeFromScene());

        this.objetos = [];
    }

    setupObjects(){

        this.resetObjects();

        this.triangulo = new Poligono([
            [-1,-1,0],
            [1,2.5,0],
            [4,1.6,0]
        ])
        .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.7})
        .render()
        .addToScene(this.scene);

        this.objetos.push(this.triangulo);
    }

    aula1(){

        const fase = this;
        
        const dialogo = [
            'Na última fase, aprendemos sobre proporcionalidade e ângulos',
            'Nosso objetivo final é chegar na semelhança,',
            'e para isso vamos ver uma propriedade do triângulo fundamental: Seus ângulos somam 180°',
            'Isso vale para qualquer triângulo, como iremos mostrar',
            'Para iniciarmos nossa análise, clique em um vértice qualquer'
        ]

        const animacao = new AnimacaoSequencial().setAnimacoes(dialogo.map(linha => this.animacaoDialogo(linha)))

        animacao.setNome("dialogo");

        animacao.setOnTermino(() => fase.controleFluxo.update({terminadoDialogo: true}))

        this.animar(animacao);

        this.outputMostrarAngulo.map(output => output.update({dentro:true})) //Fazer animação aparecer triângulo?

    }

    aula2(){

        // this.debug = false;

        const fase = this;

        //Dialogo:
        //Desenhamos uma linha paralela a aresta que esse vértice aponta
        //Vera o uso dela a seguir: Dividir esse triângulo em dois
        //Perceba

        const dialogo = ["Desenhamos uma linha paralela a aresta que esse vértice aponta",
                         "Vera o uso dela a seguir: Dividir esse triângulo em dois",
                         "Tente arrastar os vértices não clicados por exemplo"]

        const animacao = new AnimacaoSequencial(
                            fase.animacaoDialogo(dialogo[0]),
                            fase.animacaoDialogo(dialogo[1]),
                            animacaoIndependente( () => fase.animar(this.animacaoDividirTriangulo()))
        )

        fase.animar(animacao);
    }

    aula3(){

        const fase = this;

        //Veja esses subtriângulos, 
        //Temos um ângulo proximo do vértice selecionado, um afastado e um reto. (girar angulos, mostrar nome)
        //se arrastarmos seus lados para fora...
        //Construimos outro triângulo igual a ele, com os ângulos invertidos de lugar (girar angulos respectivos)
        //O ângulo proximo e o afastado somam 90°, pois a figura é um retângulo nos dois lados
        //Assim, os ângulos do triângulo somam 180°

        const dialogo = [
            "Veja esses subtriângulos, ",
            "Temos um ângulo proximo do vértice selecionado,", 
            "um angulo afastado",
            "e um angulo reto",
            "se arrastarmos seus lados para fora...",
            "Construimos outro triângulo igual a ele, com os ângulos invertidos de lugar",
            "O angulo proximo do novo triângulo é o afastado do antigo pois apontam para lados iguais",
            "Os dois juntos formam 90°, pois a reta que divide o triângulo é perpendicular ao tracejado",
            "Podemos fazer o mesmo para o outro subtriângulo",
            "Assim, temos que os ângulos somados formam 180°"
        ]
        .map(linha => fase.animacaoDialogo(linha));

        const animacao = new AnimacaoSequencial(
                            new AnimacaoSimultanea(dialogo[0]),
                            this.aula3Dialogo2(dialogo.slice(1,4), this.subtriangulo1),
                            this.aula3Dialogo3(dialogo[4], this.subtriangulo1),
                            new AnimacaoSimultanea(dialogo[5]),
                            this.aula3Dialogo5(dialogo[6], this.subtriangulo1, this.subtriangulo3),
                            this.aula3Dialogo7(dialogo[7], this.subtriangulo1, this.subtriangulo3),
                            dialogo[8],
                            this.aula3Dialogo2(dialogo.slice(1,4), this.subtriangulo2),
                            this.aula3Dialogo3(dialogo[4], this.subtriangulo2),
                            new AnimacaoSimultanea(dialogo[5]),
                            this.aula3Dialogo5(dialogo[6], this.subtriangulo2, this.subtriangulo3),
                            this.aula3Dialogo7(dialogo[7], this.subtriangulo2, this.subtriangulo3),
        )

        fase.animar(animacao);
    }

    aula3Dialogo2(dialogos, triangulo){


        const index = this.triangulo.vertices.indexOf(this.informacao.verticeSelecionado)

        const anguloProximo  = triangulo.angles[(index+2)%3];
        const anguloAfastado = triangulo.angles[(index+3)%3];
        const anguloReto     = triangulo.angles[(index+4)%3]; 

        const girarAngulos = new AnimacaoSequencial(
                                new AnimacaoSimultanea(
                                    this.animacaoGirarAngulo(anguloProximo),
                                    dialogos[0]
                                ), 
                                new AnimacaoSimultanea(
                                    this.animacaoGirarAngulo(anguloAfastado),
                                    dialogos[1]
                                ), 
                                new AnimacaoSimultanea(
                                    this.animacaoGirarAngulo(anguloReto),
                                    dialogos[2]
                                ), 
                                
                            );


        return  girarAngulos;
    }

    aula3Dialogo3(dialogo, triangulo){

        const lado       = triangulo.edges[1];
        const ladoOposto = triangulo.edges[2];

        const ladoClone   = lado.clone().addToScene(this.scene);
        const opostoClone = ladoOposto.clone().addToScene(this.scene);

        const horario = -triangulo.calcularSentido();

        const direcao1 = lado.origem.clone().sub(lado.destino).cross(new THREE.Vector3(0,0,horario)).normalize();
        const direcao2 = ladoOposto.origem.clone().sub(ladoOposto.destino).cross(new THREE.Vector3(0,0,horario)).normalize();

        const colorir1  = colorirAngulo(lado)
                         .setValorInicial(lado.material.color.getHex())
                         .setValorFinal(0xaa0000)
                         .voltarAoInicio(false)
                         .setDuration(50);

        const colorir2  = colorirAngulo(ladoClone)
                         .setValorInicial(lado.material.color.getHex())
                         .voltarAoInicio(false)
                         .setValorFinal(0xaa0000)
                         .setDuration(50);

        const colorir3  = colorirAngulo(ladoOposto)
                         .setValorInicial(ladoOposto.material.color.getHex())
                         .voltarAoInicio(false)
                         .setValorFinal(0x0000aa)
                         .setDuration(50);

        const colorir4  = colorirAngulo(opostoClone)
                         .setValorInicial(ladoOposto.material.color.getHex())
                         .voltarAoInicio(false)
                         .setValorFinal(0x0000aa)
                         .setDuration(50);

        const moverLado = new AnimacaoSequencial(
            new AnimacaoSimultanea(
                mover(ladoClone, lado.getPosition(), lado.getPosition().add(direcao1.multiplyScalar(ladoOposto.length))).setDelay(100),
                colorir1,
                colorir2
            ),
            new AnimacaoSimultanea(
                mover(opostoClone, ladoOposto.getPosition(), ladoOposto.getPosition().add(direcao2.multiplyScalar(lado.length))),
                colorir3,
                colorir4
            )
         )

         

         const novoTriangulo =  new Poligono([
                                            triangulo.vertices[0].getPosition(), 
                                            triangulo.vertices[1].getPosition().add(direcao1), 
                                            triangulo.vertices[2].getPosition().add(direcao2)
                                        ])
                                        .configuration({grossura:0.026, raioVertice:0.04, raioAngulo:0.7}) //Grossura levemente maior para sobrepor a aresta original
                                        .render();
                                        
        novoTriangulo.edges[0] = ladoClone.removeFromScene();
        novoTriangulo.edges[1] = opostoClone.removeFromScene();

        novoTriangulo.angles.map(angle => angle.material.color = 0x0000aa);

        const aparecerTriangulo = new ApagarPoligono(novoTriangulo)
                                        .reverse()
                                        .setOnStart(() => {
                                            novoTriangulo.addToScene(this.scene);
                                        })

        aparecerTriangulo.animacoes.splice(3,2); // Ignora animações de mostrar os lados já em cena

        this.subtriangulo3 = novoTriangulo;

        return new AnimacaoSimultanea(
                 new AnimacaoSequencial(moverLado, aparecerTriangulo),
                 dialogo
            )
    }

    aula3Dialogo5(dialogo,triangulo, trianguloCopia){

        
        // const mostrarOposto3 = new MostrarBissetriz(triangulo, triangulo.angles[2], this);


        return animacaoIndependente(() => {

            const mostrarOposto1 = new MostrarBissetriz(trianguloCopia, trianguloCopia.angles[0], this);
            const mostrarOposto2 = new MostrarBissetriz(triangulo, triangulo.angles[1], this);
            
            this.animar(
                new AnimacaoSequencial(
                    dialogo,

                    new AnimacaoSequencial(
                        new AnimacaoSimultanea(
                            animacaoIndependente(() => mostrarOposto1.update({dentro:true})).setOnTermino(() => mostrarOposto1.update({dentro:false})),
                            engrossarLado(trianguloCopia.edges[1]).filler(50),
                            animacaoIndependente(() => mostrarOposto2.update({dentro:true})).setOnTermino(() => mostrarOposto2.update({dentro:false})),
                            engrossarLado(triangulo.edges[2]).filler(50),
                        ),
                        new AnimacaoSimultanea(
                            this.animacaoGirarAngulo(trianguloCopia.angles[0]).setDuration(100),
                            this.animacaoGirarAngulo(triangulo.angles[1]).setDuration(100)
                        )
                    )
                )
                .setCheckpointAll(false)
            )
        }).setDuration(600)
    }

    aula3Dialogo7(dialogo, triangulo, trianguloCopia){

        const fase = this;

        const apagarTrianguloAuxiliar = new ApagarPoligono(trianguloCopia).setDuration(100);

        const angulo = triangulo.angles[1];

        const verticeSelecionado = triangulo.vertices[0];

        const movimentacao = new AnimacaoSimultanea(
                                moverAnguloAnimacao(angulo, angulo.getPosition(), verticeSelecionado.getPosition()),
                                girarAngulo(angulo)
                            )

        const noventaGraus = new Angle([triangulo.vertices[0], triangulo.vertices[2], trianguloCopia.vertices[1]]).render()

        const apagarObjeto2 = (objeto) => apagarObjeto(objeto).setDuration(50);

        const mostrar90 = new AnimacaoSequencial(
                            new AnimacaoSimultanea(
                                apagarObjeto2(triangulo.angles[0]).setDuration(50),
                                apagarObjeto2(triangulo.angles[1]).setDuration(50),
                            ),
                            apagarObjeto2(noventaGraus).reverse().setOnStart(() => noventaGraus.addToScene(this.scene)),
                            apagarObjeto2(noventaGraus).setOnTermino(()=> noventaGraus.removeFromScene()),
                            new AnimacaoSimultanea(
                                apagarObjeto2(triangulo.angles[0]).reverse(),
                                apagarObjeto2(triangulo.angles[1]).reverse(),
                            )
                        )

        return new AnimacaoSequencial(apagarTrianguloAuxiliar,movimentacao ,dialogo, mostrar90);

        function moverAnguloAnimacao(angle, origem, destino){


            const anguloInicial = angle;
            
    
            const moveAngulo = new Animacao()
                            .setValorInicial(origem)
                            .setValorFinal(destino)
                            .setInterpolacao((a,b,c) => new THREE.Vector3().lerpVectors(a,b,c))
                            .setUpdateFunction(function(posicao){
                                    anguloInicial.mesh.position.copy(posicao);
                            })
                            .voltarAoInicio(false)
                            .setDuration(75)
                            .setCurva(function easeInOutSine(x) {
                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
            
            return moveAngulo;
        }

        function girarAngulo(angulo){

            const anguloInicial = angulo;
    
            const quaternionInicial = anguloInicial.mesh.quaternion.clone(); 
            const quaternionFinal = new THREE.Quaternion();
            quaternionFinal.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    
            const tempoInterpolacao = 0.5; // Define o tempo de duração da interpolação (ajuste conforme necessário)
            const quaternionInterpolado = new THREE.Quaternion();
            quaternionInterpolado.slerp(quaternionInicial, quaternionFinal, tempoInterpolacao);
    
            // animação
            const animacaoRodaeMoveAngulo = new Animacao()
                .setValorInicial(quaternionInicial)
                .setValorFinal(quaternionFinal)
                .setDuration(75)
                .setInterpolacao(function(inicial, final, peso) {
                    return new THREE.Quaternion().slerpQuaternions(inicial, final, peso)
                })
                .setUpdateFunction(function(quaternum) {
                    anguloInicial.mesh.quaternion.copy(quaternum)
                })
                .voltarAoInicio(false) //Pra não resetar quando terminada a animação
                .setCurva(function easeInOutSine(x) {
                    return -(Math.cos(Math.PI * x) - 1) / 2;
                })
                .setOnStart(() => angulo.addToScene(fase.scene))

            return animacaoRodaeMoveAngulo;

        }

    }

    createInputs(){
        //Inputs
        const vertices = this.triangulo.vertices;
        const angles   = this.triangulo.angles;

        //Adiciona o clickable ao vertice, agora todo vertice tem vertice.clicable
        vertices.forEach((vertice) => new Clickable(vertice, this.camera));
        vertices.forEach((vertice) => new Draggable(vertice, this.camera));

        //Adiciona o draggable ao angulo, agora todo angulo tem angulo.draggable
        angles.map((angle) => new Draggable(angle, this.camera));

    }

    createOutputs(){
        //Outputs
        this.outputClickVertice   = this.triangulo.vertices.map(vertex =>   this.criarTracejado(vertex))
        this.outputDragAngle      = this.triangulo.angles.map(  angle =>    this.criarMovimentacaoDeAngulo(angle))
        this.outputEscolheuErrado = this.triangulo.angles.map(  angle =>    this.outputAnguloErrado(angle))
        this.outputMoverVertice   = this.triangulo.vertices.map(vertice => new MoverVertice(vertice));
        this.outputColorirVertice = this.triangulo.vertices.map(vertice => new ColorirOnHover(vertice, 0x8c8c8c, 0xffff00, this));
        this.outputMostrarAngulo  = this.triangulo.angles.map(angle => new MostrarAngulo(angle, 1.4).addToFase(this));
    }

    resetarInputs(){

        const vertices = this.triangulo.vertices;
        const angles   = this.triangulo.angles;

        vertices.map(vertice => vertice.draggable.removeObservers());
        vertices.map(vertice => vertice.clickable.removeObservers());
        angles.map(  angle => angle.draggable.removeObservers());

    }

    Configuracao0(){

        const fase = this;

        fase.resetarInputs();

        const vertices = fase.triangulo.vertices;

        vertices.forEach((vertice, index) => {

            const dentroDeUmaElipse = InsideElipse.fromObjeto(
                                                    vertice, 
                                                    {
                                                        get origem(){ return vertice.getPosition()},
                                                        get destino(){ return vertice.getPosition()}
                                                    },
                                                    1, 
                                                    fase.camera, 
                                                    fase.scene
                                    );

            fase.outputMoverVertice[index].addInputs(vertice.draggable);
            fase.outputColorirVertice[index].addInputs(dentroDeUmaElipse);
            fase.outputMostrarAngulo.map(output => output.addInputs(vertice.draggable))

            const atualizarTriangulo = new Output()
                                      .addInputs(vertice.draggable)
                                      .setUpdateFunction(estado => {

                                            if(estado.dragging){
                                                fase.triangulo.update()
                                            } 
                                      })

        })

    }

    //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
            //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
    Configuracao1(){

        const fase = this;

        fase.resetarInputs();
        

        //Ligações feitas: click vertice => cria tracejado

        const vertices = fase.triangulo.vertices;

        //Liga o vertice.clickable input ao output
        for (let i = 0; i < 3; ++i) {

            const vertice = vertices[i];

            vertice.clickable.addObserver(fase.outputClickVertice[i])
        }

        //Reseta o estado do output, nenhum ângulo selecionado
        fase.outputDragAngle.map(output => output.estado = {});
    }

    Configuracao2(informacao){

        const fase = this;

        fase.resetarInputs();

        fase.informacao = {...fase.informacao, ...informacao};

        const verticeSelecionado = fase.informacao.verticeSelecionado;
        const criarTracejado     = fase.informacao.criarTracejadoSelecionado;
        const angulosInvisiveis  = fase.informacao.angulosInvisiveis;

        const vertices           = fase.triangulo.vertices;
        const angles             = fase.triangulo.angles;

        //Para cada vértice diferente do selecionado, vertice.draggable:
        //adiciona output moverVertice, atualizar triângulo e atualizar criarTracejado

        vertices.forEach((vertice, index) => {
            
            //Output criar tracejado continua no vértice selecionado, para desligar
            if(vertice == verticeSelecionado){ 
                verticeSelecionado.clickable.addObserver(criarTracejado);
                return;
            }

            vertice.draggable.addObserver(fase.outputMoverVertice[index]);


            const atualizarTriangulo = new Output()
                                      .setUpdateFunction(estado => {
                                            if(estado.dragging) 
                                                fase.triangulo.update();
                                      })

            //Vértice arrastado atualiza triângulo
            vertice.draggable.addObserver(atualizarTriangulo);

            //Vértice arrastado notifica esse criarTracejado
            vertice.draggable.addObserver(criarTracejado);
        })

        //angle.draggable => outputDragAngle
        angles.forEach((angle, index) => {
            angle.draggable.addObserver(fase.outputDragAngle[index])
        })

        //invisivel.hoverable => outputDragAngle
        //invisivel.hoverable => outputErrado
        //Liga os hoverables dos angulos invisíveis ao arraste
        //As combinações angulo real invisivel corretas são ligadas ao outputDragAngle
        //As combinações erradas são ligadas ao output escolheu errado
        fase.outputDragAngle.forEach((arraste,index) => {

            //Apenas liga se o ângulo for o mesmo
            const angle             = fase.triangulo.angles[index];
            const escolheuErrado    = fase.outputEscolheuErrado[index];

            angulosInvisiveis.forEach(anguloInvisivel => {

                if(angle.igual(anguloInvisivel)) {
                    anguloInvisivel.hoverable.addObserver(arraste); //liga o input hoverable do angulo invisivel ao output drag do angulo real
                    angle.correspondente = anguloInvisivel;
                }
                else{
                    anguloInvisivel.hoverable.addObserver(escolheuErrado) // se não for, liga para o output "ERRADO"
                    angle.draggable.addObserver(escolheuErrado);
                }
            })
        })



        //Finalmente, um pequeno output para verificar se o vertice foi arastado
        //Só funciona uma vez
        if(fase.jaArrastouVertice) return;

        const arrastouVertice = new Output().setUpdateFunction((estado) => {   
            if(estado.dragging) fase.jaArrastouVertice = true
        })

        fase.outputMoverVertice.map(output => output.addObserver(arrastouVertice));


    }

    Configuracao3(informacao){

        const fase = this;

        fase.resetarInputs();

        fase.Configuracao2({}); //Passa nenhuma informação nova, usa a mesma configuração

        fase.informacao = {...fase.informacao, ...informacao};
        

        const angle              = fase.informacao.anguloSelecionado;
        let   copia              = fase.informacao.copiaDoAngulo;
        const verticeSelecionado = fase.informacao.verticeSelecionado;

        angle.copiaDoAngulo = copia;
        
        //Output atualiza a copia
        const atualizarCopia = new Output().setUpdateFunction((estado) => {
            if(estado.dragging){


                const previousPosition = copia.getPosition();
                
                copia.removeFromScene();

                const material = copia.mesh.material.clone();

                copia = angle.copia();

                angle.copiaDoAngulo = copia;

                copia.material = material;

                copia.render().addToScene(fase.scene)

                copia.mesh.position.copy(verticeSelecionado.mesh.position)

                copia.mesh.quaternion.copy(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI))
            }
        })

        const deletarCopia = new Output().setUpdateFunction(function(estado){
            if(estado.clicado){
                this.removeInputs();

                copia.removeFromScene();


                //Por que isso? analisar depois...
                angle.material = new THREE.MeshBasicMaterial({color: 0xff0000});

                angle.update();

                atualizarCopia.removeInputs();
            }
        })

        verticeSelecionado.clickable.addObserver(deletarCopia) //Deleta a copia ao desativar o criarTracejado
        // fase.outputMoverVertice.map(output => output.removeInputs());
        fase.outputMoverVertice.map(output => output.addObserver(atualizarCopia)); //Atualiza copia ao mover vértice
        fase.outputEscolheuErrado[angle.index].removeInputs(); //Não consegue errar mais pois já está selecionado
    }

    Configuracao4(){

        const fase = this;

        fase.resetarInputs();
    }


    criarMovimentacaoDeAngulo = (angle) => {


        //Inputs: hoverable do ângulo invisível -> {dentro: bool}, 
        //                                      -> diz se o mouse está dentro do invisível
        //
        //        draggable do ângulo real      -> {posicao: vetor, dragging: bool}, 
        //                                      -> diz a posição do mouse e se ele está arrastando o angulo real

        const fase = this;

        let copia  = null;

        return new Output()
               .setUpdateFunction(
                    function(estadoNovo){

                        this.estado = {...this.estado, ...estadoNovo}


                        const estado = this.estado;

                        if(estado.finalizado) return;

                        if(estado.dragging){
                            let posicao = estado.position.clone();

                            if(posicao) angle.mesh.position.copy((posicao))
                        }

                        //Se arrastou e está em cima do ângulo invisível, estado é valido
                        if(estado.dragging && estado.dentro){
                            estado.valido = true;
                            return;
                        }

                        //Se o estado for valido e soltar o mouse, então finaliza a execução
                        if(estado.valido && !estado.dragging){
                            estado.finalizado = true;

                            copia = angle.copia().render();

                            const invisivel = angle.correspondente;

                            //Roda a animação de movimentar ângulo, é uma função auxiliar abaixo
                            //Move e gira a copia

                            const posicaoVerticeInvisivel = invisivel.vertices[0].mesh.position.clone()

                            const posicaoFinal = posicaoVerticeInvisivel


                            copia.addToScene(fase.scene)
                            moverAnguloAnimacao(copia, estado.position.clone(), posicaoFinal);
                            girarAngulo(copia);

                            //Retorna o ângulo a sua posição original
                            moverAnguloAnimacao(angle, angle.getPosition(), angle.position);
                            
                            fase.cor = !fase.cor;
                            // animarMudarDeCor(copia);
                            // animarMudarDeCor(angle);

                            //Muda os outputs que o angulo aceita( não pode ser mais arrastado)
                            //Adiciona um output que atualiza a copia no arraste
                            fase.Configuracao3({anguloSelecionado: angle, copiaDoAngulo: copia});

                            return;
                        }

                        if (!estado.dragging) {
                            angle.mesh.position.copy(angle.position);
                            

                        }

                        estado.valido = false;
                    }
               )

        //Funções auxiliares
        function moverAnguloAnimacao(angle, origem, destino){


            const anguloInicial = angle;
            
    
            const moveAngulo = new Animacao()
                            .setValorInicial(origem)
                            .setValorFinal(destino)
                            .setInterpolacao((a,b,c) => new THREE.Vector3().lerpVectors(a,b,c))
                            .setUpdateFunction(function(posicao){
                                    anguloInicial.mesh.position.copy(posicao)
                            })
                            .voltarAoInicio(false)
                            .setDuration(75)
                            .setCurva(function easeInOutSine(x) {
                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
            
            fase.animar(moveAngulo)
        }

        function girarAngulo(angulo){

            const anguloInicial = angulo;
    
            const quaternionInicial = anguloInicial.mesh.quaternion.clone(); 
            const quaternionFinal = new THREE.Quaternion();
            quaternionFinal.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    
            const tempoInterpolacao = 0.5; // Define o tempo de duração da interpolação (ajuste conforme necessário)
            const quaternionInterpolado = new THREE.Quaternion();
            quaternionInterpolado.slerp(quaternionInicial, quaternionFinal, tempoInterpolacao);
    
            // animação
            const animacaoRodaeMoveAngulo = new Animacao()
                .setValorInicial(quaternionInicial)
                .setValorFinal(quaternionFinal)
                .setDuration(75)
                .setInterpolacao(function(inicial, final, peso) {
                    return new THREE.Quaternion().slerpQuaternions(inicial, final, peso)
                })
                .setUpdateFunction(function(quaternum) {
                    anguloInicial.mesh.quaternion.copy(quaternum)
                })
                .voltarAoInicio(false) //Pra não resetar quando terminada a animação
                .setCurva(function easeInOutSine(x) {
                    return -(Math.cos(Math.PI * x) - 1) / 2;
                })
                .setOnStart(() => angulo.addToScene(fase.scene))

            fase.animar(animacaoRodaeMoveAngulo);

        }

        function animarMudarDeCor(angle){

            const corFinal = (fase.cor)? 0x00ffff : 0x009b77;

            const colorir = colorirAngulo(angle)
                            .setValorInicial(0xff0000)
                            .setValorFinal(corFinal)
                            .setDuration(100)
                            //Gambiarra pois a classe angle foi mal feita, ignorar
                            .setUpdateFunction(valor => {
                                angle.material = new THREE.MeshBasicMaterial({color: valor})
                                angle.position.copy(angle.mesh.position);
                                const quaternion = angle.mesh.quaternion.clone();
                                angle.removeFromScene();
                                angle.renderMalha();
                                angle.mesh.quaternion.copy(quaternion)
                                angle.addToScene(fase.scene)
                            })
                            .voltarAoInicio(false)
                            .filler(100)
                            .setOnStart(() => fase.amareloUsado = true)
            
            fase.animar(colorir);               
        }
    }

    //Adcionar texto "Pivô" no ponto de inflexão e arrastável nos outros
    //Escolher pivô quando não tem nenhum
    criarTracejado = (vertex) => {

        //Input: clickable do vertice, diz se foi o vertice clicado ou não
        //Input: draggable dos outros vertices, diz se outros vértices se arrastaram

        //Para usar nas funções auxiliares
        const fase = this;

        // pegar outros dois vertices:
        const outros_dois = this.triangulo.vertices.filter((vertice) => vertice != vertex);

        let ativado = false;
        let tracejado  = null;
        let tracejado2 = null;
        let desenharTracejado = null;

        let trianguloInvisivel1 = null;
        let trianguloInvisivel2 = null;

        let anguloInvisivel1 = null;
        let anguloInvisivel2 = null;
        

        return new Output()
                .setUpdateFunction(
                    function(novoEstado){

                        this.estado = {...this.estado, ...novoEstado}

                        const estado = this.estado;


                        //Se um dos outros vértices tiver sendo arrastado, remove tudo e desenha de novo
                        if(estado.dragging){

                            desenharTracejado.stop = true;
                            tracejado2.removeFromScene();
                            tracejado.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);
                            // updateDegrees();

                            // ativarMoverOutrosVertices(this);

                            //Transformar isso num output composto?
                            fase.Configuracao2({
                                verticeSelecionado: vertex, 
                                criarTracejadoSelecionado: this,
                                sentido:vetorTracejado1,
                                angulosInvisiveis: [anguloInvisivel1, anguloInvisivel2]
                            });

                            tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1.multiplyScalar(3)), posicao.clone().add(vetorTracejado1.multiplyScalar(3)))

                            tracejado.addToScene(fase.scene);

                            tracejado2 = new Tracejado(outros_dois[0].getPosition().sub(vetorTracejado1.multiplyScalar(3)), outros_dois[0].getPosition().add(vetorTracejado1.multiplyScalar(3)))

                            tracejado2.addToScene(fase.scene);

                            estado.arraste = true;


                            return;
                        }

                        if (estado.clicado && !ativado){

                            ativado = !ativado

                            const posicao = vertex.getPosition();
                            const posicao2 = outros_dois[0].getPosition();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);

                            tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1), posicao.clone().add(vetorTracejado1))
                            tracejado.addToScene(fase.scene);

                            tracejado2 = new Tracejado(outros_dois[0].getPosition().sub(vetorTracejado1.clone()), outros_dois[0].getPosition().add(vetorTracejado1.clone()))
                            tracejado2.addToScene(fase.scene);

                            animacaoTracejado(tracejado, posicao.clone(), vetorTracejado1.clone());
                            animacaoTracejado(tracejado2, posicao2, vetorTracejado2);

                            //Transformar isso num output composto?
                            fase.Configuracao2({
                                verticeSelecionado: vertex, 
                                criarTracejadoSelecionado: this,
                                sentido: vetorTracejado1,
                                angulosInvisiveis: [anguloInvisivel1, anguloInvisivel2]
                            })

                            this.notify({tracejadoAtivado: true});


                        } else if (estado.clicado) {

                            ativado = !ativado
                            
                            desenharTracejado.stop = true;
                            tracejado.removeFromScene(fase.scene)
                            tracejado2.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)
                            
                            //Reseta outputs para sua configuração inicial
                            fase.Configuracao1({})
                            
                            fase.triangulo.removeFromScene();
                            fase.triangulo.addToScene(fase.scene);

                            this.notify({tracejadoAtivado: true});

                        }

                        estado.ativado = ativado; //Sinaliza se o output foi ativado
                        estado.clicado = false;
                    }
                )

        //Funções auxiliares
        //SEMPRE USAR "FASE" AO INVÉS DE THIS
        //o this no javascript quando usado em functions se refere a própria function
        //é como se as functions fossem objetos
        //isso não acontece com as setinhas

        //Cria os inputs das hitboxes invisíveis
        function criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2) {
            const vtov1 = outros_dois[0].mesh.position.clone().sub(posicao);
            const vtov2 = outros_dois[1].mesh.position.clone().sub(posicao);

            const posVtov1 = vtov1.clone().normalize().add(posicao);
            const posVtov2 = vtov2.clone().normalize().add(posicao);

            const posVtracejado1 = vetorTracejado1.clone().normalize().add(posicao);
            const posVtracejado2 = vetorTracejado2.clone().normalize().add(posicao);

            trianguloInvisivel1 = new Triangle();
            trianguloInvisivel1.positions = [posicao, posVtov1, posVtracejado1].map((vetor) => vetor.toArray());
            
            trianguloInvisivel2 = new Triangle();
            trianguloInvisivel2.positions = [posicao, posVtov2, posVtracejado2].map((vetor) => vetor.toArray());

            trianguloInvisivel1.render();
            trianguloInvisivel2.render();

            anguloInvisivel1 = new Angle(trianguloInvisivel1.vertices);
            anguloInvisivel2 = new Angle(trianguloInvisivel2.vertices);
            anguloInvisivel1.angleRadius = 1;
            anguloInvisivel2.angleRadius = 1;

            anguloInvisivel1.render();
            anguloInvisivel1.addToScene(fase.scene);
            anguloInvisivel2.render();
            anguloInvisivel2.addToScene(fase.scene)


            anguloInvisivel1.mesh.visible = false;
            anguloInvisivel2.mesh.visible = false;


            fase.hoverInvisivel1 = new Hoverable(anguloInvisivel1, fase.camera)
            fase.hoverInvisivel2 = new Hoverable(anguloInvisivel2, fase.camera)
        }

        //Anima o desenhar tracejado
        function animacaoTracejado(tracejado, posicao, vetorTracejado1){

            // animação
            desenharTracejado = new Animacao(tracejado)
                .setValorInicial(0)
                .setValorFinal(2)
                .setDuration(50)
                .setInterpolacao((inicial, final, peso) => inicial * (1 - peso) + final*peso)
                .setUpdateFunction((progresso) => {
                    tracejado.origem = posicao.clone().sub(vetorTracejado1.clone().multiplyScalar(progresso))
                    tracejado.destino = posicao.clone().add(vetorTracejado1.clone().multiplyScalar(progresso))
                    tracejado.update();
                })
                .setCurva((x) => x < 0.5
                                ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                                : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
                )
                .voltarAoInicio(false);
            
            fase.animar(desenharTracejado);
        }

        function updateDegrees(){

            for(const angle of fase.triangulo.angles){

                const valor = angle.mostrarAngulo.text.elemento.element.textContent;

                angle.mostrarAngulo.update({dentro:true});

                if(valor == "?") angle.mostrarAngulo.text.elemento.element.textContent = valor;
            }
        }


    }

    //Criar output negar ângulo errado (tremedeira + voltar ao inicio)
    //Se ele colocar o angulo no lugar errado, faz uma animação e devolve o ângulo para o lugar original
    outputAnguloErrado(angle){

        //Inputs: arraste do ângulo real (angle.draggable)
        //        hoverable do ângulo invisível errado (anguloInvisivel.hover)

        const fase = this;

        return new Output()
               .setUpdateFunction(function(estado){

                    this.estado = {...this.estado, ...estado};

                    if(estado.dragging) this.estado.ativado = true;
                    
                    if(this.estado.ativado && !this.estado.dragging && this.estado.dentro) {
                        animarGiro(this.estado.position);
                        this.estado.ativado = false;
                    }

               })

        //Função auxiliar////
        /////////////////////
        function animarGiro(posicao){

            const quaternionInicial = new THREE.Quaternion();
            const quaternionFinal   = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,-1), 0.3);

            function easeInOutBack(x) {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;
                
                return x < 0.5
                  ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                  : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
                
            }
            
            const giro =  new Animacao(angle)
                        .setValorInicial(quaternionInicial)
                        .setValorFinal(quaternionFinal)
                        .setDuration(30)
                        .setInterpolacao(function(inicial,final,peso){
                            return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                        })
                        .setCurva(x => (y => Math.sin(y*2*Math.PI))(easeInOutBack(x + 0.03*Math.random())))
                        .setUpdateFunction(function(quaternion){
                            angle.mesh.quaternion.copy(quaternion);
                        });

            const mover = new Animacao()
                            .setValorInicial(posicao)
                            .setValorFinal(angle.position.clone())
                            .setInterpolacao(new THREE.Vector3().lerpVectors)
                            .setUpdateFunction(function(posicao){
                                    angle.mesh.position.copy(posicao)
                            })
                            .voltarAoInicio(false)
                            .setDuration(75)
                            .setCurva(x => (y => (-(Math.cos(Math.PI * y) - 1) / 2))(x === 0 ? 0 : Math.pow(2, 10 * x - 10)))

            fase.animar(giro);
            fase.animar(mover);
        }
    }

    //Controla a mudança do fluxo dos probl
    controleGeral(){

        //Inputs: os 3 criarTracejados -> quando um deles atualiza, notifica esse output também

        const fase = this;

        return new Output()
               .addInputs(...fase.outputClickVertice)
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.terminadoDialogo && estado.etapa == "inicio"){
                        estado.etapa = "esperando";
                        fase.Configuracao1();
                        return;
                    }
                    
                    if(novoEstado.tracejadoAtivado && estado.etapa == "esperando"){
                        estado.etapa = "arraste";
                        return;
                    }

                    console.log(novoEstado)
                    if(novoEstado.trianguloDividido){

                        estado.etapa = "mostrarIgualdade";
                        alert("começou")
                        fase.aula3();
                        return;
                    }
               })
               .setEstadoInicial({
                    etapa: "inicio"
               })
    }

    animacaoGirarAngulo(angle){

        const quaternionInicial = new THREE.Quaternion();
        const quaternionFinal   = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,-1), 0.3);

        function easeInOutBack(x) {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            
            return x < 0.5
              ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
              : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            
        }
        
        const giro =  new Animacao(angle)
                    .setValorInicial(quaternionInicial)
                    .setValorFinal(quaternionFinal)
                    .setDuration(30)
                    .setInterpolacao(function(inicial,final,peso){
                        return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                    })
                    .setCurva(x => (y => Math.sin(y*2*Math.PI))(easeInOutBack(x + 0.03*Math.random())))
                    .setUpdateFunction(function(quaternion){
                        angle.mesh.quaternion.copy(quaternion);
                    });

        return giro;

    }

    animacaoDividirTriangulo(){

        const fase = this;

        this.debug = false;

        this.Configuracao4();

        //Definindo valores úteis
        const vertice  = this.informacao.verticeSelecionado;
        const indice   = this.triangulo.vertices.indexOf(vertice);
        const vertice2 = this.triangulo.vertices[(indice + 1)%3];
        const vertice3 = this.triangulo.vertices[(indice + 2)%3];

        const mostrarAngulo   = this.outputMostrarAngulo[indice];
        
        const aresta  = this.triangulo.edges[(indice + 1)%3];

        //Definindo ponto de divisão do triângulo e o tracejado a ser desenhado
        const vetorDirecaoAresta  = aresta.origem.clone().sub(aresta.destino).normalize();
        const vetorDirecao90Graus = new THREE.Vector3(0,0,-1).cross(vetorDirecaoAresta);
        const distancia           = aresta.getPosition().sub(vertice.getPosition()).dot(vetorDirecao90Graus);
        const vetorDestinoDivisao = vetorDirecao90Graus.clone().multiplyScalar(distancia);

        const pontoDeDivisao = vertice.getPosition().add(vetorDestinoDivisao);

        const tracejado = new Tracejado(vertice.getPosition(), pontoDeDivisao.clone());

        const desenharTracejado = new MostrarTracejado(tracejado, this.scene).setOnStart(() => tracejado.addToScene(this.scene))
        

        //Desenhar subtriângulo1
        const subtriangulo1 = new Poligono([vertice.getPosition(), vertice2.getPosition(), pontoDeDivisao.clone()])
                                 .configuration({grossura:0.027, raioVertice:0.04, raioAngulo:0.7}) //Grossura levemente maior para sobrepor a aresta original
                                 .render();

        subtriangulo1.angles.map(angle => angle.material.color = 0x0000aa);

        const mostrarTriangulo = new ApagarPoligono(subtriangulo1)
                                    .reverse()
                                    .setOnStart(() => subtriangulo1.addToScene(this.scene));

        //Desenhar subtriângulo2
        //Mostrar que eles são congruentes com os triângulos externos (usar Carta?)
        const subtriangulo2 = new Poligono([vertice.getPosition(), vertice3.getPosition(), pontoDeDivisao.clone()])
                                 .configuration({grossura:0.026, raioVertice:0.04, raioAngulo:0.7}) //Grossura levemente maior para sobrepor a aresta original
                                 .render();

        subtriangulo2.angles.map(angle => angle.material.color = 0x00b7eb);

        const mostrarTriangulo2 = new ApagarPoligono(subtriangulo2)
                                    .reverse()
                                    .setOnStart(() => subtriangulo2.addToScene(this.scene));

        this.subtriangulo1 = subtriangulo1;
        this.subtriangulo2 = subtriangulo2;
        this.tracejadoDivisao = tracejado;

        //MostrarAngulos dos angulos divididos
        this.outputMostrarAnguloSubtriangulo = [
            new MostrarAngulo(subtriangulo1.angles[0], 1.4).addToFase(this), 
            new MostrarAngulo(subtriangulo2.angles[0], 1.4).addToFase(this)
        ]

        const animacao = new AnimacaoSequencial(
                            new AnimacaoSimultanea(
                                mostrarAngulo.animacao(false),
                                ...this.outputMostrarAnguloSubtriangulo.map(output => output.animacao(true))
                            ), 
                            desenharTracejado, 
                            mostrarTriangulo, 
                            mostrarTriangulo2
                        );

        animacao.setOnTermino(() => {
            fase.triangulo.angles.map(angle=> angle.material.visible = false);
            fase.controleFluxo.update({trianguloDividido: true})
        });

        return animacao;
    }
    
    update(){

        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();
        if(this.debug) super.update();

        super.update();

        if(!this.progresso) this.progresso = "start";

        const problemaAtual = this.problemas[this.progresso];

        if(problemaAtual.satisfeito(this)){

            problemaAtual.consequencia(this);

            this.progresso = problemaAtual.proximo(this);

            // const proximoProblema = this.problemas[this.progresso];


            // proximoProblema.estado.informacao = this.informacao;
        }
    }

    problemas = {

        start: {
            satisfeito: () => true,

            consequencia: (fase) => {
                fase.aula1();

                fase.Configuracao0();

                fase.controleFluxo  = fase.controleGeral(); 
            },

            proximo: () => "clicouVertice",

            estado: new Estado(this, "setupObjects", null, "start", {})
        },

        clicouVertice: {
            satisfeito: (fase) => fase.controleFluxo.estado.etapa == "arraste",

            consequencia: (fase) => fase.aula2(),

            proximo: (fase) => "arrastouVertice",

        },

        arrastouVertice: {
            satisfeito: (fase) => !!fase.jaArrastouVertice,

            consequencia: (fase) => {
                
                const dialogo = ["Arrastando esses dois vértices, pode-se criar qualquer triângulo",
                                 "Ou seja, o que vamos fazer a seguir vale para todo triângulo...",
                                 "Perceba os buracos entre o ângulo e o tracejado",
                                 "Eles parecem caber outros ângulos não é?",
                                 "Tente arrastar os ângulos do triângulo até esses buracos"]

                const anim1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[0]));
                const anim2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[1])).setDelay(50);
                const anim3 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[2]));
                const anim4 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[3]));
                const anim5 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[4]));

                fase.animar(new AnimacaoSequencial(anim1,anim2,anim3,anim4,anim5));


            },

            proximo: (fase) => 180,

            // estado: new Estado(this, "setupObjects", "Configuracao2", "arrastouVertice", {})
        },

        180: {
            //Se dois outputs de arraste tiverem finalizado(posições corretas), então 180° está satisfeito
            satisfeito: (fase) => fase.outputDragAngle.filter(output => output.estado.finalizado).length == 2,

            consequencia: (fase) => {

                fase.animar180Graus();

                fase.Configuracao4();

            },

            proximo: (fase) => "finalizado",

            // estado: new Estado(this, "setupObjects", "Configuracao3", "180", {})
        },

        finalizado:{
            satisfeito: () => false,

            // estado: new Estado(this, "setupObjects", null, "finalizado", {})
        }
    }

    //Funções, outputs etc. usados nos problemas

    animar180Graus(){


        const fase = this;

        const index   = fase.outputClickVertice.map((output,indice) => (output.estado.ativado)? indice : -1)
                                               .filter(indice => indice != -1)[0];

        const angulos = fase.triangulo.angles.filter(angulo => angulo.index != index)

        const objetos = fase.triangulo.vertices.concat(fase.triangulo.edges).concat(angulos);


        const apagarTrianguloAnimacao = new Animacao()
                                        .setValorInicial(1)
                                        .setValorFinal(0)
                                        .setInterpolacao((inicial,final,peso) => inicial*(1-peso) + final*peso)
                                        .setUpdateFunction(function(valor){

                                            objetos.map(objeto => objeto.mesh.material = new THREE.MeshBasicMaterial({color: objeto.material.color, transparent:true, opacity: valor}))
                                        })
                                        .setCurva(x => x < 0.5
                                            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                                            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2)
                                        .setDuration(200)
                                        .voltarAoInicio(false)


        fase.animar(apagarTrianguloAnimacao);


        const dialogo = ["Veja o ângulo resultante da soma dos ângulos do triângulo,",
                         "Ele forma metade de um círculo",
                        "Se um círculo tem 360°, então quantos graus tem metade de um círculo?"]
        
        //Clica automaticamente no vértice, desligando seu output e resetando o triângulo
        const desligarTracejado = () => fase.outputClickVertice.forEach(output => (output.ativado)? output.update({clicado:true}) : null);

        const anim1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[0])).setDelay(200)
        const anim2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[1])).setDelay(100)
        const anim3 = new TextoAparecendo(fase.text.element)
                          .setOnStart(() => fase.changeText(dialogo[2]))
                          .setOnTermino(desligarTracejado)
                          .setDelay(100)
                          
        const vertice = fase.triangulo.vertices[index];

        const circulo = new Circle(vertice.getPosition(), 0.740,0.05);
        
        const desenharCirculo = new DesenharMalha(circulo, fase.scene).setDuration(250);
        
        fase.animar(new AnimacaoSequencial(anim1,new AnimacaoSimultanea(anim2,desenharCirculo),anim3))
        
    }
}