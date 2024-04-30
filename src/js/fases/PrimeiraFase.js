import { Triangle } from "../objetos/triangle"
import { Fase } from "./fase";
import { Poligono } from "../objetos/poligono";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import DesenharPoligono from "../animacoes/DesenharPoligono";
import { TextoAparecendo } from "../animacoes/textoAparecendo";
import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from "../animacoes/animation";
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
import { Addition, Equality, Value, Variable } from "../equations/expressions";
import MostrarTexto from "../animacoes/MostrarTexto";
import { Operations } from "../equations/operations";
import Bracket from "../objetos/bracket";
import {apagarCSS2} from "../animacoes/apagarCSS2";

export class PrimeiraFase extends Fase{

    constructor(){
    
        super();

        this.setupTextBox();
        this.changeText("");

        this.progresso = 0;
        this.textBoxes = {};
        this.operadores = new Operations(null,this);

        this.setupObjects();
        this.createInputs();
        this.createOutputs();

        this.outputTesteClick();

    }

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
                        .escala(0.605,1.01,0)
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

    firstDialogue(){

        const fase = this;


        const dialogo1 = [
            "Vimos que dois poligonos são semelhantes quando seus ângulos são congruentes",
            "e seus respectivos lados são proporcionais.", 
            "Como os triângulos são os polígonos mais simples,",
            "também são os mais fáceis de ver se são semelhantes."
        ]

        this.pentagono.addToScene(this.scene);

        this.pentagono2.addToScene(this.scene);

        //Desenhar um polígono pequeno, desenhar outro polígono maior
        //highlight dos ângulos respectivos em cada triângulo
        //highlight dos lados 
        //Apaga polígonos e desenha o triângulo

        const animarDialogo = dialogo1.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)).setValorFinal(100));

        const desenharPoligonos = new AnimacaoSimultanea(
                                    new DesenharPoligono(this.pentagono), 
                                    new DesenharPoligono(this.pentagono2).filler(50)
                                  );

        const mostrarAngulos = this.mostrarGrausHighlightAngulos(this.pentagono,this.pentagono2);

        const primeiraLinha = new AnimacaoSequencial(
                                    new AnimacaoSimultanea(animarDialogo[0], desenharPoligonos), 
                                    mostrarAngulos
                              )


        const dividirLados = this.pentagono.edges.map((lado1,index) => {

                                const lado2 = this.pentagono2.edges[index];

                                const posicaoDivisao = new THREE.Vector3(4.5 + index*0.1,0,0);

                                return new AnimacaoSimultanea(

                                        new Divisao(
                                            lado2,
                                            lado1,
                                            null,
                                            posicaoDivisao
                                        )
                                        .addToScene(this.scene)
                                    )
                                    .setOnStart(
                                        () => this.animar(
                                            this.animacaoEscreverRazao(index, lado1, lado2, posicaoDivisao)
                                        )
                                    )
                                        
                             });

        //Refinar adicionando contador abaixo da divisão
        //Todos eles vão contar para 2
        //Mostrar isso como a proporção de semelhança entre as duas figuras
        const segundaLinha = new AnimacaoSimultanea(
                                animarDialogo[1],
                                new AnimacaoSequencial().setAnimacoes(dividirLados).recalculateFrames()
                            );

        const apagarPoligonos = new AnimacaoSimultanea(
                                    new ApagarPoligono(this.pentagono), 
                                    new ApagarPoligono(this.pentagono2)
                                )

        const aparecerTriangulos = new AnimacaoSimultanea(
                                    // new ApagarPoligono(this.triangulo).reverse(), 
                                    new ApagarPoligono(this.triangulo).reverse()
                                )
                                .setOnStart(() => {
                                    // this.triangulo.addToScene(this.scene);
                                    this.triangulo.addToScene(this.scene);
                                })

        const terceiraLinha = new AnimacaoSimultanea(
                                animarDialogo[2],
                                apagarPoligonos,
                                aparecerTriangulos
                             );

        const quartaLinha   = animarDialogo[3];

        // const divisao = new Divisao(this.pentagono2.edges[0], this.pentagono.edges[0], null, new THREE.Vector3(4,-1,0)).addToScene(this.scene);

        const gambiarraDeletarEquacoes = new Animacao()
                                        .setInterpolacao(() => null)
                                        .setUpdateFunction(() => null)
                                        .setDuration(300)
                                        .setOnStart(deletarCaixasDeTexto)
                                        .setCheckpoint(false)
                                        .setDelay(100)
                                        .setOnTermino(() => fase.whiteboard.ativar(false))

        const animacao = new AnimacaoSequencial(
                            primeiraLinha,
                            gambiarraDeletarEquacoes, 
                            segundaLinha.filler(30), 
                            terceiraLinha, 
                            quartaLinha
                        )
                        .setOnTermino(() => fase.progresso = 2)

        
         //Modifica a equação mostrada ao lado toda vez que iniciar um novo mostrarAngulo
         mostrarAngulos.animacoes.forEach((mostrarAngulo,index) => mostrarAngulo.setOnStart(() =>{

            const valorDoAngulo = Math.round(this.pentagono.angles[index].degrees);

            const caixaDeTextoMathjax = this.createMathJaxTextBox("", [-5,2 - 0.5*index,0])

            caixaDeTextoMathjax.mudarTexto(
                `Ângulo~ {\\color{red}${index + 1}} ~   do ~P1 = 
                 Ângulo~ {\\color{blue} ${index + 1}} ~ do~ P2 = 
                 {\\color{purple} ${valorDoAngulo}°} `,
                 2
            )

            const animacao  = new MostrarTexto(caixaDeTextoMathjax)
                                .setValorFinal(300)
                                .setProgresso(0)
                                .setDelay(50)
                                .setDuration(200)
                                .setValorFinal(3000)
                                .setOnStart(() => fase.scene.add(caixaDeTextoMathjax))

            this.animar(animacao)

            //Adiciona as textboxes ativas da fase
            this.textBoxes.primeiroDialogo.push(caixaDeTextoMathjax);
        }))

        this.animar(animacao);


        
        function deletarCaixasDeTexto(){


            const apagarCaixasDeTexto = fase.textBoxes.primeiroDialogo
                                                      .map(caixa => apagarCSS2(caixa, fase.scene));

            const animacaoApagar = new AnimacaoSimultanea().setAnimacoes(apagarCaixasDeTexto);

            const todosOsAngulosIguais = fase.createMathJaxTextBox("", [-4,1,0])

            todosOsAngulosIguais.mudarTexto(
                `~{\\color{red}~Todos~Ângulos~ do ~P1} = 
                ~{\\color{blue}~Todos~Ângulos~ do~ P2}`,
                 3
            )

            const adicionarTotal = fase.moverEquacao({
                                    elementoCSS2: todosOsAngulosIguais,
                                    duration1: 100,
                                    duration2: 80,
                                    spline: [
                                        new THREE.Vector3(-4.05, 0.8, 0),
                                        new THREE.Vector3(-3.95, 0, 0),
                                    ],
                                    delayDoMeio: 50,
                                })
                                
            const apagarTotal = apagarCSS2(todosOsAngulosIguais, fase.scene)
                                .setDuration(50)

            const animacao = new AnimacaoSequencial(
                                animacaoApagar.setCheckpoint(false), 
                                adicionarTotal.setCheckpoint(false),
                                apagarTotal.setCheckpoint(false)
                            )

            fase.animar(animacao);
        }
    }

    secondDialogue(){

        const dialogo2 = [
            "Precisamos que os ângulos sejam iguais e os lados proporcionais para termos semelhança",
            "Se soubermos dois ângulos, conseguimos descobrir o terceiro",
            "Vimos isso na soma dos ângulos sendo igual a 180°",
            "Assim, tente mover os ângulos como na última fase:",
            
        ]


        const animarDialogo = dialogo2.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)).setValorFinal(100));

        const angulox = this.triangulo.angles[2];

        const highlightUnknownAngle =   colorirAngulo(angulox)
                                        .setValorInicial(0xff0000)
                                        .setValorFinal(0x9002a8)
                                        .setDuration(200)
                                        .setCurva(x =>  x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2)
                                        .voltarAoInicio(false);


        const mostrarGraus = this.triangulo.angles.map(angle => this.mostrarGrausAparecendo(angle)
                                                                    .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
                                                                    .setOnTermino(() => null)
                                                                    .setProgresso(0)
                                                     )
        
        mostrarGraus[2].setOnStart(() => {
            angulox.mostrarAngulo.update({dentro:true}); 
            angulox.mostrarAngulo.text.elemento.element.textContent = "?"
        })


        const mostrarGrausDosAngulos = new AnimacaoSequencial(
                                            highlightUnknownAngle,
                                            new AnimacaoSimultanea().setAnimacoes(mostrarGraus)
                                        )

        const primeiraLinha = new AnimacaoSimultanea(
                                animarDialogo[0],
                                mostrarGrausDosAngulos
                            );

        const segundaLinha  = new AnimacaoSimultanea(
                                animarDialogo[1]
                            )
        const terceiraLinha = animarDialogo[2]
                              
        const quartaLinha   = animarDialogo[3];

        const animacao = new AnimacaoSequencial(
                            primeiraLinha,
                            segundaLinha,
                            terceiraLinha,
                            quartaLinha
                        )

        this.animar(animacao.setOnTermino(() => this.progresso = 4))
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
        this.outputClickVertice   = this.triangulo.vertices.map(vertex =>   this.criarTracejado(vertex))
        this.outputDragAngle      = this.triangulo.angles.map(  angle =>    this.criarMovimentacaoDeAngulo(angle))
        this.outputEscolheuErrado = this.triangulo.angles.map(  angle =>    this.outputAnguloErrado(angle))
        this.outputMoverVertice   = this.triangulo.vertices.map(vertice => new MoverVertice(vertice));
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

        console.log(informacao, fase.informacao)

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

                console.log(atualizarCopia)

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

                console.log(angle)

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

   

    //Outputs abaixo
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

            console.log(origem, destino);

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

    criarTracejado = (vertex) => {

        //Input: clickable do vertice, diz se foi o vertice clicado ou não
        //Input: draggable dos outros vertices, diz se outros vértices se arrastaram

        //Para usar nas funções auxiliares
        const fase = this;

        // pegar outros dois vertices:
        const outros_dois = this.triangulo.vertices.filter((vertice) => vertice != vertex);

        let ativado = false;
        let tracejado = null;
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

                        // console.log(novoEstado)

                        //Se um dos outros vértices tiver sendo arrastado, remove tudo e desenha de novo
                        if(estado.dragging){

                            desenharTracejado.stop = true;
                            tracejado.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);
                            updateDegrees();

                            // ativarMoverOutrosVertices(this);

                            fase.Configuracao2({
                                verticeSelecionado: vertex, 
                                criarTracejadoSelecionado: this,
                                sentido:vetorTracejado1,
                                angulosInvisiveis: [anguloInvisivel1, anguloInvisivel2]
                            });

                            tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1.multiplyScalar(3)), posicao.clone().add(vetorTracejado1.multiplyScalar(3)))

                            tracejado.addToScene(fase.scene);

                            estado.arraste = true;

                            console.log(1)

                            return;
                        }

                        if (estado.clicado && !ativado){

                            ativado = !ativado

                            const posicao = vertex.mesh.position.clone();
                            const vetorTracejado1 = outros_dois[0].mesh.position.clone().sub(outros_dois[1].mesh.position.clone());
                            const vetorTracejado2 = outros_dois[1].mesh.position.clone().sub(outros_dois[0].mesh.position.clone());

                            //Funções auxiliares, estão logo abaixo do return
                            criarHitboxAngulos(posicao, vetorTracejado1, vetorTracejado2);

                            animacaoTracejado(posicao,vetorTracejado1,vetorTracejado2);

                            fase.Configuracao2({
                                verticeSelecionado: vertex, 
                                criarTracejadoSelecionado: this,
                                sentido: vetorTracejado1,
                                angulosInvisiveis: [anguloInvisivel1, anguloInvisivel2]
                            })

                        } else if (estado.clicado) {

                            ativado = !ativado
                            
                            desenharTracejado.stop = true;
                            tracejado.removeFromScene(fase.scene)
                            anguloInvisivel1.removeFromScene(fase.scene)
                            anguloInvisivel2.removeFromScene(fase.scene)
                            
                            //Reseta outputs para sua configuração inicial
                            fase.Configuracao1({})
                            
                            fase.triangulo.removeFromScene();
                            fase.triangulo.addToScene(fase.scene);
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
        function animacaoTracejado(posicao,vetorTracejado1,vetorTracejado2){

            tracejado = new Tracejado(posicao.clone().sub(vetorTracejado1), posicao.clone().add(vetorTracejado1))
            tracejado.addToScene(fase.scene);

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

    deletarAngulo(angle){

        const fase = this;

        //Aceita um angulo, ao clicar apaga ele e decrementa o contador total

        return new Output()
               .setUpdateFunction(function(estadoNovo){

                    //Ver se não consegue ser deletado mais de uma vez
                    if(estadoNovo.clicado){

                        //Deleta o ângulo através de animação

                        animacaoDeletar();

                        console.log(fase.informacao.angulosDeletados)
                    }
               })

        //Funções auxiliares
        function incrementarContador(){

            angle.removeFromScene();

            //Incrementa quantidade de ângulos deletados
            if(!fase.informacao.angulosDeletados) {
                fase.informacao.angulosDeletados = 0;
            }

            fase.informacao.angulosDeletados++;
                

        }

        function animacaoDeletar(){

            const animacao = new AnimacaoSimultanea(
                                apagarObjeto(angle)
                                .setOnTermino(incrementarContador),

                                fase.mostrarGrausDesaparecendo(angle)
                            )
                            .setOnStart(() =>{


                                //REFATORAR DEPOIS
                                //TORNAR MÉTODO DE OPERADORES E CHAMAR AQUI
                                const angulosEquacoes = fase.informacao.equacao.angulos;

                                const expression = angulosEquacoes.filter(angulo => parseInt(angulo.element.textContent) == Math.round(angle.degrees))[0];

                                const operadores  = fase.operadores;

                                const mudarDeLado = operadores.operations.subtraction;

                                const action = mudarDeLado.action(expression);

                                const result = mudarDeLado.result(expression);

                                expression.substitute(result);

                                fase.animar(action);

                                action.setOnTermino(() => {

                                    const equationWindow = operadores.selector.parentNode.children[0];
                                    console.log(equationWindow);
                                    console.log(equationWindow.children[0])

                                    operadores.expression.update(equationWindow);
                                    operadores.eliminarZero(result);
                                });
                            })

            fase.animar(animacao);
        }
    }

    //Muito complexo, melhor não

    update(){
        // this.atualizarOptions();

        super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        
        

        if(false){

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
                                    .setDelay(40),
                                    colorirAngulo(angulo)
                                    .setValorInicial(0xaa00aa)
                                    .setValorFinal(0xff0000)
                                    .setDuration(20))
    }

    mostrarGrausAparecendo(angle, updateMostrarAnguloCadaFrame = false, mostrarEdesaparecer=true){


        if(!angle.mostrarAngulo){

            angle.mostrarAngulo = new MostrarAngulo(angle).addToScene(this.scene);
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
                                .setDuration(60)
                                .setCurva(x => {

                                    x = 1 - Math.abs(1 - x*2)

                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
                                .voltarAoInicio(false)
                                .manterExecucao(false)
                                .setOnTermino(() => mostrarAngulo.update({dentro:false}))
                                .setOnStart(() => {
                                    mostrarAngulo.update({dentro:true});
                                })

        if(!mostrarEdesaparecer){
            aparecerTexto.setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
            aparecerTexto.setOnTermino(() => null)
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

    mostrarGrausHighlightAngulos(poligono1,poligono2){

        //Uma série de animações sequenciais
        //Onde para cada angulo do polígono1, um angulo do polígono 2 também sofre highlight ao mesmo tempo
        return new AnimacaoSequencial()
               .setAnimacoes(
                    poligono1.angles
                    .map((angle1,index) => {

                        const angle2 = poligono2.angles[index];

                        
                        return new AnimacaoSimultanea(
                            this.highlightColorirAngulo(angle1), 
                            this.highlightColorirAngulo(angle2),
                            this.mostrarGrausAparecendo(angle1).setDuration(80),
                            this.mostrarGrausAparecendo(angle2).setDuration(80)
                        )
                    })
                )
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
                                            const equacaoDiv   = fase.whiteboard.equationList.children[0];

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

            animacao.setCheckpoint(false);

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
                                        const equacaoDiv   = fase.whiteboard.equationList.children[0];

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

        animacao.setCheckpoint(false);

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

    animacaoEscreverRazao(index, lado1, lado2, offset = new THREE.Vector3(0,0,0)){

        
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

        chaves.scene = this.scene;

        const desenharChave = chaves.animacao()
                                    .setDelay(200);

        const caixaDeTextoMathjax = this.createMathJaxTextBox("", offset.clone().add(new THREE.Vector3(1.65,0,0)).toArray())

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
                                        \\frac {{\\color{red}Lado~ ${index + 1}}}
                                         {{\\color{blue} Lado~ ${index + 1}}}  = 
                                         \\frac {{\\color{red}${comprimento2}}}
                                         {{\\color{blue}${comprimento1}}} = \\large{2}}`,
                                        0.4
                                )

                                this.scene.add(caixaDeTextoMathjax)
                            })


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


        const animacao = new AnimacaoSimultanea(
            mostrarEquacao,
            desenharChave
        )

        return new AnimacaoSequencial(animacao,moverEquacao).setCheckpoint(false);
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

               fase.firstDialogue();
            }
        },

        2: {
            satisfeito(){

                return true;
            },

            consequencia(fase){

               fase.secondDialogue();
            }
        },

        4: {

            satisfeito(){
                return true;
            },

            consequencia(fase){
                
                fase.outputClickVertice[2].update({clicado:true})
            },

            proximo(fase){
                return 180
            }
        },

        180: {
            //Se dois outputs de arraste tiverem finalizado(posições corretas), então 180° está satisfeito
            satisfeito: (fase) => fase.outputDragAngle.filter(output => output.estado.finalizado).length == 2,

            consequencia: (fase) => {

                fase.animar180Graus();

                fase.Configuracao4();

            },

            proximo: (fase) => 5,

            // estado: new Estado(this, "setupObjects", "Configuracao3", "180", {})
        },

        5: {
            satisfeito(fase){
                console.log(fase.informacao.angulosDeletados)
                return fase.informacao.angulosDeletados == 2;
            },

            consequencia(fase){
                
                fase.animar(fase.dialogo3());
            },
        }
    }

    appendOperadoresAJanelaEquacao(equationWindow){
        
        const selecionador = this.operadores.getOptions();

        equationWindow.appendChild(selecionador);
    }


    //Animações dos problemas
     //Funções, outputs etc. usados nos problemas

     
}
