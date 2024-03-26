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

export class PrimeiraFase extends Fase{

    constructor(){
    
        super();

        this.setupTextBox();
        this.changeText("")

        this.progresso = 0;
        this.setupObjects();
        this.createInputs();
        this.createOutputs();
        
    }

    //Objetos básicos
    setupObjects(){

        const pi = Math.PI;

        this.triangulo1 = new Triangle([[-2,0,0], [3,0,0], [1,3,0]]);

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
    }

    //Objetos temporários ou secundários
    setupObjects2(){
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

        const dialogo1 = [
            "Vimos que dois poligonos são semelhantes quando seus ângulos são congruentes(iguais  overtext )",
            "e seus respectivos lados são proporcionais.", 
            "Como os triângulos são os polígonos mais simples,",
            "também são os mais fáceis de ver se são semelhantes."
        ]

        //Desenhar um polígono pequeno, desenhar outro polígono maior
        //highlight dos ângulos respectivos em cada triângulo
        //highlight dos lados 
        //Apaga polígonos e desenha o triângulo

        const animarDialogo = dialogo1.map(texto => new TextoAparecendo(this.text.element).setOnStart(() => this.changeText(texto)).setValorFinal(100));

        this.pentagono.addToScene(this.scene);

        this.pentagono2.addToScene(this.scene);

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

                                return new Divisao(lado2,lado1,null,new THREE.Vector3(4.5 + index*0.5,0,0)).addToScene(this.scene);
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


        const animacao = new AnimacaoSequencial(
                            primeiraLinha, 
                            segundaLinha, 
                            terceiraLinha, 
                            quartaLinha
                        )
                        .setOnTermino(() => this.progresso = 2)

        this.animar(animacao);
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

        const copiasDosAngulos =  this.triangulo.angles
                                                .map(   angle => angle.copiaDoAngulo)
                                                .filter(copia => copia != undefined);

        for(const copia of copiasDosAngulos){

            const outputDeletarAngulo = this.deletarAngulo(copia);

            copia.clickable.addObserver(outputDeletarAngulo);

            copia.updateHitboxPosition();
        }
    }

    //Agora é a configuração 1
    // ligarInputAoOutput(){

    //     const vertices = this.triangulo.vertices;
    //     const angles   = this.triangulo.angles;

    //     //Liga o vertice.clickable input ao output
    //     for (let i = 0; i < 3; ++i) {

    //         const vertice = vertices[i];

    //         vertice.clickable.addObserver(this.outputClickVertice[i])
    //     }

    //     //Liga o angulo.draggable ao output do draggable
    //     for (let i = 0; i < 3; ++i) {

    //         const angulo = angles[i];

    //         angulo.draggable.addObserver(this.outputDragAngle[i]);
    //     }
    // }


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

                    console.log(estadoNovo)

                    if(estadoNovo.clicado){

                        //Deleta o ângulo através de animação

                        animacaoDeletar();
                    }
               })

        //Funções auxiliares
        function decrementarContador(){

            angle.removeFromScene();

            //Decrementa o total da equação
        }

        function animacaoDeletar(){

            const animacao = new AnimacaoSimultanea(
                                apagarObjeto(angle)
                                .setOnTermino(decrementarContador),

                                fase.mostrarGrausDesaparecendo(angle)
                            )

            fase.animar(animacao);
        }
    }


    update(){
        // this.atualizarOptions();

        super.update();
        
        

        if(this.progresso<4){

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
        }
    }

    //Animações

    highlightColorirAngulo(angulo){
        return new AnimacaoSequencial(colorirAngulo(angulo)
                                    .setValorInicial(0xff0000)
                                    .setValorFinal(0xffff00)
                                    .setDuration(30),
                                    colorirAngulo(angulo)
                                    .setValorInicial(0xffff00)
                                    .setValorFinal(0xff0000)
                                    .setDuration(30))
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
                            this.mostrarGrausAparecendo(angle1),
                            this.mostrarGrausAparecendo(angle2)
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

        // const moverTexto = new MoverTexto()
        //                       .setOnStart(function(){ 
                                
        //                             const elementoCSS2 = angulo180graus.mostrarAngulo.text.elemento;

        //                             this.setText(elementoCSS2)
        //                             this.setSpline([
        //                                 elementoCSS2.position.clone(),
        //                                 new THREE.Vector3(5,1,0),
        //                                 new THREE.Vector3(3,3,0),
        //                                 new THREE.Vector3(2.8,3.5,0)
        //                             ])
        //                        })

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
                        new AnimacaoSimultanea().setAnimacoes([...angulos.map(angulo => this.mostrarGrausAparecendo(angulo,false,false).setOnStart(() => null)), apagar180Graus])
                    ),
                );

    }

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

            proximo: (fase) => "finalizado",

            // estado: new Estado(this, "setupObjects", "Configuracao3", "180", {})
        }
    }

    //Cria a equação da regra de 3, útil para os problemas
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


    //Animações dos problemas
     //Funções, outputs etc. usados nos problemas

     
}
