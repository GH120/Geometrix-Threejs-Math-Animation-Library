import {Draggable} from '../inputs/draggable';
import {Hoverable} from '../inputs/hoverable';
import {MostrarAngulo} from '../outputs/mostrarAngulo';
import { ColorirIsoceles } from '../outputs/colorirIsoceles';
import { MostrarTipo } from '../outputs/mostrarTipo';
import  MoverVertice  from '../outputs/moverVertice';
import { MostrarBissetriz } from '../outputs/mostrarBissetriz';
import { Clickable, DoubleClick, MultipleClickable } from '../inputs/clickable';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

import * as dat from 'dat.gui';
import * as THREE from 'three';
import { TextoAparecendo } from '../animacoes/textoAparecendo';
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea, animacaoIndependente, curvas } from '../animacoes/animation';
import { colorirAngulo, colorirTextoCSS2D } from '../animacoes/colorirAngulo';
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
import { Addition, Equality, MathJaxTextBox, Value, Variable } from '../equations/expressions';
import MoverTexto from '../animacoes/moverTexto';
import MostrarTexto from '../animacoes/MostrarTexto';
import ElementoCSS2D from '../objetos/elementocss2d';
import JuntarEquacoes from '../outputs/juntarEquacoes';
import ResolverEquacao from '../outputs/resolverEquacao';
import MetalicSheen from '../animacoes/metalicSheen';
import SimularMovimento from '../animacoes/simularMovimento';
import Bracket from '../objetos/bracket';
import { apagarCSS2 } from '../animacoes/apagarCSS2';
import {substituirVariavel} from '../animacoes/substituirVariavel';

export class Fase5  extends Fase{

    constructor(){

        super();

        this.setupObjects();
        this.createInputs();
        this.createOutputs();
        this.setupTextBox();
        this.Configuracao1(); //É uma versão generalizada do ligar Input ao Output


        //Mostrar a1,a2,a3 e seus valores indo para lousa
        //Quando dividir a2 em dois angulos, mostrar que ele é a soma dos subangulos
        //Mostrar que a soma dos 

        this.debug = false;

        this.aceitaControleDeAnimacao = true;

        this.informacao = {
            verticeSelecionado: null,
            criarTracejadoSelecionado: null,
            angulosInvisiveis: null 
        }

    }

    resetObjects(){
        this.objetos.map(objeto => objeto.removeFromScene());

        this.objetos = [];
    }

