import { Triangle } from "../objetos/triangle"
import { Fase } from "./fase";
import { Poligono } from "../objetos/poligono";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import DesenharPoligono from "../animacoes/DesenharPoligono";
import { TextoAparecendo } from "../animacoes/textoAparecendo";
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea, animacaoIndependente } from "../animacoes/animation";
import { colorirAngulo } from "../animacoes/colorirAngulo";
import { MostrarAngulo } from "../outputs/mostrarAngulo";
import { apagarObjeto } from "../animacoes/apagarObjeto";
import { Divisao } from "../animacoes/divisao";
import * as THREE from 'three'
import { ApagarPoligono, apagarPoligono } from "../animacoes/apagarPoligono";
import { Clickable } from "../inputs/clickable";
import { Draggable } from "../inputs/draggable";
import MoverVertice from "../outputs/moverVertice";
import { Angle } from '../objetos/angle';
import { Output } from '../outputs/Output';
import {Hoverable} from '../inputs/hoverable';
import { Tracejado } from '../objetos/tracejado';
import Circle from "../objetos/circle";
import DesenharMalha from "../animacoes/desenharMalha";
import MetalicSheen from "../animacoes/metalicSheen";
import MoverTexto from "../animacoes/moverTexto";
import { Addition, Equality, Minus, Value, Variable } from "../equations/expressions";
import MostrarTexto from "../animacoes/MostrarTexto";
import { Operations } from "../equations/operations";
import Bracket from "../objetos/bracket";
import {apagarCSS2} from "../animacoes/apagarCSS2";
import ElementoCSS2D from "../objetos/elementocss2d";
import MostrarValorAresta from "../outputs/mostrarValorAresta";
import MostrarNomeVertice from "../outputs/mostrarNomeVertice";
import JuntarEquacoes from "../outputs/juntarEquacoes";
import { LadoParalogramo } from "../cards/ladoParalelogramo";
import { AnguloParalogramo } from "../cards/anguloParalelogramo";
import imagemParalelogramoLado from '../../assets/CartaParalalogramoLado.png'
import imagemAnguloParalelogramo from '../../assets/anguloParalelogramo.png'
import { SomaDosAngulosTriangulo } from "../cards/somaDosAngulos";
import { CriarTriangulo } from "../cards/criarTriangulo";
import ResolverEquacao from "../outputs/resolverEquacao";



export class PrimeiraFase extends Fase{

    constructor(){
    
        super();

        this.setupTextBox();
        this.changeText("");

        this.progresso = 0;
        this.textBoxes = {};

        this.setupObjects();
        this.createInputs();
        this.createOutputs();

        this.outputTesteClick();
        this.pilhaDeCartas = [] //Talvez criar uma classe para isso, o baralho

        this.debug = false;
        this.debugProblem = 30;

        this.controleFluxo = new this.ControleGeral(this);

        //A fazer:
        //Debugar problema da hitbox do angulo deletada -> Consertado
        //Mudar dialogo para comportar novas funcionalidades
        //Generalizar a parte de juntar equações
        //Transformar todo array em vetor do threejs, muito propício a falha 
    }

    cartas = [
        LadoParalogramo,
        AnguloParalogramo
        // Adicione mais cartas conforme necessário
    ];