    setupObjects(){

        this.resetObjects();

        this.triangulo = new Poligono([
            [-3,-2,0],
            [1,1.5,0],
            [4,-2,0]
        ])
        .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.7})
        .render()
        .addToScene(this.scene);

        this.objetos.push(this.triangulo);
    }


    ////////////////////////////////////////////////////////////////////////
    /////////////////////////Dialogos Principais////////////////////////////
    ////////////////////////////////////////////////////////////////////////


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


        animacao.animacoes[3] = fase.aula1Dialogo4(animacao.animacoes[3]);

        animacao.setNome("dialogo");

        animacao.animacoes[3].setOnTermino(() => fase.controleFluxo.update({terminadoDialogo: true}))

        this.animar(animacao);

        this.outputMostrarAngulo.map(output => output.update({dentro:true})) //Fazer animação aparecer triângulo?

    }

    aula1Dialogo4(dialogo){

        const fase = this;

        const trajetoria = [new THREE.Vector3(-3,2,0), new THREE.Vector3(-10, 1, 0)]

        const moverVertice = new SimularMovimento(fase.triangulo.vertices[2], trajetoria, 0.3, 5)
                            .setCurva(curvas.easeOutCircle)
                            .setDuration(1000)
                            .comSetinha(fase.scene);

        const bracket = new Bracket(0.2, new THREE.Vector3(4.2, -2, 0), new THREE.Vector3(4.2, 1.5,0)).addToScene(fase.scene);
        
        const desenharChave  = bracket.animacao().manterExecucao(true);

        const sidenote = fase.createMathJaxTextBox('\\displaylines{Vertices~ arrastáveis \\\\ tente~arrastar~eles \\\\ ~para ~formar ~qualquer~ triângulo}', [6,0, 0], 1.5);
        
        const mostrarSidenote = new MostrarTexto(sidenote, fase.scene)
                                .setDelay(900)
                                .setOnTermino(() => {
                                    desenharChave.manterExecucao(false);
                                    fase.scene.remove(sidenote);
                                })
                                .filler(200);


        return new AnimacaoSimultanea(
            dialogo, 
            new AnimacaoSimultanea(
                desenharChave,
                mostrarSidenote
            ),
            moverVertice.filler(480)
        );
    }

    aula2(){

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
            "Junte as duas fórmulas na lousa, para conseguirmos a soma de todos os ângulos"
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
                            this.removerSubtriangulos()
        )

        animacao.setOnTermino(() => fase.controleFluxo.update({juntarEquacoes: true}))

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

        novoTriangulo.angles.map(angle => angle.material.color = triangulo.angles[0].material.color);

        const aparecerTriangulo = new ApagarPoligono(novoTriangulo,false)
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
        const anguloProximo = triangulo.angles[0];

        const verticeSelecionado = triangulo.vertices[0];

         //Gambiarra, pega o mostrar angulo do angulo original afastado
        //Coloca ele para ver o angulo copiado enquanto faz o movimento
        //E finalmente reverte 
        let mostrarAnguloAfastado = fase.informacao.mostrarAngulosAfastados[(triangulo == this.subtriangulo1)? 0 : 1];
        const anguloAfastado      = mostrarAnguloAfastado.angulo;
        mostrarAnguloAfastado.distanciaTextoParaAngulo = 1.4;

        const atualizarAngulo =  animacaoIndependente(  () => mostrarAnguloAfastado.angulo = angulo)
                                .setUpdateFunction(     () => mostrarAnguloAfastado.update())
                                //  .setOnTermino(         () => mostrarAnguloAfastado.angulo = anguloAfastado)
                                 .setDelay(0);

        //Equacao -> refatorar depois, precisa de mostrarAngulo como atributo de cada angulo

        const mostrarAnguloProximo  = this.outputMostrarAnguloSubtriangulo[(triangulo == this.subtriangulo1)? 0 : 1]
        
        angulo.mostrarAngulo        = mostrarAnguloAfastado;
        anguloProximo.mostrarAngulo = mostrarAnguloProximo;

        const moverAngulosParaEquacao = this.moverGrausParaPosicaoEquacao([angulo, anguloProximo]);
        
        //Função girar angulo alterada para acomodar atualização do mostrarAngulo

        const movimentacao = new AnimacaoSimultanea(
                                fase.moverAnguloAnimacao(angulo, angulo.getPosition(), verticeSelecionado.getPosition()),
                                fase.girarAngulo(angulo),
                                atualizarAngulo
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

        return new AnimacaoSequencial(
            apagarTrianguloAuxiliar,
            movimentacao ,
            dialogo, 
            mostrar90, 
            moverAngulosParaEquacao
        )
        .setOnTermino(() => mostrarAnguloAfastado.angulo = anguloAfastado)


    }

    aula4(){

        const fase = this;

        fase.Configuracao0b();

        const indice = fase.triangulo.vertices.indexOf(fase.informacao.verticeSelecionado);

        const criarTracejado = fase.outputCriarTracejado[indice];

        criarTracejado.estado.ativado = false;
        criarTracejado.estado.tracejado.removeFromScene();
        criarTracejado.estado.tracejado2.removeFromScene();

        const dialogo = ['Arraste os vértices para formar qualquer triângulo que quiser'];


        const animacao = new AnimacaoSimultanea(fase.reverterTriangulo(), fase.animacaoDialogo(dialogo[0]))


        fase.animar(animacao);
    }

    aula4a(){

        const fase = this;

        fase.Configuracao0b();

        const dialogo = ['Agora tente clicar duas vezes em qualquer vértice'];


        const animacao = new AnimacaoSimultanea(fase.animacaoDialogo(dialogo[0]))


        fase.animar(animacao);
    }
    
    aula4b(){
        
        const fase = this;

        const dialogo = ['Arraste os ângulos para os buracos do tracejado']

        fase.animar(fase.animacaoDialogo(dialogo[0]));
    }

    aula4c(){
        
        const fase = this;

        const dialogo = [
            'Esse triângulo tem 180°, como queriamos provar',
            'Vamos testar para outro exemplo?'
        ].map(linha => fase.animacaoDialogo(linha));

        const mostrar180 = fase.mostrarEApagar180Graus(fase.informacao.verticeSelecionado, fase.triangulo.angles)


        const anim1 = new AnimacaoSimultanea(dialogo[0], mostrar180);
        const anim2 = dialogo[1];

        const animacao = new AnimacaoSequencial(anim1, anim2);

        fase.animar(animacao);

        return animacao;
    }

    final(){

        const fase = this;

        const dialogo = [
            "Muito bem, com isso deve estar convencido dessa propriedade fundamental,",
            "A soma dos ângulos internos de um triângulo é 180°, para qualquer triângulo",
            "Vamos usar esse raciocínio na proxima fase onde veremos semelhança"
        ]

        fase.animar(fase.animacoesDialogo(...dialogo));
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////Dialogos Auxiliares////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    //Mover isso para um caso do controle de fluxo?
    juntarEquacoesDialogo(){

        const fase = this;

        const dialogo = ["Junte as duas fórmulas na lousa, para conseguirmos a soma de todos os ângulos"].map(linha => fase.animacaoDialogo(linha))

        this.controleEquacoes();

        const animacao = new AnimacaoSimultanea(dialogo[0], ).setDelay(30).setOnTermino(() => fase.whiteboard.ativar(true))

        fase.animar(animacao)
    }

    removerSubtriangulos(){

        const removerSubtriangulo1 = new ApagarPoligono(this.subtriangulo1, false);
        const removerSubtriangulo2 = new ApagarPoligono(this.subtriangulo2, false);


        removerSubtriangulo1.ignorarObjetos(this.subtriangulo1.angles.slice(0,2));
        removerSubtriangulo2.ignorarObjetos(this.subtriangulo2.angles.slice(0,2));

        return new AnimacaoSimultanea(removerSubtriangulo1, removerSubtriangulo2);
    }   

    dialogoMostrando180Graus(){

        const fase = this;

        const angulosSelecionados = fase.informacao.equacoes.flatMap(equacao => equacao.angulosObjetos);

        const mostrarEApagar180Graus = fase.mostrarEApagar180Graus(fase.informacao.verticeSelecionado, angulosSelecionados)

        const triangulos = [fase.triangulo];

        const apagarTriangulos  = new AnimacaoSimultanea()
                                    .setAnimacoes(triangulos.map(
                                        triangulo => new ApagarPoligono(triangulo,false)
                                                        .ignorarObjetos(triangulo.angles)
                                                        .setOnTermino(() => null)
                                                        .setDuration(50)
                                    ))
        const mostrarTriangulos = new AnimacaoSimultanea()
                                    .setAnimacoes(triangulos.map(
                                        triangulo => new ApagarPoligono(triangulo,false)
                                                    .ignorarObjetos(triangulo.angles)
                                                    .reverse()
                                                    .setDuration(50)
                                    ))

        const mudarDialogo  = fase.animacaoDialogo("Veja que esses ângulos somam 180°");
        

        const animacao = new AnimacaoSequencial(
            new AnimacaoSimultanea(apagarTriangulos, mudarDialogo, mostrarEApagar180Graus),
            mostrarTriangulos,
        )

        return animacao;
    }

    transformar180GrausEmFormula(equacaoAtual){

        const fase = this;

        const dialogo = [
            "Podemos generalizar isso para qualquer triângulo",
            "Temos assim a fórmula na lousa",
            "Vamos testar para outros triângulos?"
        ]
        
        const indice = fase.triangulo.vertices.indexOf(fase.informacao.verticeSelecionado);

        const anguloDividido = fase.triangulo.angles[indice];

        const subangulos = [fase.subtriangulo1.angles[0], fase.subtriangulo2.angles[0]]

        const angulos = [fase.subtriangulo1.angles[1] , anguloDividido , fase.subtriangulo2.angles[1]];

        const mostrarAnguloOriginal =   new AnimacaoSimultanea(
                                            apagarObjeto(anguloDividido)
                                            .reverse()
                                            .setOnStart(() => {
                                              anguloDividido.addToScene(fase.scene)
      
                                              anguloDividido.mesh.position.z = 0.08
                                            })
      
                                            .setOnTermino(()=>{
                                              subangulos.map(subangulo => subangulo.removeFromScene());
                                            }),
                                            subangulos[0].mostrarAngulo.animacao(false),
                                            subangulos[1].mostrarAngulo.animacao(false),
                                            anguloDividido.mostrarAngulo.animacao(true)
                                        )
                                       

        //Transformar partes da equação em angulos
        //Colorir essas partes enquanto mostra os angulos sendo coloridos

        const valores = equacaoAtual.nodes.filter(node => node.type == "variable" || node.type == "value")
                                          .slice(0,3);

        const substituirAngulos = valores.map((valor, indice) => substituirVariavel(valor, 'Ângulo ' + (indice + 1)));

        const girarAngulos = angulos.map(angulo => fase.animacaoGirarAngulo(angulo));

        const colorirValores = valores.map((valor, i) => colorirTextoCSS2D(valor, 0x000000, angulos[i].mesh.material.color.getHex()));

        const substituirAngulosAnim = new AnimacaoSequencial(
                                        ...substituirAngulos.map(
                                            (substituir, i) => 
                                                new AnimacaoSimultanea(
                                                    substituir, 
                                                    girarAngulos[i], 
                                                    colorirValores[i]
                                                )
                                        )
                                    );

        const dialogo1 = fase.animacaoDialogo(dialogo[0]);
        const dialogo2 = fase.animacaoDialogo(dialogo[1]);
        const dialogo3 = fase.animacaoDialogo(dialogo[2]);

        const animacao = new AnimacaoSequencial(
                            mostrarAnguloOriginal,
                            dialogo1,
                            substituirAngulosAnim, 
                            dialogo2,
                            dialogo3
                        )
                        .setOnTermino(() => fase.aula4())

        fase.animar(animacao);
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////Configurações//////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

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

        const fase = this;

        //Outputs
        this.outputCriarTracejado   = this.triangulo.vertices.map(vertex =>   this.criarTracejado(vertex))
        this.outputDragAngle      = this.triangulo.angles.map(  angle =>    this.criarMovimentacaoDeAngulo(angle))
        this.outputEscolheuErrado = this.triangulo.angles.map(  angle =>    this.outputAnguloErrado(angle))
        this.outputMoverVertice   = this.triangulo.vertices.map(vertice => new MoverVertice(vertice));
        this.outputColorirVertice = this.triangulo.vertices.map(vertice => new ColorirOnHover(vertice, 0x8c8c8c, 0xffff00, this));
        this.outputMostrarAngulo  = this.triangulo.angles.map(angle => new MostrarAngulo(angle, 1.4).addToFase(this));
        this.doubleClickVertice   = this.triangulo.vertices.map(vertex => new DoubleClick(vertex, fase.camera));
    }

    resetarInputs(){

        const vertices = this.triangulo.vertices;
        const angles   = this.triangulo.angles;

        vertices.map(vertice => vertice.removeAllOutputs());
        angles.map(  angle => angle.removeAllOutputs());
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

    Configuracao0b(informacao){

        const fase = this;


        fase.Configuracao0();

        fase.informacao = {...fase.informacao, ...informacao};

        fase.outputMedirDistanciaArraste = fase.triangulo.vertices.map(vertice => fase.medirDistanciaArraste(vertice, 300));

        fase.controleFluxo.addInputs(...fase.outputMedirDistanciaArraste);

        
    }

    //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
            //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
    Configuracao1(){

        const fase = this;

        fase.resetarInputs();

        fase.informacao.copiasDosAngulos = [];
        

        //Ligações feitas: click vertice => cria tracejado

        const vertices = fase.triangulo.vertices;

        //Liga o vertice double click ao output criar tracejado
        //Pipeline: clickable -> doubleClick -> criarTracejado 
        for (let i = 0; i < 3; ++i) {

            const vertice = vertices[i];

            vertice.clickable.addObserver(fase.outputCriarTracejado[i])
            
            fase.outputMostrarAngulo.map(output => output.addInputs(vertice.draggable))
        }

        //Reseta o estado do output, nenhum ângulo selecionado
        fase.outputDragAngle.map(output => output.estado = {});
    }

    Configuracao1b(informacao){

        const fase = this;


        fase.resetarInputs();
        fase.controleFluxo.removeInputs();


        fase.informacao.copiasDosAngulos = [];

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
                const doubleClick = this.doubleClickVertice[index];

                doubleClick.removeInputs();
                doubleClick.removeObservers();
                doubleClick.addInputs(vertice.clickable);
                doubleClick.addObserver(fase.outputCriarTracejado[index])

                fase.controleFluxo.addInputs(fase.outputCriarTracejado[index]);
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

            fase.outputMostrarAngulo.map(output => output.addInputs(vertice.draggable))
        })


    }

    //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase
    Configuracao1c(informacao){

        const fase = this;


        fase.informacao.copiasDosAngulos = [];


        fase.resetarInputs();

        fase.controleFluxo.estado.etapa = 'aula4';

        fase.informacao = {...fase.informacao, ...informacao};

        //Ligações feitas: click vertice => cria tracejado

        const vertices = fase.triangulo.vertices;

        //Para transicionar caso o tracejado seja ativado
        fase.controleFluxo.removeInputs();

        //Liga o vertice double click ao output criar tracejado
        //Pipeline: clickable -> doubleClick -> criarTracejado 
        for (let i = 0; i < 3; ++i) {

            const vertice = vertices[i];

            const doubleClick = this.doubleClickVertice[i];

            doubleClick.removeInputs();
            doubleClick.removeObservers();
            doubleClick.addInputs(vertice.clickable);
            doubleClick.addObserver(fase.outputCriarTracejado[i])

            const mostrarAngulo = this.outputMostrarAngulo[i];
            mostrarAngulo.addInputs(vertice.draggable);

            fase.controleFluxo.addInputs(fase.outputCriarTracejado[i]);
        

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

            fase.outputColorirVertice[i].addInputs(dentroDeUmaElipse);
            fase.outputMostrarAngulo.map(output => output.addInputs(vertice.draggable))

            const atualizarTriangulo = new Output()
                                      .addInputs(vertice.draggable)
                                      .setUpdateFunction(estado => {

                                            if(estado.dragging){
                                                fase.triangulo.update()
                                            } 
                                      })
                                
            //Output criar tracejado continua no vértice selecionado, para desligar

            vertice.draggable.addObserver(fase.outputMoverVertice[i]);

            //Vértice arrastado notifica esse criarTracejado
            vertice.draggable.addObserver(this.outputCriarTracejado[0]);
            vertice.draggable.addObserver(this.outputCriarTracejado[1]);
            vertice.draggable.addObserver(this.outputCriarTracejado[2]);
        }



        //Reseta o estado do output, nenhum ângulo selecionado
        fase.outputDragAngle.map(output => output.estado = {});
    }
    

    //Problema: indo direto para aula4c
    Configuracao2(informacao){

        const fase = this;

        fase.resetarInputs();
        fase.controleFluxo.removeInputs();


        fase.informacao = {...fase.informacao, ...informacao};

        const verticeSelecionado = fase.informacao.verticeSelecionado;
        const criarTracejado     = fase.informacao.criarTracejadoSelecionado;
        const angulosInvisiveis  = fase.informacao.angulosInvisiveis;
        const anguloSelecionado  = fase.triangulo.angles[fase.triangulo.vertices.indexOf(verticeSelecionado)]

        const vertices           = fase.triangulo.vertices;
        const angles             = fase.triangulo.angles;

        //Para cada vértice diferente do selecionado, vertice.draggable:
        //adiciona output moverVertice, atualizar triângulo e atualizar criarTracejado

        vertices.forEach((vertice, index) => {
            
            //Output criar tracejado continua no vértice selecionado, para desligar
            if(vertice == verticeSelecionado){ 
                const doubleClick = this.doubleClickVertice[index];

                doubleClick.removeInputs();
                doubleClick.removeObservers();
                doubleClick.addInputs(vertice.clickable);
                doubleClick.addObserver(fase.outputCriarTracejado[index]);

                fase.controleFluxo.addInputs(fase.outputCriarTracejado[index]);
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

            fase.outputMostrarAngulo.map(output => output.addInputs(vertice.draggable))
        })

        //angle.draggable => outputDragAngle
        //angle.draggable => mostrarAngulo
        angles.forEach((angle, index) => {
                if(angle != anguloSelecionado) {
                    angle.draggable.addObserver(fase.outputDragAngle[index])
                    // angle.draggable.addObserver(fase.outputMostrarAngulo[index]) fazer depois...
                }
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

            if(angle == anguloSelecionado) return;

            angulosInvisiveis.forEach(anguloInvisivel => {

                if(angle.igual(anguloInvisivel)) {
                    anguloInvisivel.hoverable.addObserver(arraste); //liga o input hoverable do angulo invisivel ao output drag do angulo real
                    angle.correspondente = anguloInvisivel;
                }
                else{
                    anguloInvisivel.hoverable.addObserver(escolheuErrado) // se não for, liga para o output "ERRADO"
                    angle.draggable.addObserver(escolheuErrado);
                }
            });

            fase.controleFluxo.addInputs(arraste); //Arrastar ângulo avisa o controle de fluxo
        })

    }

    Configuracao2b(informacao){

        const fase = this;

        fase.resetarInputs();


        fase.Configuracao2({}); //Passa nenhuma informação nova, usa a mesma configuração

        fase.informacao = {...fase.informacao, ...informacao};

        const angulo              = fase.informacao.anguloSelecionado;
        const copiaDoAngulo       = fase.informacao.copiaDoAngulo;
        const verticeSelecionado  = fase.informacao.verticeSelecionado;
        
        angulo.copiaDoAngulo = copiaDoAngulo;

        fase.informacao.copiasDosAngulos.push({angulo: angulo, copia: copiaDoAngulo});

        fase.informacao.copiasDosAngulos.forEach(copiaInfo => {

            let copia = copiaInfo.copia;
            let angle = copiaInfo.angulo;

            //FAZER DEPOIS
            const updateMostrarAngulo = new Output()
                                        .setUpdateFunction(function(novoEstado){

                                            //O mostrar angulo do vértice agora aponta para a cópia
                                            if(novoEstado.atualizando){
                                                copia.mostrarAngulo = angle.mostrarAngulo;
                                                angle.mostrarAngulo.angulo = copia;

                                                copia.mostrarAngulo.update({});
                                            }
                                            else{
                                                //O mostrar angulo volta ao normal
                                                copia.mostrarAngulo = null;
                                                angle.mostrarAngulo.angulo = angle;
                                                angle.mostrarAngulo.update({});
                                            }
                                        })
            
            //Output atualiza a copia
            const atualizarCopia = new Output()
                                  .setUpdateFunction(function(estado){
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

                                            copiaInfo.copia = copia;

                                            this.notify({atualizando: true})
                                        }
                                })
                                // .addObserver(updateMostrarAngulo)

            const deletarCopia = new Output()
                                .setUpdateFunction(function(estado){
                                    if(estado.tracejadoAtivado == false){
                                        this.removeInputs();

                                        copia.removeFromScene();

                                        //Por que isso? analisar depois...
                                        angle.material = new THREE.MeshBasicMaterial({color: 0xff0000});
                                        
                                        angle.update();
                                        
                                        atualizarCopia.removeInputs();

                                        this.notify({copiaDeletada: true});
                                    }
                                })
                                .addInputs(fase.informacao.criarTracejadoSelecionado)
                                // .addObserver(updateMostrarAngulo)


            // fase.outputMoverVertice.map(output => output.removeInputs());
            fase.triangulo.vertices.map(vertice => vertice.draggable.addObserver(atualizarCopia)); //Atualiza copia ao mover vértice
            fase.outputEscolheuErrado[angle.index].removeInputs(); //Não consegue errar mais pois já está selecionado
        })
    }

    Configuracao4(informacao){

        const fase = this;



        fase.informacao = {...fase.informacao, ...informacao};

        fase.resetarInputs();
    }


    ////////////////////////////////////////////////////////////////////////
    /////////////////////////Outputs e Controles////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    criarMovimentacaoDeAngulo = (angle) => {


        //Inputs: hoverable do ângulo invisível -> {dentro: bool}, 
        //                                      -> diz se o mouse está dentro do invisível
        //
        //        draggable do ângulo real      -> {posicao: vetor, dragging: bool}, 
        //                                      -> diz a posição do mouse e se ele está arrastando o angulo real

        const fase = this;

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

                            estado.copia = angle.copia().render();

                            const invisivel = angle.correspondente;

                            //Roda a animação de movimentar ângulo, é uma função auxiliar abaixo
                            //Move e gira a copia

                            const posicaoVerticeInvisivel = invisivel.vertices[0].mesh.position.clone()

                            const posicaoFinal = posicaoVerticeInvisivel


                            estado.copia.addToScene(fase.scene)
                            moverAnguloAnimacao(estado.copia, estado.position.clone(), posicaoFinal);
                            girarAngulo(estado.copia);

                            //Retorna o ângulo a sua posição original
                            moverAnguloAnimacao(angle, angle.getPosition(), angle.position);
                            
                            fase.cor = !fase.cor;
                            // animarMudarDeCor(copia);
                            // animarMudarDeCor(angle);

                            //MUDAR PARA CONTROLE DE FLUXO
                            //Muda os outputs que o angulo aceita( não pode ser mais arrastado)
                            //Adiciona um output que atualiza a copia no arraste
                            this.notify({
                                anguloSelecionado: angle,
                                copiaDoAngulo: estado.copia,
                                alvo: 'arrasteAngulo'
                            })

                            return;
                        }

                        if (!estado.dragging) {
                            angle.mesh.position.copy(angle.position);
                            

                        }

                        estado.valido = false;
                    }
               )

               .setEstadoInicial({
                    copia: null
               })

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

        //Refatorar depois, muito bagunçado
        return new Output()
                .setUpdateFunction(
                    function(novoEstado){

                        this.estado = {...this.estado, ...novoEstado}

                        const estado = this.estado;

                        estado.contadorAtualizacao++;

                        //Se um dos outros vértices estiver sendo arrastado, remove tudo e desenha de novo
                        if(estado.dragging && estado.ativado){
                            
                            if(estado.contadorAtualizacao < 5) return;

                            estado.contadorAtualizacao = 0;

                            estado.desenharTracejado.stop = true;
                            estado.tracejado2.removeFromScene();
                            estado.tracejado.removeFromScene(fase.scene)

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = estado.verticesNaoSelecionados[0].mesh.position.clone().sub(estado.verticesNaoSelecionados[1].mesh.position.clone());
                            const vetorTracejado2 = estado.verticesNaoSelecionados[1].mesh.position.clone().sub(estado.verticesNaoSelecionados[0].mesh.position.clone());

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2, estado);

                            estado.tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1.multiplyScalar(3)), posicao.clone().add(vetorTracejado1.multiplyScalar(3)))

                            estado.tracejado.addToScene(fase.scene);

                            estado.tracejado2 = new Tracejado(estado.verticesNaoSelecionados[0].getPosition().sub(vetorTracejado1.multiplyScalar(3)), estado.verticesNaoSelecionados[0].getPosition().add(vetorTracejado1.multiplyScalar(3)))

                            estado.tracejado2.addToScene(fase.scene);

                            estado.arraste = true;

                            estado.tracejado = estado.tracejado;
                            estado.tracejado2 = estado.tracejado2;

                            this.notify({
                                verticeSelecionado: vertex, 
                                criarTracejadoSelecionado: this,
                                sentido: vetorTracejado1,
                                angulosInvisiveis: [estado.anguloInvisivel1, estado.anguloInvisivel2]
                            });


                            return;
                        }

                        if (estado.clicado && !estado.ativado){

                            estado.ativado = !estado.ativado

                            const posicao = vertex.getPosition();
                            const posicao2 = estado.verticesNaoSelecionados[0].getPosition();
                            const vetorTracejado1 = estado.verticesNaoSelecionados[0].mesh.position.clone().sub(estado.verticesNaoSelecionados[1].mesh.position.clone()).normalize().multiplyScalar(10);
                            const vetorTracejado2 = estado.verticesNaoSelecionados[1].mesh.position.clone().sub(estado.verticesNaoSelecionados[0].mesh.position.clone()).normalize().multiplyScalar(10);

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2, estado);

                            estado.tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1), posicao.clone().add(vetorTracejado1))
                            estado.tracejado.addToScene(fase.scene);

                            estado.tracejado2 = new Tracejado(estado.verticesNaoSelecionados[0].getPosition().sub(vetorTracejado1.clone()), estado.verticesNaoSelecionados[0].getPosition().add(vetorTracejado1.clone()))
                            estado.tracejado2.addToScene(fase.scene);

                            estado.tracejado = estado.tracejado;
                            estado.tracejado2 = estado.tracejado2;

                            animacaoTracejado(estado.tracejado, posicao.clone(), vetorTracejado1.clone(), estado);
                            animacaoTracejado(estado.tracejado2, posicao2, vetorTracejado2, estado);

                            this.notify({
                                tracejadoAtivado: true,
                                verticeSelecionado: vertex, 
                                criarTracejadoSelecionado: this,
                                sentido: vetorTracejado1,
                                angulosInvisiveis: [estado.anguloInvisivel1, estado.anguloInvisivel2]
                            });


                        } else if (estado.clicado) {

                            estado.ativado = !estado.ativado
                            
                            estado.desenharTracejado.stop = true;
                            estado.tracejado.removeFromScene(fase.scene)
                            estado.tracejado2.removeFromScene(fase.scene)
                            estado.anguloInvisivel1.removeFromScene(fase.scene)
                            estado.anguloInvisivel2.removeFromScene(fase.scene)
                            
                            fase.triangulo.update();

                            this.notify({
                                tracejadoAtivado: false,
                            });

                        }

                        estado.ativado = estado.ativado; //Sinaliza se o output foi ativado
                        estado.clicado = false;
                    }
                )

                .setEstadoInicial({
                    ativado :false,
                    tracejado  : null,
                    tracejado2 : null,
                    desenharTracejado : null,
                    trianguloInvisivel1 : null,
                    trianguloInvisivel2 : null,
                    anguloInvisivel1 : null,
                    anguloInvisivel2 : null,
                    verticesNaoSelecionados: this.triangulo.vertices.filter((vertice) => vertice != vertex),
                    contadorAtualizacao: 0
                })

        //Funções auxiliares
        //SEMPRE USAR "FASE" AO INVÉS DE THIS
        //o this no javascript quando usado em functions se refere a própria function
        //é como se as functions fossem objetos
        //isso não acontece com as setinhas

        //Cria os inputs das hitboxes invisíveis
        //Refatorar depois
        function criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2, estado) {
            const vtov1 = estado.verticesNaoSelecionados[0].mesh.position.clone().sub(posicao);
            const vtov2 = estado.verticesNaoSelecionados[1].mesh.position.clone().sub(posicao);

            const posVtov1 = vtov1.clone().normalize().add(posicao);
            const posVtov2 = vtov2.clone().normalize().add(posicao);

            const posVtracejado1 = vetorTracejado1.clone().normalize().add(posicao);
            const posVtracejado2 = vetorTracejado2.clone().normalize().add(posicao);

            estado.trianguloInvisivel1 = new Triangle();
            estado.trianguloInvisivel1.positions = [posicao, posVtov1, posVtracejado1].map((vetor) => vetor.toArray());
            
            estado.trianguloInvisivel2 = new Triangle();
            estado.trianguloInvisivel2.positions = [posicao, posVtov2, posVtracejado2].map((vetor) => vetor.toArray());

            estado.trianguloInvisivel1.render();
            estado.trianguloInvisivel2.render();

            if(!estado.anguloInvisivel1){
                estado.anguloInvisivel1 = new Angle(estado.trianguloInvisivel1.vertices);
                estado.anguloInvisivel2 = new Angle(estado.trianguloInvisivel2.vertices);
                estado.anguloInvisivel1.angleRadius = 1;
                estado.anguloInvisivel2.angleRadius = 1;
            }

            estado.anguloInvisivel1.vertices = estado.trianguloInvisivel1.vertices;
            estado.anguloInvisivel2.vertices = estado.trianguloInvisivel2.vertices;

            estado.anguloInvisivel1.addToScene(fase.scene);
            estado.anguloInvisivel2.addToScene(fase.scene);

            estado.anguloInvisivel1.update();
            estado.anguloInvisivel2.update();

            estado.anguloInvisivel1.mesh.visible = false;
            estado.anguloInvisivel2.mesh.visible = false;


            fase.hoverInvisivel1 = new Hoverable(estado.anguloInvisivel1, fase.camera)
            fase.hoverInvisivel2 = new Hoverable(estado.anguloInvisivel2, fase.camera)
        }

        //Anima o desenhar tracejado
        function animacaoTracejado(tracejado, posicao, vetorTracejado1, estado){

            // animação
            estado.desenharTracejado = new Animacao(tracejado)
                .setValorInicial(0)
                .setValorFinal(10)
                .setDuration(50)
                .setInterpolacao((inicial, final, peso) => inicial * (1 - peso) + final*peso)
                .setUpdateFunction((progresso) => {
                    tracejado.origem = posicao.clone().sub(vetorTracejado1.clone().normalize().multiplyScalar(progresso))
                    tracejado.destino = posicao.clone().add(vetorTracejado1.clone().normalize().multiplyScalar(progresso))
                    tracejado.update();
                })
                .setCurva((x) => x < 0.5
                                ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
                                : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2
                )
                .voltarAoInicio(false);
            
            fase.animar(estado.desenharTracejado);
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

    medirDistanciaArraste(vertice, limite=0){

        return new Output()
                   .addInputs(vertice.draggable)
                   .setUpdateFunction(function(novoEstado){

                        const estado = this.estado;


                        if(novoEstado.dragging){

                            const distanciaPercorrida = novoEstado.position.clone()
                                                                           .sub(estado.position)
                                                                           .length();

                            estado.distanciaPercorrida += distanciaPercorrida;
                            
                        }

                        if(estado.distanciaPercorrida >= limite){
                            
                            this.notify({
                                distancia: estado.distanciaPercorrida,
                                limiteAtingido: true,
                                alvo: 'medirDistancia'
                            });
                        }
                   })
                   .setEstadoInicial({
                        position: vertice.getPosition(),
                        distanciaPercorrida: 0
                   })
    }

    //Controla a mudança do fluxo dos problemas
    //REFATORAR: criar depois um controle para transição entre configurações
    controleGeral(){

        //Inputs: os 3 criarTracejados -> quando um deles atualiza, notifica esse output também

        const fase = this;

        return new Output()
               .addInputs(...fase.outputCriarTracejado)
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.arrastarVertices){
                        fase.arrastarVerticesDialogo();
                    }

                    else if(estado.triangulosProvados >= 2){
                        fase.final();
                        fase.Configuracao4();
                    }

                    else if(estado.angulosArrastados >= 2){
                        estado.angulosArrastados = 0;
                        estado.triangulosProvados++;

                        const atualizar = () => {
                            this.removeInputs();
                            fase.informacao.criarTracejadoSelecionado.update({clicado: true});
                            fase.Configuracao1c();
                            this.update({}) //Verifica triangulosProvados >= 2
                        }

                        fase.aula4c().setOnTermino(atualizar);

                    }

                    else if(novoEstado.alvo == 'arrasteAngulo'){
                        estado.angulosArrastados++;
                        fase.Configuracao2b(novoEstado);
                        this.update({}); //Verifica angulos arrastados >= 2
                    }

                    else if(novoEstado.alvo == 'medirDistancia'){
                        fase.aula4a();
                        fase.Configuracao1c({});
                        estado.etapa = 'aula4';
                    }

                    else if(novoEstado.terminadoDialogo && estado.etapa == "inicio"){
                        estado.etapa = "aula1";
                        fase.Configuracao1();
                        return;
                    }
                    
                    else if(novoEstado.tracejadoAtivado){

                        //Transformar isso num output composto?
                        if(estado.etapa == "aula4") {
                            fase.Configuracao2(novoEstado)
                            fase.aula4b();
                        }
                        else{

                            fase.Configuracao1b(novoEstado);

                            if(estado.etapa == "aula1"){

                                estado.etapa = "aula2"

                                fase.aula2();
                            }
                        }                        

                        return;
                    }

                    else if(novoEstado.tracejadoAtivado == false){

                        //Mudar para vericar não etapa mas um checkpoint
                        if(estado.etapa == "aula4"){
                            estado.angulosArrastados = 0;
                            fase.Configuracao1c(novoEstado);
                        } 
                        else
                            fase.Configuracao1();
                    }

                    else if(novoEstado.trianguloDividido){

                        estado.etapa = "mostrarIgualdade";
                        fase.aula3();
                        return;
                    }

                    else if(novoEstado.juntarEquacoes){
                        estado.etapa = "juntarEquações"
                        fase.juntarEquacoesDialogo();
                        return;
                    }
               })
               .setEstadoInicial({
                    etapa: "inicio",
                    angulosArrastados:0,
                    triangulosProvados: 0,
               })
    }
    
    controleEquacoes(){
        
        const fase = this;

        const equacao1 = new ElementoCSS2D(fase.whiteboard.equacoes[0], fase.whiteboard);
        const equacao2 = new ElementoCSS2D(fase.whiteboard.equacoes[1], fase.whiteboard);

        const angulos = fase.informacao.equacoes.flatMap(equacao => equacao.angulos);

        const temp = angulos[2]; angulos[2] = angulos[3]; angulos[3] = temp;

        const soma = angulos.reduce((equacao, angulo) => new Addition(equacao, angulo));
        const equacao = new Equality(soma, new Addition(new Variable('90°'), new Variable('90°')));

        const juncao1 = new JuntarEquacoes(equacao1, [equacao2], fase);
        const juncao2 = new JuntarEquacoes(equacao2, [equacao1], fase);

        juncao1.equacaoNova = new CSS2DObject(equacao.html);
        juncao2.equacaoNova = new CSS2DObject(equacao.html);

        const sidenote = fase.createTextBox('', [-5.6, 0.6, 0], 17, false);

        fase.animar(new MostrarTexto(sidenote, fase.scene));


        return new Output()
                .addInputs(juncao1, juncao2)
                .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.novaEquacao && estado.etapa == 0){

                        const objetoEquacao = new ElementoCSS2D(novoEstado.novaEquacao, fase.whiteboard)
                        
                        const resultado = new Equality(soma, new Variable("180°"));

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase);

                        resolverEquacao.equacaoNova = new CSS2DObject(resultado.html);

                        estado.equacaoAtual = resultado;
                        

                        this.addInputs(resolverEquacao);

                        estado.etapa++;

                        const mudarSidenote = fase.animacaoDialogo("Clique mais uma vez", estado.sidenote)

                        fase.animar(mudarSidenote);


                    }

                    else if(novoEstado.novaEquacao && estado.etapa == 1){
                        //Mostrar que a soma dos três angulos é 180°

                        const indice = fase.triangulo.vertices.indexOf(fase.informacao.verticeSelecionado)

                        const anguloSelecionado = new Variable(Math.round(fase.triangulo.angles[indice].degrees) + "°")
                        
                        const novaEquacao = new Equality(
                                                new Addition(
                                                    new Addition(
                                                        angulos[0], 
                                                        anguloSelecionado
                                                    ), 
                                                    angulos[2]
                                                ),
                                                new Variable("180°"));

                        estado.equacaoAtual = novaEquacao;

                        const objetoEquacao = new ElementoCSS2D(novoEstado.novaEquacao, fase.whiteboard)

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase);

                        resolverEquacao.equacaoNova = new CSS2DObject(novaEquacao.html);

                        resolverEquacao.ativar(false);

                        this.addInputs(resolverEquacao);

                        estado.etapa++;

                        //Transformar isso em dialogo auxiliar?
                        const dialogoMostrando180graus = fase.dialogoMostrando180Graus()
                                                             .setOnTermino(() => {
                                                                resolverEquacao.ativar(true)

                                                                const mudarSidenote = fase.animacaoDialogo("Clique mais uma vez", estado.sidenote)

                                                                fase.animar(mudarSidenote);
                                                            });
                        
                        fase.animar(dialogoMostrando180graus);

                        const apagarSidenote = new MostrarTexto(sidenote).reverse();

                        fase.animar(apagarSidenote);

                    }

                    else if(novoEstado.novaEquacao && estado.etapa == 2){

                        const apagarSidenote = apagarCSS2(sidenote, fase.scene);

                        fase.animar(apagarSidenote);

                        //Mostrar dois subangulos se juntando para formar o angulo selecionado
                        fase.transformar180GrausEmFormula(estado.equacaoAtual)
                        
                    }
                })
                .setEstadoInicial({
                    etapa: 0,
                    sidenote: sidenote,
                    equacaoAtual: equacao
                })
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////     Animações     ////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    //Gira pra cima e pra baixo, volta ao início
    animacaoGirarAngulo(angle){

        const quaternionInicial = angle.mesh.quaternion.clone();
        const quaternionFinal   = angle.mesh.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,-1), 0.3));

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

        const mostrarTriangulo = new ApagarPoligono(subtriangulo1,false)
                                    .reverse()
                                    .setOnStart(() => subtriangulo1.addToScene(this.scene));

        //Desenhar subtriângulo2
        //Mostrar que eles são congruentes com os triângulos externos (usar Carta?)
        const subtriangulo2 = new Poligono([vertice.getPosition(), vertice3.getPosition(), pontoDeDivisao.clone()])
                                 .configuration({grossura:0.026, raioVertice:0.04, raioAngulo:0.7}) //Grossura levemente maior para sobrepor a aresta original
                                 .render();

        subtriangulo2.angles.map(angle => angle.material.color = 0x00b7eb);

        const mostrarTriangulo2 = new ApagarPoligono(subtriangulo2,false)
                                    .reverse()
                                    .setOnStart(() => subtriangulo2.addToScene(this.scene));

        this.subtriangulo1 = subtriangulo1;
        this.subtriangulo2 = subtriangulo2;
        this.tracejadoDivisao = tracejado;

        this.Configuracao4({
            subtriangulo1: subtriangulo1, 
            subtriangulo2: subtriangulo2,
            mostrarAngulo: mostrarAngulo, 

            //Vamos usar esse para quando mover o angulo, também mover suas cópias
            mostrarAngulosAfastados: [
                this.outputMostrarAngulo[(indice+1)%3], //Angulo copiado do subtriangulo1
                this.outputMostrarAngulo[(indice+2)%3]  //Angulo copiado do subtriangulo2
            ]
        })

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
                            mostrarTriangulo.setOnTermino(()=> tracejado.removeFromScene()), 
                            mostrarTriangulo2
                        )

        animacao.setOnTermino(() => {
            fase.triangulo.angles.map(angle=> angle.material.visible = false);
            fase.controleFluxo.update({trianguloDividido: true})
        });

        return animacao;
    }

    reverterTriangulo(){

        const fase = this;

        this.debug = false;

        const indice = fase.triangulo.vertices.indexOf(fase.informacao.verticeSelecionado);

        fase.triangulo.angles.map(angle => angle.update());
        fase.triangulo.angles.map(angle => angle.material = new THREE.MeshBasicMaterial({color:0xff0000}));

        fase.whiteboard.ativar(false);

        const angulosAuxiliares = [this.subtriangulo1.angles[1], this.subtriangulo2.angles[1]];

        const angulosOriginais  = fase.triangulo.angles.filter((angulo, numero) => numero != indice);

        const apagarAngulos   = new AnimacaoSimultanea()
                                    .setAnimacoes(angulosAuxiliares.map(angulo => apagarObjeto(angulo, fase.scene)));

        const aparecerAngulos = new AnimacaoSimultanea()
                                    .setAnimacoes(angulosOriginais.map(angulo => apagarObjeto(angulo).reverse()))

        const desaparecerGraus = new AnimacaoSimultanea()
                                     .setAnimacoes(angulosAuxiliares.map(angulo => fase.mostrarGrausDesaparecendo(angulo)));

        const aparecerGraus = new AnimacaoSimultanea()
                                      .setAnimacoes(angulosOriginais.map(angulo => fase.mostrarGrausAparecendo(angulo)));

        //Em alguma animação apagar o material ficou com opacidade 0, resetando
        const atualizarMaterialDosAngulos = () => {
            fase.triangulo.angles.map(angle => angle.update());
            fase.triangulo.angles.map(angle => angle.material = new THREE.MeshBasicMaterial({color:0xff0000}));
            fase.triangulo.angles.map(angle => angle.mesh.material = new THREE.MeshBasicMaterial({color:0xff0000}));
        }

        atualizarMaterialDosAngulos();

        return new AnimacaoSimultanea(
                    apagarAngulos, 
                    aparecerAngulos, 
                    desaparecerGraus, 
                    aparecerGraus
              )
              .setOnTermino(atualizarMaterialDosAngulos)
    }

    
    mostrarEApagar180Graus(vertice, angulos){

        const fase = this;

        const sentidoTracejado = fase.informacao.sentido;
        
        //Gambiarra, ao invés de criar só o ângulo, cria o triângulo dele e o extrai posteriormente
        const triangulo = new Triangle([
            vertice.getPosition(),
            vertice.getPosition().add(sentidoTracejado.normalize()),
            vertice.getPosition().sub(sentidoTracejado.clone()
                                                        .add(
                                                            sentidoTracejado
                                                            .clone()
                                                            .crossVectors(
                                                                sentidoTracejado.clone(), 
                                                                new THREE.Vector3(0,0,1)
                                                            )
                                                            .multiplyScalar(0.01)
                                                        )
                                                      .normalize()
                                    )
        ].map(position => position.toArray()))

        triangulo.render();      
        
        const angulo180graus = triangulo.angles[0];

        angulo180graus.angulo = Math.PI;
        angulo180graus.mesh.position.z = 0.05

        const mostrar180Graus = apagarObjeto(angulo180graus)
                                .setOnStart(() => angulo180graus.addToScene(this.scene))
                                .reverse();

        const apagar180Graus  = apagarObjeto(angulo180graus)
        .setOnTermino(() => angulo180graus.removeFromScene())

        const brilharMetalico = new MetalicSheen(angulo180graus);

        const desaparecerGraus = new AnimacaoSimultanea().setAnimacoes(angulos.map(angulo => this.mostrarGrausDesaparecendo(angulo).setOnTermino(() => null)))

        const reaparecerGraus  =  new AnimacaoSimultanea()
                                  .setAnimacoes([
                                                    ...angulos
                                                    .map(angulo => this.mostrarGrausAparecendo(angulo,false,false)
                                                                              .setOnStart(() => null)
                                                    ), 
                                                    apagar180Graus
                                                ]);
                        

        return new AnimacaoSequencial(
                    mostrar180Graus, 
                    new AnimacaoSequencial(
                        new AnimacaoSimultanea(
                            new AnimacaoSequencial(
                                desaparecerGraus, 
                                this.mostrarGrausAparecendo(angulo180graus).setDuration(200),
                                this.mostrarGrausDesaparecendo(angulo180graus)

                            ),
                            brilharMetalico,
                        ),
                        reaparecerGraus,
                        // this.moverGrausParaPosicaoEquacao(angulos)
                    ),
                )
                .setCheckpointAll(false)

    }

    animar180Graus(){


        const fase = this;

        const index   = fase.outputCriarTracejado.map((output,indice) => (output.estado.ativado)? indice : -1)
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
        const desligarTracejado = () => fase.outputCriarTracejado.forEach(output => (output.ativado)? output.update({clicado:true}) : null);

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

    moverAnguloAnimacao(angle, origem, destino){


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

    //Gira 90°, não volta
    girarAngulo(angulo){

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
            .setOnStart(() => angulo.addToScene(this.scene))

        return animacaoRodaeMoveAngulo;

    }

    mostrarGrausAparecendo(angle, updateMostrarAnguloCadaFrame = false, mostrarEdesaparecer=false){


        if(!angle.mostrarAngulo){

            angle.mostrarAngulo = new MostrarAngulo(angle).addToFase(this);
        }

        const mostrarAngulo = angle.mostrarAngulo;

        const aparecerTexto = new Animacao()
                                .setValorInicial(0)
                                .setValorFinal(1)
                                .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                                .setUpdateFunction((valor) => {

                                    mostrarAngulo.text.elemento.element.style.opacity = valor

                                    if(updateMostrarAnguloCadaFrame) mostrarAngulo.update({dentro:true});
                                })
                                .setDuration(55)
                                .setDelay(5)
                                .setCurva(x => {

                                    x = 1 - Math.abs(1 - x*2)

                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
                                .voltarAoInicio(false)
                                .manterExecucao(false)
                                .setOnDelay(() => mostrarAngulo.update({dentro:false}))
                                .setOnStart(() => {
                                    mostrarAngulo.update({dentro:true});

                                })

        if(!mostrarEdesaparecer){
            aparecerTexto.setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
            aparecerTexto.setOnTermino(() => null)
            aparecerTexto.setOnDelay(() => null)
        }

        return aparecerTexto;

    }

    mostrarGrausDesaparecendo(angle){
        return  this.mostrarGrausAparecendo(angle)
                    .reverse()
                    .voltarAoInicio(false)
                    .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                    .setOnStart(() => null)
    }


    //Refatorar essa monstruosidade aqui depois
    //Problema: dois ângulos de 45° vão para o mesmo valor da equação, melhorar checagem
    //Problema: angulos aparecem e desaparecem de novo quando termina o arraste da equação
    //Problema: ou a spline está grande demais, ou é muito lenta
    moverGrausParaPosicaoEquacao(angulos){

        const fase = this;

        angulos.forEach(angulo => {
            angulo.mostrarAngulo.text.elemento.element.style.fontFamily = "Courier New, monospace";
            angulo.mostrarAngulo.text.elemento.element.style.fontSize   = "18px";
        })

        const moverTexto = (angulo) => {
                                        const mover = new MoverTexto().voltarAoInicio(true)
                                        
                                        
                                        const elementoCSS2 = angulo.mostrarAngulo.text.elemento;

                                        mover.setText(elementoCSS2)

                                        return mover;
                                    }

        const spline = [
            new THREE.Vector3(1.473684210526315, -2.2692913385826774, 0),
            new THREE.Vector3(-0.39766081871345005, -0.6944881889763783, 0),
            // new THREE.Vector3(3.5,2,0)
        ]

        const mover1 = moverTexto(angulos[0]);
        const mover2 = moverTexto(angulos[1]);
        // const mover3 = moverTexto(angulos[2]);

        var novoElemento = null;

        return new AnimacaoSequencial(
                new AnimacaoSimultanea(
                        mover1,
                        mover2,
                        // mover3
                )
                .setOnStart(criarEquacao),
                animacaoIndependente( () => fase.animar(mostrarEquacaoEMoverParaWhiteboard()), 405, 0)
            )


        //Funções auxiliares

        function criarEquacao(){
            const valores = angulos.map( angulo => angulo.mostrarAngulo.text.elemento.element.textContent);

            const x = new Variable(valores[0]);
            const y = new Value(valores[1]);
            // const z = new Value(valores[2]);

            const equacao = new Equality(
                                new Addition(
                                    x,
                                    y
                                ),
                                new Value("90°")
                            )

            //Gambiarra colocando os valores dessa equacao no final
            if(!fase.informacao.equacoes) fase.informacao.equacoes = []
            fase.informacao.equacoes.push({equacao:equacao, angulos:[x,y], angulosObjetos: angulos})

            novoElemento = new CSS2DObject(equacao.html);

            novoElemento.position.copy(new THREE.Vector3(0,0,0));

            novoElemento.equacao = equacao;

            

            // fase.scene.add(novoElemento);

            fase.equacao = equacao;

            fase.operadores.expression = equacao;

            for(const node of equacao.nodes){

                node.comeco = equacao.element.textContent.indexOf(node.element.innerText);
            }

            const getPosition = (subelemento) => {
                const deslocamento = calcularDeslocamento(equacao,subelemento);

                const posicao = novoElemento.position.clone().add(deslocamento)

                return posicao;
            }

            mover1.setSpline([
                mover1.elementoTexto.position.clone(),
                ...spline,
                getPosition(x)
            ])

            mover2.setSpline([
                mover2.elementoTexto.position.clone(),
                ...spline,
                getPosition(y)

            ])

            // mover3.setSpline([
            //     mover3.elementoTexto.position.clone(),
            //     ...spline,
            //     getPosition(z)
            // ])
        }


        function calcularDeslocamento(equacao, subequacao){

            const tamanho      = equacao.element.textContent.length;
            const deslocamento = subequacao.comeco + subequacao.element.innerText.length/2;

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font = '18px Courier New, monospace'

            const medidas = context.measureText(equacao.element.textContent)

            const width = medidas.width;

            const height = medidas.actualBoundingBoxAscent;

            const offset = (deslocamento/tamanho - 0.5)*width;

            const point = fase.pixelToCoordinates(fase.width/2 + offset, fase.height/2 - 18); //18 é o tamanho da fonte em pixeis


            //VERIFICAR BUGS, MODIFICAR CENTRO DA CÂMERA PROVAVELMENTE É DESVIO
            return new THREE.Vector3(point.x,point.y - 1, 0); // por algum motivo o y é 1 se for metade da altura
        }

        function mostrarEquacaoEMoverParaWhiteboard(){

            fase.whiteboard.adicionarEquacao(novoElemento.equacao)

            //Consertar depois, está debaixo da whiteboard
            // novoElemento.element.style.zIndex = 10000;

            fase.scene.add(novoElemento);



            
            const spline = [
                new THREE.Vector3(-2, -0.3937007874015752, 0),
                new THREE.Vector3(-4.432748538011696,  0.36771653543307, 0),
                // new THREE.Vector3(3.5,2,0)
            ]


            const mostrarTexto = new MostrarTexto(novoElemento)
                                    .setValorFinal(300)
                                    .setProgresso(0)
                                    .setDuration(150);

            const voltarAngulos = angulos.map(angulo => fase.mostrarGrausAparecendo(angulo,false,false))

            const voltarAngulosAnimacao = new AnimacaoSimultanea()
                                              .setAnimacoes(voltarAngulos);

            const moverEquacaoParaDiv = new MoverTexto(novoElemento)
                                        .setOnStart(function(){
                                            const equacaoDiv   = fase.whiteboard.equacoes.slice(-1)[0].element;

                                            const dimensoes    = equacaoDiv.getBoundingClientRect();

                                            const posicaoFinal = fase.pixelToCoordinates((dimensoes.right + dimensoes.left)/2, (dimensoes.top + dimensoes.bottom)/2)

                                            this.setSpline([
                                                novoElemento.position.clone(),
                                                ...spline,
                                                posicaoFinal
                                            ])

                                            // fase.whiteboard.equationList.children[0].style.display = "none"
                                            

                                        })
                                        .setOnTermino(() =>{
                                            fase.scene.remove(novoElemento);
                                            // fase.whiteboard.equationList.children[0].style.display = "block"
                                            fase.whiteboard.ativar(true);
                                        })


            const animacao = new AnimacaoSequencial(
                                mostrarTexto, 
                                voltarAngulosAnimacao,
                                moverEquacaoParaDiv,
                                
                                animacaoIndependente()
                                .setDuration(30)
                                .setDelay(0)
                                .setOnTermino(() => fase.whiteboard.ativar(false))
                            )

            animacao.setCheckpointAll(false);

            return animacao;
        }

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
}