    //Objetos básicos
    setupObjects(){


        const pi = Math.PI;

        this.pentagono  = new Poligono([
                            [0    ,   3   ,     0],
                            [pi   ,   pi  ,     0],
                            [pi   ,-pi*0.7,     0],
                            [-pi/2,-pi/2  ,     0], 
                            [-2   , 0     ,     0]
                        ])
                        .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                        .render()
                        .escala(0.3,0.5,0)
                        .translacao(-1,-1,0)

        this.pentagono2  = new Poligono([
                            [0    ,   3   ,     0],
                            [pi   ,   pi  ,     0],
                            [pi   ,-pi*0.7,     0],
                            [-pi/2,-pi/2  ,     0], 
                            [-2   , 0     ,     0]
                        ])
                        .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                        .render()
                        .escala(0.6005,1.002,0)
                        .translacao(2,-0.5,0);

        this.triangulo2 = new Poligono([
                            [-pi/2,-pi/2  ,     0], 
                            [pi   ,   pi  ,     0],
                            [pi   ,-pi*0.7,     0],
                        ])
                        .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                        .render()
                        .escala(0.3,0.5,0)
                        .translacao(-1,-1,0)


        this.triangulo = new Poligono([
                            [-pi/2,-pi/2  ,     0],
                            [pi   ,   pi  ,     0],
                            [pi   ,-pi*0.7,     0],
                          ])
                          .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.7})
                          .render()
                          .escala(0.605,1.01,0)
                          .translacao(2,-0.5,0);

        this.textBoxes.primeiroDialogo = [];

        const offsetx = Math.cos(pi*70/180)*4;
        const offsety = Math.sin(pi*70/180)*4;

        this.paralelogramo1 = new Poligono([
                                [0,0,0],
                                [offsetx, offsety,0],
                                [10+offsetx, offsety,0],
                                [10,0,0]
                              ])
                              .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                              .render()
                              .escala(0.2,0.2,0.2)
                              .translacao(-2, 1.5, 0)


        this.paralelogramo2 = new Poligono([
                                [0,0,0],
                                [offsetx, offsety,0],
                                [10+offsetx, offsety,0],
                                [10,0,0]
                              ])
                              .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.3})
                              .render()
                              .escala(0.6,0.6,0.6)
                              .translacao(-4,-2,0)

        this.objetos = [this.paralelogramo1, this.paralelogramo2];
    }

    //Objetos temporários ou secundários
    setupObjects2(){

        const vertexPositions = this.triangulo.vertices.map(vertice => vertice.getPosition().toArray());

        this.triangulo2 = new Poligono(vertexPositions)
                          .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                          .escala(0.5,0.5,0.5)
                          .translacao(-3,0,0);

        console.log(this.triangulo2.positions)

        this.triangulo2.render();
    }

    //Onde toda a lógica da fase é realizada, a sequência de animações/texto
    levelDesign(){

        const dialogo1 = [
            "Vimos que dois poligonos são semelhantes quando seus ângulos são congruentes(iguais  overtext )",
            "e seus respectivos lados são proporcionais.", 
            "Como os triângulos são os polígonos mais simples,",
            "também são os mais fáceis de ver se são semelhantes."
        ]

        const dialogo2 = [
            "Precisamos que os ângulos sejam iguais e os lados proporcionais para termos semelhança",
            "Se soubermos dois ângulos, conseguimos descobrir o terceiro",
            "Vimos isso na soma dos ângulos sendo igual a 180°",
            "Assim, tente mover os ângulos como na última fase:",
            
        ]

        const dialogo3 = [
            "Arraste os ângulos para os buracos perto do tracejado",
            "Muito bom!",
            "Agora faça o mesmo para o ângulo restante"
        ]

        const dialogo4 = [
            "Como pode ver, os ângulos somam 180°, como a carta já dizia",
            "Agora clique nos ângulos vermelhos para apagá-los"
        ]

        const dialogo5 = [
            "Como acabou de ver, dois ângulos determinam um terceiro no triângulo",
            "E com três ângulos temos um único tipo de triângulo",
            "Agora use a carta de proporcionalidade para ver o que isso significa"
        ]

        const dialogo6 = [
            "Está vendo o triângulo maior, ele tem os mesmos ângulos que o primeiro",
            "Tente arrastar o slider para aumentar o tamanho do primeiro"
        ]

        const dialogo7 = [
            "Como pode ver, o segundo triângulo é apenas uma versão maior do primeiro",
            "Eles são semelhantes",
            "Todo triângulo com os mesmos três ângulos é o um só, apenas mudando a escala",
            "Como dois ângulos determinam o terceiro,", //Glow nos dois vermelho, glow azul no terceiro, revesar entre os três
            "Dois ângulos iguais significam triângulos semelhantes", //Mostra parte da carta aparecendo 
            "Esse é o primeiro caso de semelhança, AA (Ângulo Ângulo), vamos ver os outros"
        ]

        const dialogo8 = [
            "O segundo caso de semelhança de triângulos é bem simples",
            "LLL (três lados proporcionais)", //glowup dos lados mostrando a razão entre eles
            "Como pode ver, ele também é só uma escala",
            "Arraste o slider e observe a proporcionalidade",
            "Conseguimos então o segundo caso" //Mostra outra parte da carta aparecendo 
        ]

        const dialogo9 = [
            "O terceiro caso é o de dois lados do mesmo angulo proporcionais, LAL.", //Glow up dos lados do ângulo
            "Perceba, é possível pegar esses dois lados e prolongá-los",
            "e assim se obtem o segundo triângulo",
            "Tente arrastar os lados",
            "Conseguimos o ultimo caso" //Mostra a ultima parte da carta
        ]

        const dialogo10 = [
            "Com isso temos nossa nova carta, semelhança de triângulos.", //(mostra a carta) 
            "Se satisfazer algum dos três casos, então dois triângulos são semelhantes.", //Rapidamente ilustra cada um ao lado
            "Use ela livremente para resolver os problemas a seguir"
        ]
    }

    aula1(){

        const fase = this;


        //Extende o diálogo e divide em vários subproblemas
        const dialogo1 = [
            "Vimos que dois poligonos são semelhantes quando seus ângulos são congruentes",
            "e seus respectivos lados são proporcionais.", 
            "Junte angulos iguais e lados proporcionais no menu de equações",
            "Basta arrastar uma equação para ficar em cima da outra",
            // //Verifique se os polígonos são semelhantes
            // "Como os triângulos são os polígonos mais simples,",
            // "também são os mais fáceis de ver se são semelhantes."
        ]

        //Todas as equações em latex usadas nessa aula
        const equacoes = {
            ladosIguais: ` {\\color{purple} RAZÃO = 
                            \\frac {{\\color{blue}Lado~Poligono~2}}
                            {{\\color{red} Lado~Poligono~1}}= \\Large{2}}`,

            angulosIguais: `~{\\color{red}~Todos~Ângulos~ do ~P1} = 
                            ~{\\color{blue}~Todos~Ângulos~ do~ P2}`,

            compararAngulos: (index, valorDoAngulo) => 
                            `Ângulo~ {\\color{red}${index + 1}} ~   do ~P1 = 
                            Ângulo~ {\\color{blue} ${index + 1}} ~ do~ P2 = 
                            {\\color{purple} ${valorDoAngulo}°} `,
            
            semelhanca: `{\\color{purple}~Figuras~Semelhantes~(P1 , P2)}`
        }

        //Desenhar um polígono pequeno, desenhar outro polígono maior
        //highlight dos ângulos respectivos em cada triângulo
        //highlight dos lados 

        const animarDialogo = dialogo1.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)).setValorFinal(100));

        const desenharPoligonos = new AnimacaoSimultanea(
                                    new DesenharPoligono(this.pentagono,  fase.scene), 
                                    new DesenharPoligono(this.pentagono2, fase.scene).filler(50)
                                  );

        //Mostra os Angulos iguais em cada poligono
        //Escreve equação de igualdade do ângulo ao mesmo tempo
        const mostrarAngulos = this.animacaoColorirAngulosIguais(this.pentagono,this.pentagono2, equacoes);

        const primeiraLinha = new AnimacaoSequencial(
                                    new AnimacaoSimultanea(animarDialogo[0], desenharPoligonos), 
                                    mostrarAngulos
                              )


        const dividirLados = this.animacaoDividirLadosIguais(this.pentagono, this.pentagono2);

        //Refinar adicionando contador abaixo da divisão
        //Todos eles vão contar para 2
        //Mostrar isso como a proporção de semelhança entre as duas figuras
        const segundaLinha = new AnimacaoSimultanea(
                                animarDialogo[1],
                                dividirLados
                            )

        const terceiraLinha = new AnimacaoSequencial(animarDialogo[2])
                              .setOnStart(criarControleJuntarEquacoes)
                              .setOnTermino(() => fase.whiteboard.ativar(true));

        const quartaLinha   = animarDialogo[3];

        //Cada um desses limpa as equações da tela e coloca a equação resultante
        const TodosOsAngulosIguais = fase.animacaoEquacoesVirandoUmaSo("primeiroDialogo", equacoes.angulosIguais, 3);
        const TodosOsLadosIguais   = fase.animacaoEquacoesVirandoUmaSo("mostrarRazaoLados", equacoes.ladosIguais, 1);

        const animacao = new AnimacaoSequencial(
                            primeiraLinha,
                            TodosOsAngulosIguais,
                            segundaLinha.filler(100),
                            TodosOsLadosIguais,
                            terceiraLinha,
                            quartaLinha
                        )

        this.animar(animacao.setNome("Execução Principal"));


        function criarControleJuntarEquacoes() {

            const equacao1 = new ElementoCSS2D(fase.whiteboard.equacoes[0], fase.whiteboard);
            const equacao2 = new ElementoCSS2D(fase.whiteboard.equacoes[1], fase.whiteboard);

            const arraste1 = new JuntarEquacoes(equacao1, [equacao2], fase);
            const arraste2 = new JuntarEquacoes(equacao2, [equacao1], fase);

            arraste1.tamanhoFonte = 5;
            arraste2.tamanhoFonte = 5;

            const mudarProblema = new Output()
                                 .addInputs(arraste1, arraste2)
                                 .setUpdateFunction(() => {
                                    fase.progresso = 2
                                    
                                })
        }
    }

    aula2(){

        const fase = this;

        const dialogo2 = [
            "Com essas duas propriedades temos semelhança",
            "Vamos testar para outro exemplo?",
            "Só que dessa vez, vamos fazer juntos",
            "Verifique se os paralelogramos ABCD e XYZW são semelhantes",
            "Para isso, as cartas a seguir são úteis, basta arrastá-las para as figuras"
        ]

        const unidadeMedida = {
            razao: () => 4*1/this.paralelogramo1.edges[0].length, //Razão utilizada para calcular medidas 

            cm: (medida) => `${Math.round(medida * unidadeMedida.razao())}cm`
        }

        //A Fazer:
        //Adicionar mostrarAngulo nos dois paralelogramos
        //Criar um handler que mostra o tamanho de um certo segmento de reta -> feito
        //Criar um handler que mostra o nome de um vértice -> feito
        //Criar propriedade paralelogramo => lados paralelos => DA = CB e AB = DC  -> feito
        //Criar propriedade paralelogramo => angulos iguais dos lados paralelos  -> feito
        //Criar interação obter razão de dois lados 
        //Com todas as razões => juntar para formar todos os lados proporcionais
        //Todos os lados proporcionais junta com angulos iguais para gerar semelhança
        //Criar propriedades negativas (não semelhança)?

        const dialogosAnimados = dialogo2.map(texto => new TextoAparecendo(fase.text.element)
                                                        .setOnStart(() => fase.changeText(texto))
                                                        .setValorFinal(100)
                                        );

        const apagarPoligonos = new AnimacaoSimultanea(
                                    new ApagarPoligono(fase.pentagono), 
                                    new ApagarPoligono(fase.pentagono2)
                                )
                                .setOnStart(() => fase.whiteboard.ativar(false))
                                .setOnTermino(() => {fase.pentagono.removeFromScene(); fase.pentagono2.removeFromScene()})
        
        const primeiraLinha = dialogosAnimados[0];

        const segundaLinha  = new AnimacaoSimultanea(
                                dialogosAnimados[1],
                                apagarPoligonos
                            );

        const terceiraLinha = dialogosAnimados[2];


        const desenharPoligonos = new AnimacaoSimultanea(
                                    new DesenharPoligono(fase.paralelogramo1,fase.scene), 
                                    new DesenharPoligono(fase.paralelogramo2,fase.scene).filler(50)
                                );

        const mostrarInformacoes = animacaoIndependente(() => {

            const mostrarNomeVertices = new AnimacaoSimultanea()
                                    .setAnimacoes(fase.mostrarNomeDosVertices.map(mostrar => mostrar.animacao()));

            const mostrarValorArestas = new AnimacaoSimultanea()
                                    .setAnimacoes(fase.mostrarValorDosLados.map(mostrar => mostrar.animacao()));

            fase.animar(mostrarNomeVertices);
            fase.animar(mostrarValorArestas.filler(20));

        }, 60, 0);

        const quartaLinha   = new AnimacaoSimultanea(
                                new AnimacaoSequencial(
                                    desenharPoligonos,
                                    mostrarInformacoes
                                ),
                                dialogosAnimados[3]
                            ).setOnStart(() => fase.Configuracao6({unidadeMedida: unidadeMedida}))
                            .setOnTermino(() => fase.mostrarAngulosParalelogramos.forEach(output => output.update({dentro:true})))


        const quintaLinha = new AnimacaoSequencial(dialogosAnimados[4]).setOnStart(() => fase.settings.ativarMenuCartas(true));

        const animacao = new AnimacaoSequencial(
                            primeiraLinha,
                            segundaLinha.setOnTermino(() => fase.whiteboard.removerTodasEquacoes()),
                            terceiraLinha.setOnTermino(() => animacao.setNome('Dialogo Carta')),
                            quartaLinha,
                            quintaLinha
                        );

        fase.animar(animacao.setNome("Execução Principal"));
    }

    dialogo3(){
        const dialogo5 = [
            "Como acabou de ver, dois ângulos determinam um terceiro no triângulo",
            "Para que isso serve? bem, suponha que temos dois triângulos", // Desenha os triângulos
            "Se todos seus ângulos forem iguais, um é apenas o outro só que maior", //Mostra a escala e pede para arrastar,
            "São SEMELHANTES, e tem proporções entre si",
            "e só precisamos de dois ângulos, pois como vimos o terceiro é determinado por eles", //highlight dos dois ângulos em cada triângulo
            "mas temos outras maneiras de ver se eles são SEMELHANTES"
        ]

        const animarDialogo = dialogo5.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)).setValorFinal(100));


        //Cleanup da cena antiga
        const triangulo = this.triangulo;  
        
        const verticeSelecionado = this.informacao.verticeSelecionado;

        const anguloSelecionado = triangulo.angles[verticeSelecionado.index];

        const apagarAngulo  = apagarObjeto(anguloSelecionado);

        const apagarMostrarAngulo = this.mostrarGrausDesaparecendo(anguloSelecionado);

        const apagarTracejado = () => {

            const criarTracejado = this.informacao.criarTracejadoSelecionado;

            criarTracejado.update({clicado:true});

            triangulo.removeFromScene(this.scene)

            criarTracejado.removeInputs();
        }   

        const cleanupLeftovers = new AnimacaoSimultanea(apagarAngulo, apagarMostrarAngulo)
                                .setOnTermino(apagarTracejado);

        const primeiraLinha = new AnimacaoSimultanea(cleanupLeftovers, animarDialogo[0])



        const desenharTriangulos = new AnimacaoSimultanea(
            new ApagarPoligono(this.triangulo)
            .reverse()
            .setOnTermino(() => false)
            .setOnStart(() => this.triangulo.addToScene(this.scene)),

            new ApagarPoligono(this.triangulo2)
            .reverse()
            .setOnTermino(() => false)
            .setOnStart(() => this.triangulo2.addToScene(this.scene))
        )

        const segundaLinha = new AnimacaoSimultanea(desenharTriangulos, animarDialogo[1])


        const escalarTriangulo2 = this.animacaoEscalarTriangulo2()

        const terceiraLinha = new AnimacaoSimultanea(escalarTriangulo2, animarDialogo[2]);

        return new AnimacaoSequencial(
            primeiraLinha, 
            segundaLinha,
            terceiraLinha,
            animarDialogo[3],
            animarDialogo[4],
            animarDialogo[5]
        );
    }

    animar180Graus(){


        const fase = this;

        const index   = fase.outputClickVertice.map((output,indice) => (output.estado.ativado)? indice : -1)
                                               .filter(indice => indice != -1)[0];

        const angulos = fase.triangulo.angles.filter(angulo => angulo.index != index)

        const objetos = fase.triangulo.vertices.concat(fase.triangulo.edges).concat(angulos);

        const dialogo = ["A soma dos ângulos é metade de um círculo, 180°",
                         "então se subtrairmos os ângulos conhecidos, descobriremos ?",
                        "clique nos ângulos conhecidos e faça-os desaparecer"]
        
        //Clica automaticamente no vértice, desligando seu output e resetando o triângulo
        const desligarTracejado = () => fase.outputClickVertice.forEach(output => (output.ativado)? output.update({clicado:true}) : null);

        const anim1 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[0])).setDelay(200)
        const anim2 = new TextoAparecendo(fase.text.element).setOnStart(() => fase.changeText(dialogo[1])).setDelay(100)
        const anim3 = new TextoAparecendo(fase.text.element)
                          .setOnStart(() => fase.changeText(dialogo[2]))
                          .setOnTermino(desligarTracejado)
                          .setDelay(100)


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


        const apagarGraus1 = this.mostrarGrausAparecendo(this.triangulo.angles[0]).reverse(true, true);
        const apagarGraus2 = this.mostrarGrausAparecendo(this.triangulo.angles[1]).reverse(true, true);


        const mostrarGraus1 = this.mostrarGrausAparecendo(this.triangulo.angles[0].copiaDoAngulo, true).setOnTermino(() => null);
        const mostrarGraus2 = this.mostrarGrausAparecendo(this.triangulo.angles[1].copiaDoAngulo, true).setOnTermino(() => null);

        const apagarRedesenhar = new AnimacaoSimultanea(
                                    apagarTrianguloAnimacao, 
                                    apagarGraus1,
                                    apagarGraus2,
                                    mostrarGraus1,
                                    mostrarGraus2
                                )

        const vertice = fase.triangulo.vertices[index];

        const circulo = new Circle(vertice.getPosition(), 0.740,0.05);
        
        const desenharCirculo = new DesenharMalha(circulo, fase.scene).setDuration(250);

        const apagarCirculo   = apagarObjeto(circulo);

        const mostrar180Graus = this.mostrarEApagar180Graus(vertice);

        const animacao = new AnimacaoSequencial(
                            apagarRedesenhar,
                            new AnimacaoSimultanea(
                                anim1,
                                new AnimacaoSequencial(
                                    desenharCirculo,
                                    mostrar180Graus,
                                    apagarCirculo
                                )
                            ),
                            anim2,
                            anim3
                        );

        animacao.animacoes.map(animacao => animacao.checkpoint = false);
        
        fase.animar(animacao.setOnTermino(() => fase.Configuracao5()))
        
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

    createInputs2(){

        const copias = this.triangulo.angles.map(angle => angle.copiaDoAngulo);

        copias.filter(x => x != undefined).forEach(copia => new Clickable(copia, this.camera));
    }

    createOutputs(){
        //Outputs
        // this.outputClickVertice   = this.triangulo.vertices.map(vertex =>   this.criarTracejado(vertex))
        // this.outputDragAngle      = this.triangulo.angles.map(  angle =>    this.criarMovimentacaoDeAngulo(angle))
        // this.outputEscolheuErrado = this.triangulo.angles.map(  angle =>    this.outputAnguloErrado(angle))
        // this.outputMoverVertice   = this.triangulo.vertices.map(vertice => new MoverVertice(vertice));
    }

    
    resetarInputs(){

        const vertices = this.triangulo.vertices;
        const angles   = this.triangulo.angles;

        vertices.map(vertice => vertice.draggable.removeObservers());
        vertices.map(vertice => vertice.clickable.removeObservers());
        angles.map(  angle => angle.draggable.removeObservers());

    }

        //Configurações que ligam inputs aos outputs
    //Basicamente os controles de cada estado da fase

    Configuracao5(){

        this.createInputs2();
        this.setupObjects2();

        const copiasDosAngulos =  this.triangulo.angles
                                                .map(   angle => angle.copiaDoAngulo)
                                                .filter(copia => copia != undefined);

        for(const copia of copiasDosAngulos){

            const outputDeletarAngulo = this.deletarAngulo(copia);

            copia.clickable.addObserver(outputDeletarAngulo);

            copia.updateHitboxPosition();
        }
    }

    Configuracao6(informacao){

        const fase = this;

        fase.informacao = {...fase.informacao, ...informacao};

        fase.paralelogramo1.nomearVertices("A", "B", "C", "D");
        fase.paralelogramo2.nomearVertices("X", "Y", "Z", "W");

        fase.paralelogramo1.edges[2].variable.assignValue(new Value(4));
        fase.paralelogramo1.edges[3].variable.assignValue(new Value(10));
        fase.paralelogramo2.edges[2].variable.assignValue(new Value(12));
        fase.paralelogramo2.edges[3].variable.assignValue(new Value(30));

        const unidadeMedida = fase.informacao.unidadeMedida;

        const lados = fase.paralelogramo1.edges.concat(fase.paralelogramo2.edges);

        fase.mostrarValorDosLados = lados.map(lado => new MostrarValorAresta(lado, 0, unidadeMedida.cm));

        //Torna todos eles visíveis
        fase.mostrarValorDosLados.forEach(mostrarValor => mostrarValor.addToScene(fase.scene));

        const vertices = fase.paralelogramo1.vertices.concat(fase.paralelogramo2.vertices);


        fase.mostrarNomeDosVertices = vertices.map((vertice, indice) => new MostrarNomeVertice(
                                                                        (indice < 4)? fase.paralelogramo1 : fase.paralelogramo2 ,
                                                                        vertice, 
                                                                        vertice.variable.name
                                                                    ))
        
        fase.mostrarNomeDosVertices.forEach(mostrarNome => mostrarNome.addToScene(fase.scene));

        const mostrarAngulo1 = new MostrarAngulo(fase.paralelogramo1.angles[1]).addToFase(fase);
        const mostrarAngulo2 = new MostrarAngulo(fase.paralelogramo2.angles[0]).addToFase(fase);

        mostrarAngulo1.distanciaTextoParaAngulo = 1.2

        fase.mostrarAngulosParalelogramos = [mostrarAngulo1, mostrarAngulo2];
    }

    Configuracao7(informacao){

        const fase = this;

        fase.informacao = {...fase.informacao, ...informacao};

        const controleDaCarta = informacao.controle;

        fase.mostrarValorDosLados.forEach(mostrarAresta => controleDaCarta.addObserver(mostrarAresta));

        const tratarFimDaExecucao = new Output()
                                    .setUpdateFunction((novoEstado) => {
                                        
                                        if(novoEstado.execucaoTerminada){
                                            //Comentar para o usuário o que deve ser feito
                                            fase.progresso++;
                                            fase.informacao.paralelogramoCompleto = true;
                                            //Limitar o quesito do lado paralelogramo -> feito na carta
                                        }
                                    })

        //Requerimetos:
        //Quando terminar execução, executar texto
        controleDaCarta.addObserver(tratarFimDaExecucao);
    }

    Configuracao7b(){
        
    }
   

    //Outputs abaixo

    //Refazer fluxo 
    ControleGeral = class extends Output{


        constructor(fase){

            super();

            this.fase = fase;

            this.setEstadoInicial({
                cartasUsadas:[],
                triangulos: []
            })
        }

        update(novoEstado){

            const fase = this.fase;

            const estado = this.estado;

            alert("yes")

            //Lida com eventos internos da própria execução
            if(novoEstado.reset){
                fase.cartas = [AnguloParalogramo];
            }

            if(novoEstado.repetido) 
                this.cartaRepetida(estado);

            if(novoEstado.somarEquacoes){
                const dialogo = [
                    "Junte as equações na lousa"
                ]   

                this.criarEquacoes();

                fase.animar(fase.animacoesDialogo(...dialogo));
            }

            if(novoEstado.equacaoResolvida){

                this.lidarResolucaoEquacao();

                const dialogo = [
                    'Muito bem, verifique os ângulos do outro paralelogramo',
                    'Se eles forem congruentes (iguais) então uma nova carta aparecerá',
                    "Use as cartas para resolver o problema: "
                ]

                this.verificarCartas();

                fase.animar(fase.animacoesDialogo(...dialogo).setOnTermino(() =>  fase.settings.ativarMenuCartas(true)));
            }

            //Lida com eventos das cartas abaixo

            if(novoEstado.carta == "CriarTriangulo"){

                const tipo = novoEstado.sentido;

                const repetido = estado.cartasUsadas.includes(tipo);

                if(repetido) return this.notify({repetido: true});

                if(tipo){
                    fase.cartas = [SomaDosAngulosTriangulo];
                }
                else{
                    fase.cartas = [SomaDosAngulosTriangulo];
                }

                fase.settings.ativarMenuCartas(false);
                fase.settings.ativarMenuCartas(true);
            }

            if(novoEstado.carta == "AnguloParalelogramo"){


                //REFAZER DIALOGO
                const dialogo = [
                    "Use a soma dos 180° para podermos descobrir X"
                ]

                const atualizarCartas = () => { 

                    fase.objetos.push(...novoEstado.triangulos);

                    fase.cartas = [SomaDosAngulosTriangulo];

                    fase.settings.ativarMenuCartas(false);
                    fase.settings.ativarMenuCartas(true);
                }

                estado.cartasUsadas.push(novoEstado.carta);
                estado.triangulos = novoEstado.triangulos;
                estado.anguloConhecido = novoEstado.anguloConhecido;
                estado.paralelogramo   = novoEstado.paralelogramo;

                const animacao = fase.animacoesDialogo(...dialogo).setOnTermino(atualizarCartas);

                fase.animar(animacao);
            }

            if(novoEstado.carta == "SomaDosAngulosTriangulo"){
                
                //Diria que falta descobrir os ângulos por outra propriedade, já que a fórmula  não consegue calcular duas icognitas ao mesmo tempo

                const primeiro = this.estado.cartasUsadas.length == 2;

                if(false){

                    const dialogo = [
                        "Conseguimos a soma dos ângulos do primeiro triângulo",
                        "Use a carta de novo para obter a soma do segundo triângulo"
                    ]

                    fase.animar(fase.animacoesDialogo(...dialogo));
                }
                else{

                    //Move etapa para soma de equações
                    this.update({somarEquacoes: true})
                }
            }
        }

        cartaRepetida(){

            const dialogo = [
                "Esse tipo de triângulo já foi desenhado", 
                "Tente desenhar outra diagonal na proxima vez e verá algo novo"
            ];

            this.fase.animar(this.fase.animacoesDialogo(dialogo));

            this.limparTriangulos();
        }

        limparTriangulos(){

            if(!this.estado.triangulos.length) return;

            const apagar = this.estado.triangulos.map(triangulo => new ApagarPoligono(triangulo, true));

            const apagarGraus = this.estado.triangulos.flatMap(triangulo => triangulo.angles.map(angle => angle.mostrarAngulo.animacao(false)));

            const animacao = new AnimacaoSimultanea(...apagar, ...apagarGraus);

            this.fase.objetos = this.fase.objetos.filter(objeto => !this.estado.triangulos.includes(objeto) )

            this.estado.triangulos = [];

            this.fase.animar(animacao);

            return animacao;
        }

        verificarCartas(){

            const cartasUsadas = this.estado.cartasUsadas;

            const ultimaCarta = cartasUsadas.slice(-1)[0];

            const ladosProporcionais = cartasUsadas.filter(carta => carta == "LadoParalelogramo").length == 2;

            const angulosIguais = cartasUsadas.filter(carta => carta == "AnguloParalelogramo").length == 2;

            const cartas = [LadoParalogramo, AnguloParalogramo];

            if(ladosProporcionais){
                //cartas.push(ladoProporcional)
            }

            if(angulosIguais){
                //Cartas.push(ladoProporcional)
            }

            this.fase.cartas = cartas;

            // if(ladosProporcionais && angulosIguais){

            // }
        }

        criarEquacoes(){

            const fase = this.fase;

            const equacao1 = new ElementoCSS2D(fase.whiteboard.equacoes[0], fase.whiteboard);
            const equacao2 = new ElementoCSS2D(fase.whiteboard.equacoes[1], fase.whiteboard);

            const arraste1 = new JuntarEquacoes(equacao1, [equacao2], fase);
            const arraste2 = new JuntarEquacoes(equacao2, [equacao1], fase);

            arraste1.tamanhoFonte = 5;
            arraste2.tamanhoFonte = 5;

            const valorConhecido = new Variable(Math.round(this.estado.anguloConhecido.degrees) + '°');

            console.log("valor", valorConhecido);

            const equacao = new Equality(new Addition(new Variable('X'), new Variable(valorConhecido)), new Variable("180°"))
    
            const textbox = new CSS2DObject(equacao.html);

            arraste1.equacaoNova = textbox;
            arraste2.equacaoNova = textbox;
            

            this.controleEquacoes(arraste1, arraste2).addObserver(this);

        }

        controleEquacoes(juncao1, juncao2, equacao){
        
            const fase = this.fase;

            const sidenote = fase.createTextBox('', [-5.6, 0.6, 0], 17, false);
    
            fase.animar(new MostrarTexto(sidenote, fase.scene));

            const valorConhecido = new Variable(this.estado.anguloConhecido.variable.getValue() + '°');

    
            return new Output()
                    .addInputs(juncao1, juncao2)
                    .setUpdateFunction(function(novoEstado){
    
                        const estado = this.estado;
    
                        if(novoEstado.novaEquacao && estado.etapa == 0){
    
                            const objetoEquacao = new ElementoCSS2D(novoEstado.novaEquacao, fase.whiteboard)
                            
                            const resultado = new Equality(new Variable('X'), new Minus(new Variable('180°'), valorConhecido));
    
                            const resolverEquacao = new ResolverEquacao(objetoEquacao, fase);
    
                            resolverEquacao.equacaoNova = new CSS2DObject(resultado.html);
    
                            estado.equacaoAtual = resultado;
                            
    
                            this.addInputs(resolverEquacao);
    
                            estado.etapa++;
    
                            const mudarSidenote = fase.animacaoDialogo("Clique para resolver a equação", estado.sidenote)
    
                            fase.animar(mudarSidenote);
    
    
                        }
    
                        else if(novoEstado.novaEquacao && estado.etapa == 1){
                            //Mostrar que a soma dos três angulos é 180°
    
                            const objetoEquacao = new ElementoCSS2D(novoEstado.novaEquacao, fase.whiteboard)
    
                            const resolverEquacao = new ResolverEquacao(objetoEquacao, fase);

                            const resultado = new Equality(new Variable('X'), new Variable((180 - parseInt(valorConhecido.getValue()) + "°")))
    
                            resolverEquacao.equacaoNova = new CSS2DObject(resultado.html);
    
                            estado.equacaoAtual = resultado;
    
                            this.addInputs(resolverEquacao);
    
                            estado.etapa++;
                            
                            const mudarSidenote = fase.animacaoDialogo("Clique para resolver a equação", estado.sidenote)
    
                            fase.animar(mudarSidenote);
    
                        }
                        else if (novoEstado.novaEquacao && estado.etapa == 2){

                            alert("Terminado");

                            this.notify({
                                equacaoResolvida: true,
                                equacao: estado.equacao
                            })

                            const mudarSidenote = apagarCSS2(sidenote, fase.scene);
    
                            fase.animar(mudarSidenote);
                        }
                    })
                    .setEstadoInicial({
                        etapa: 0,
                        sidenote: sidenote,
                        equacaoAtual: equacao
                    })
        }

        lidarResolucaoEquacao(){

            const limparTriangulos  = this.limparTriangulos();

            const paralelogramo = this.estado.paralelogramo;

            //Limpa o nome das variáveis, para não aparecer seu nome e sim seu valor decimal no mostrarAngulo
            const limparVariaveis = () =>  paralelogramo.angles.forEach(angles => angles.variable.nome = '');
            

            const aparecerGraus = paralelogramo.angles.map(angle => this.fase.mostrarGrausAparecendo(angle, false, false));

            const animacao = new AnimacaoSimultanea(...aparecerGraus)
                            .setOnStart(limparVariaveis)

            limparTriangulos.setOnTermino(() => {
                this.fase.animar(animacao);
                this.fase.whiteboard.ativar(false);
                this.fase.whiteboard.removerTodasEquacoes();
            });
        }
    }

    

    //Adicionar update(estado) ai passa o estado para o problema da fase
    //Assim controles podem mudar o problema da fase satisfazendo uma condição
    update(){
        // this.atualizarOptions();

        super.update();

        if(this.debug == 2) super.update()
        if(this.debug == 2) super.update()
        if(this.debug == 2) super.update()

        

        if(this.debug && this.debugProblem > this.progresso){

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
        }
        if(this.debug && this.debugProblem > this.progresso){

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
        }
        if(this.debug && this.debugProblem > this.progresso){

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();

            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
            super.update();
        }
       
        
        // if(options.atualizar) triangle.update();

        const problema = this.problemas[this.progresso];

        if(!problema) return console.log("Finalizado");

        if(problema.satisfeito(this)){
            problema.consequencia(this);
            this.progresso++;

            if(problema.proximo) this.progresso = problema.proximo(this);

            console.log(this.progresso, "Progresso")
        }
    }

    //Animações

    highlightColorirAngulo(angulo){
        return new AnimacaoSequencial(colorirAngulo(angulo)
                                    .setValorInicial(0xff0000)
                                    .setValorFinal(0xaa00aa)
                                    .setDuration(20)
                                    .setDelay(40)
                                    .voltarAoInicio(false),
                                    colorirAngulo(angulo)
                                    .setValorInicial(0xaa00aa)
                                    .setValorFinal(0xff0000)
                                    .setDuration(20))
                                    .voltarAoInicio(false)
    }

    mostrarGrausAparecendo(angle, updateMostrarAnguloCadaFrame = false, mostrarEdesaparecer=true){


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

    animacaoColorirAngulosIguais(poligono1,poligono2, equacoes){

        //Uma série de animações sequenciais
        //Onde para cada angulo do polígono1, um angulo do polígono 2 também sofre highlight ao mesmo tempo
        //Escreve a equação de igualdade dos dois ângulos na esquerda
        return new AnimacaoSequencial()
               .setAnimacoes(
                    poligono1.angles
                    .map((angle1,index) => {

                        const angle2 = poligono2.angles[index];

                        
                        return new AnimacaoSimultanea(
                            this.highlightColorirAngulo(angle1), 
                            this.highlightColorirAngulo(angle2),
                            this.mostrarGrausAparecendo(angle1).setDuration(80),
                            this.mostrarGrausAparecendo(angle2).setDuration(80),
                            this.animacaoEscreverIgualdadeAngulos(equacoes, index) //Escreve a equação de igualdade
                        )
                        .manterExecucaoTodos(false)
                    })
                )
                .setCheckpointAll(false)
    }

    animacaoDividirLadosIguais(poligono1, poligono2){

        const fase = this;

        const dividirLados = poligono1.edges.map((lado1,index) => {

            const lado2 = poligono2.edges[index];

            const posicaoDivisao = new THREE.Vector3(4.5 + index*0.1,0,0);

            const mostrarEquacao = fase.animacaoEscreverRazao(index,lado1,lado2,posicaoDivisao);

            return new AnimacaoSimultanea(
                    new Divisao(
                        lado2,
                        lado1,
                        null,
                        posicaoDivisao
                    )
                    .addToScene(this.scene),
                    mostrarEquacao
                )              
         });

         return new AnimacaoSequencial().setAnimacoes(dividirLados)
    }

    mostrarEApagar180Graus(vertice){

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
                                                                    new THREE.Vector3(0,0,-1)
                                                            )
                                                            .multiplyScalar(0.06)
                                                       ).normalize()
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

        const angulos = this.triangulo.angles.map(angle => (angle.copiaDoAngulo)? angle.copiaDoAngulo : angle);

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
                                this.mostrarGrausAparecendo(angulo180graus).setDuration(200)
                            ),
                            brilharMetalico
                        ),
                        reaparecerGraus,
                        this.moverGrausParaPosicaoEquacao(angulos)
                    ),
                )

    }

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
        const mover3 = moverTexto(angulos[2]);

        var novoElemento = null;

        return new AnimacaoSimultanea(
                new AnimacaoSimultanea(
                        mover1,
                        mover2,
                        mover3
                )
                .setOnStart(criarEquacao)
                .setOnTermino(mostrarEquacaoEMoverParaWhiteboard))


        //Funções auxiliares

        function criarEquacao(){
            const valores = angulos.map( angulo => angulo.mostrarAngulo.text.elemento.element.textContent);

            const x = new Variable(valores[0]);
            const y = new Value(valores[1]);
            const z = new Value(valores[2]);

            const equacao = new Equality(
                                new Addition(
                                    new Addition(
                                        x,
                                        y
                                    ),
                                    z
                                ),
                                new Value("180°")
                            )

            fase.informacao.equacao = {equacao:equacao, angulos:[x,y,z]}

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

            mover3.setSpline([
                mover3.elementoTexto.position.clone(),
                ...spline,
                getPosition(z)
            ])
        }


        function calcularDeslocamento(equacao, subequacao){

            const tamanho      = equacao.element.textContent.length;
            const deslocamento = subequacao.comeco + subequacao.element.innerText.length/2;

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            context.font = '18px Courier New, monospace'

            console.log(context.measureText(equacao.element.textContent))

            const medidas = context.measureText(equacao.element.textContent)

            const width = medidas.width;

            const height = medidas.actualBoundingBoxAscent;

            const offset = (deslocamento/tamanho - 0.5)*width;

            const point = fase.pixelToCoordinates(fase.width/2 + offset, fase.height/2 - 18); //18 é o tamanho da fonte em pixeis

            console.log(point)

            //VERIFICAR BUGS, MODIFICAR CENTRO DA CÂMERA PROVAVELMENTE É DESVIO
            return new THREE.Vector3(point.x,point.y - 1, 0); // por algum motivo o y é 1 se for metade da altura
        }

        function mostrarEquacaoEMoverParaWhiteboard(){

            fase.whiteboard.adicionarEquacao(novoElemento.equacao)

            //Consertar depois, está debaixo da whiteboard
            // novoElemento.element.style.zIndex = 10000;

            fase.scene.add(novoElemento);


            // console.log(novoElemento)

            
            const spline = [
                new THREE.Vector3(-2, -0.3937007874015752, 0),
                new THREE.Vector3(-4.432748538011696,  0.36771653543307, 0),
                // new THREE.Vector3(3.5,2,0)
            ]


            const mostrarTexto = new MostrarTexto(novoElemento)
                                    .setValorFinal(300)
                                    .setProgresso(0);

            const voltarAngulos = angulos.map(angulo => fase.mostrarGrausAparecendo(angulo,false,false))

            const voltarAngulosAnimacao = new AnimacaoSimultanea()
                                              .setAnimacoes(voltarAngulos)
                                              .setOnStart(() =>{

                                                    angulos.map(angulo => angulo.mostrarAngulo.update({dentro:true}));

                                                    //Mudar se tornar escolha de ângulo geral
                                                    angulos[2].mostrarAngulo.text.elemento.element.textContent = '?';
                                              })

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
                                moverEquacaoParaDiv
                            )

            animacao.setCheckpointAll(false);

            fase.animar(animacao);
        }

    }

    moverEquacao(configs){

        let {elementoCSS2, equacao, spline, duration1, duration2, delayDoMeio} = configs;

        if(!spline){
            spline = [
                new THREE.Vector3(1.473684210526315, -2.2692913385826774, 0),
                new THREE.Vector3(-0.39766081871345005, -0.6944881889763783, 0),
            ]
        }

        if(!equacao){

            const novoElemento = document.createElement("div");

            novoElemento.innerHTML = elementoCSS2.element.innerHTML;

            novoElemento.style.width = '400px'; // Set width to 200 pixels
            novoElemento.style.height = '40px'; // Set height to 150 pixels
            novoElemento.style.top = '10px'; // Set top position to 50 pixels from the top of the parent element

            novoElemento.style.position = 'relative';

            novoElemento.children[0].style.width = '400px';
            novoElemento.children[0].style.height = 'auto';

            equacao = {html: novoElemento}
        }

        if(!duration1){
            duration1 = 50
        }

        if(!duration2){
            duration2 = 50;
        }

        if(!delayDoMeio){
            delayDoMeio = 0;
        }

        const fase = this;


        fase.whiteboard.adicionarEquacao(equacao)

        //Consertar depois, está debaixo da whiteboard
        // novoElemento.element.style.zIndex = 10000;

        fase.scene.add(elementoCSS2);


        const mostrarTexto = new MostrarTexto(elementoCSS2)
                                .setValorFinal(300)
                                .setProgresso(0)
                                .setDelay(delayDoMeio)
                                .setDuration(duration1)
                                .setValorFinal(3000)

        

        const moverEquacaoParaDiv = new MoverTexto(elementoCSS2)
                                    .setOnStart(function(){
                                        const equacaoDiv   = fase.whiteboard.equacoes[0].element;

                                        const dimensoes    = equacaoDiv.getBoundingClientRect();

                                        const posicaoFinal = fase.pixelToCoordinates((dimensoes.right + dimensoes.left)/2, (dimensoes.top + dimensoes.bottom)/2)

                                        this.setSpline([
                                            elementoCSS2.position.clone(),
                                            ...spline,
                                            posicaoFinal
                                        ])

                                        // fase.whiteboard.equationList.children[0].style.display = "none"
                                        

                                    })
                                    .setOnTermino(() =>{
                                        fase.scene.remove(elementoCSS2);
                                        // fase.whiteboard.equationList.children[0].style.display = "block"
                                        fase.whiteboard.ativar(true);
                                    })
                                    .setDuration(duration2)


        const animacao = new AnimacaoSequencial( 
                            mostrarTexto, 
                            moverEquacaoParaDiv
                        )

        animacao.setCheckpointAll(false);

        return animacao

        
    }

    animacaoEscalarTriangulo2(){

        const fase = this;

        let positions;
        let deslocamento;
        let scaleDiference;
        let escala;


        return new Animacao()
               .setValorFinal(0)
               .setValorInicial(1)
               .setInterpolacao((a,b,c) => a*(1-c) + b*c)
               .setUpdateFunction(function(tempo){


                    positions  = fase.triangulo.vertices.map(vertice => vertice.getPosition().multiplyScalar(0.5).toArray());

                    const triangulo2 = fase.triangulo2;

                    const scale = (scaleDiference - 1) * (1-tempo) + 1

                    const fatorDeslocamento = deslocamento.clone().multiplyScalar(0 - tempo)

                    triangulo2.positions = positions.map(p => new THREE.Vector3()
                                                                  .fromArray(p)
                                                                  .multiplyScalar(scale)
                                                                  .add(fatorDeslocamento)
                                                                  .toArray()
                                                        )

                    // console.log(positions, fatorDeslocamento, triangulo2.positions)

                    triangulo2.removeFromScene();

                    triangulo2.render();

                    triangulo2.addToScene(fase.scene);

                    escala.mudarTexto(`escala = ${Math.round(scale*1000)/1000}`)

               })
               .setDuration(200)
               .setOnStart(() => {

                    const triangulo1 = this.triangulo;
                    const triangulo2 = this.triangulo2;

                    
                    
                    const mathjaxEquation = fase.createMathJaxTextBox("escala = ");

                    
                    fase.scene.add(mathjaxEquation);

                    escala = mathjaxEquation;

                    console.log(escala);

                    

                    deslocamento   = triangulo1.centro.sub(triangulo2.centro);
                    scaleDiference = 2;

                    console.log(positions,triangulo1.positions,deslocamento,scaleDiference)

               })
               .setCurva((x) => {
                    const c1 = 1.70158;
                    const c2 = c1 * 1.525;
                    
                    return x < 0.5
                    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
               })

    }

    //ANIMAÇÃO ASSINCRONA (processa os dados de entrada apenas em sua execução)
    animacaoEscreverIgualdadeAngulos(equacoes, index){

        const fase = this;

        function escreverMedidaAngulo(){

            const valorDoAngulo = Math.round(fase.pentagono.angles[index].degrees);
    
            const caixaDeTextoMathjax = fase.createMathJaxTextBox("", [-5,2 - 0.5*index,0])
    
            caixaDeTextoMathjax.mudarTexto(equacoes.compararAngulos(index,valorDoAngulo), 2)
    
            const escreverEquacao  = new MostrarTexto(caixaDeTextoMathjax)
                                    .setValorFinal(300)
                                    .setProgresso(0)
                                    .setDelay(50)
                                    .setDuration(100)
                                    .setValorFinal(1000)
                                    .setOnStart(() => fase.scene.add(caixaDeTextoMathjax))
    
            //Adiciona as textboxes ativas da fase
            fase.textBoxes.primeiroDialogo.push(caixaDeTextoMathjax);

            fase.animar(escreverEquacao)
        }

        return animacaoIndependente(escreverMedidaAngulo, 0);
    }

    //ANIMAÇÃO ASSINCRONA (processa os dados de entrada apenas em sua execução)
    animacaoEscreverRazao(index, lado1, lado2, offset = new THREE.Vector3(0,0,0)){

        const fase = this;

        function escreverRazao(){

            const caixaDeTextoMathjax = fase.createMathJaxTextBox("", offset.clone().add(new THREE.Vector3(1.8,0,0)).toArray())

            //Animação que mostra inicialmente a equação aparecendo
            const mostrarEquacao  = new MostrarTexto(caixaDeTextoMathjax)
                                    .setValorFinal(300)
                                    .setProgresso(0)
                                    .setDelay(50)
                                    .setDuration(200)
                                    .setValorFinal(3000)
                                    .setOnStart(() => {

                                        const comprimento1 = Math.floor(lado1.length*100)/100;
                                        const comprimento2 = Math.round(lado2.length*100)/100;

                                        caixaDeTextoMathjax.mudarTexto(
                                            ` {\\color{purple} RAZÃO = 
                                                \\frac {{\\color{blue}Lado~ ${index + 1}}}
                                                {{\\color{red} Lado~ ${index + 1}}}  = 
                                                \\frac {{\\color{blue}${comprimento2}}}
                                                {{\\color{red}${comprimento1}}} = \\large{2}}`,
                                                0.4
                                        )

                                        fase.scene.add(caixaDeTextoMathjax)
                                    })

            //Move para o canto esquerdo a equação depois de terminada animação principal
            const moverEquacao = new MoverTexto(caixaDeTextoMathjax)
                                    .setOnStart(function(){



                                        this.setSpline([
                                            caixaDeTextoMathjax.position.clone(),
                                            new THREE.Vector3(0, -3.5, 0),
                                            new THREE.Vector3(-3, -2, 0),
                                            new THREE.Vector3(-5, 1 - 0.5*index, 0)
                                        ])

                                        // fase.whiteboard.equationList.children[0].style.display = "none"
                                        

                                    })
                                    .setDuration(200)

            //Chaves matemáticas que cobrem os dois lados
            const chaves = new Bracket(
                -0.2, 
                offset.clone()
                .add(
                    new THREE.Vector3(0.5,lado2.length/2,0)
                ),
                offset.clone()
                .add(
                    new THREE.Vector3(0.5,-lado2.length/2,0)
                ),
                )

            chaves.scene = fase.scene;

            const desenharChave = chaves.animacao()


            const animacao = new AnimacaoSequencial(
                                new AnimacaoSimultanea(
                                    mostrarEquacao.filler(30),
                                    desenharChave.setDelay(30)
                                ),
                                moverEquacao
                            )
                            .filler(75)
                            .setCheckpointAll(false);

            
            //Adiciona essa caixa de texto as caixas de texto ativas
            if(!fase.textBoxes.mostrarRazaoLados) fase.textBoxes.mostrarRazaoLados = [];

            fase.textBoxes.mostrarRazaoLados.push(caixaDeTextoMathjax);

            
            fase.animar(animacao)
        }

        return animacaoIndependente(escreverRazao);
    }

    //ANIMAÇÃO ASSINCRONA (processa os dados de entrada apenas em sua execução)
    animacaoEquacoesVirandoUmaSo(nomeCaixasDeTexto, texto, tamanhoDaFonte, posicaoTexto=[-4,1,0]){

        const fase = this;

        function equacoesVirandoUmaSo(){

            const caixasDeTexto = fase.textBoxes[nomeCaixasDeTexto];


            const apagarCaixasDeTexto = new AnimacaoSimultanea()
                                        .setAnimacoes(
                                            caixasDeTexto.map(caixa => apagarCSS2(caixa, fase.scene))
                                        );

            const todosOsLadosIguais = fase.createMathJaxTextBox("", posicaoTexto)

            todosOsLadosIguais.mudarTexto(texto, tamanhoDaFonte);

            const adicionarTotal = fase.moverEquacao({
                                    elementoCSS2: todosOsLadosIguais,
                                    duration1: 100,
                                    duration2: 80,
                                    spline: [
                                        new THREE.Vector3(-4.05, 0.8, 0),
                                        new THREE.Vector3(-3.95, 0, 0),
                                    ],
                                    delayDoMeio: 50,
                                })
                                
            const apagarTotal = apagarCSS2(todosOsLadosIguais, fase.scene)
                                .setDuration(50)

            const animacao = new AnimacaoSequencial(
                                apagarCaixasDeTexto.setCheckpoint(false), 
                                adicionarTotal.setCheckpoint(false),
                                apagarTotal.setCheckpoint(false)
                            )
                            .setCheckpointAll(false)
                            .setOnTermino(() => fase.whiteboard.ativar(false))

            fase.animar(animacao);
        }


        return animacaoIndependente(equacoesVirandoUmaSo);
    }

    //Fazer depois
    // animacaoMesclarEquacoes(equacoesCSS2Mathjax, equacaoCentralCSS2){
        

    //     const centro  = equacaoCentralCSS2.position.clone();

    //     const moverEquacoes = equacoesCSS2Mathjax.map(equacao => {

    //         const spline = criarSplineAleatoriamente(equacao.position.clone(), centro);
            
    //         return new MoverTexto(equacao, spline);
    //     })

    //     const animacao = new AnimacaoSequencial().setDuration(300);

    //     return animacao.setOnStart(() => animacao.setAnimacoes())


    //     //Mover isso depois para o moverTexto, deve ser um método que lida com splines nulas
    //     function criarSplineAleatoriamente(posicaoInicial, posicaoFinal){

    //         const vetor = new THREE.Vector3().subVectors(posicaoFinal, posicaoInicial);

    //         const perpendicular = new THREE.Vector3().crossVectors(vetor, new THREE.Vector3(0,0,1));

    //         const posicao1 = vetor.copy()
    //                               .multiplyScalar(Math.random() * 1/2)
    //                               .add(
    //                                 perpendicular
    //                                 .copy()
    //                                 .multiplyScalar(Math.random() ** 4)
    //                               )
    //                               .add(
    //                                 posicaoInicial
    //                               )


    //         const posicao2 = posicao1.copy()
    //                                 .multiplyScalar(Math.random()* 1/2)
    //                                 .add(
    //                                     perpendicular
    //                                     .copy()
    //                                     .multiplyScalar(Math.random() ** 4)
    //                                 )
    //                                 .add(
    //                                     posicaoInicial
    //                                 )
            

    //         return [
    //             posicaoInicial, 
    //             posicao1,
    //             posicao2,
    //             posicaoFinal
    //         ].map(vetor => vetor.toArray());
            
    //     }

    // }



    //Adicionar equação 4 horas = 120 graus, onde graus e horas são variáveis
    //Adicionar possibilidade de resolver equação por meios algébricos
    //Adicionar menu de perguntas
    problemas = {

        0: {
            satisfeito(){

                return true;
            },

            consequencia(fase){

               fase.aula1();
            }
        },

        2: {
            satisfeito(){

                return true;
            },

            consequencia(fase){

               fase.aula2();
            }
        },

        4: {

            satisfeito(){
                return true;
            },

            consequencia(fase){
                
                const dialogo1 = fase.animacaoDialogo("Ótimo, agora só por precaução faça o mesmo para o outro paralelogramo")
                const dialogo2 = fase.animacaoDialogo("Queremos ver se os lados são proporcionais, e é útil descobrir os desconhecidos");

                dialogo1.setOnTermino(() => fase.settings.ativarMenuCartas(true));

                fase.animar(new AnimacaoSequencial(dialogo1, dialogo2).setNome("Dialogo Cartas"))
            },

            proximo(fase){
                return "final"
            }
        },

        final: {
            satisfeito: () => false
        }
    }

    //Termina o setup dos controles de interação das cartas
    //Interface para realizar interações entre cartas e fase
    adicionarControleDaCarta(controleCarta){

        const fase = this;

        if(controleCarta.name == "Controle Arraste") fase.Configuracao7({controle: controleCarta});

        this.controleFluxo.addInputs(controleCarta)
    }


    //Animações dos problemas
     //Funções, outputs etc. usados nos problemas

     
}
