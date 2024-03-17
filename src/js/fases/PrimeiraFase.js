import { Triangle } from "three";
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

export class PrimeiraFase extends Fase{

    constructor(){
    
        super();

        this.setupTextBox();
        this.changeText("")

        this.progresso = 0;
        this.setupObjects();
        this.createInputs();
        this.createOutputs();
        this.setupObjects();
        
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
                        ]);

        this.pentagono.grossura    = 0.025
        this.pentagono.raioVertice = 0.04;
        this.pentagono.raioAngulo  = 0.2;

        this.pentagono.render().escala(0.3,0.5,0).translacao(-1,-1,0)

        this.pentagono2  = new Poligono([
                            [0    ,   3   ,     0],
                            [pi   ,   pi  ,     0],
                            [pi   ,-pi*0.7,     0],
                            [-pi/2,-pi/2  ,     0], 
                            [-2   , 0     ,     0]
                        ]);

        this.pentagono2.grossura    = 0.025
        this.pentagono2.raioVertice = 0.04;
        this.pentagono2.raioAngulo  = 0.2;

        this.pentagono2.render().escala(0.605,1.01,0).translacao(2,-0.5,0)
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
            "Usando a carta dos 180°, sabemos que os ângulos tem que somar 180°.",
            "Logo, se temos dois ângulos, o terceiro é o que resta para chegar nos 180°."
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

        const segundaLinha = new AnimacaoSimultanea(
                                animarDialogo[1],
                                new AnimacaoSequencial().setAnimacoes(dividirLados).recalculateFrames()
                            );

        // const divisao = new Divisao(this.pentagono2.edges[0], this.pentagono.edges[0], null, new THREE.Vector3(4,-1,0)).addToScene(this.scene);

        this.animar(new AnimacaoSequencial(primeiraLinha, segundaLinha))
    }

    //Criação dos controles, input e output
    createInputs(){

        // new Hoverable(this.ponto2,this.camera);
        // new Draggable(this.ponto2, this.camera);
    }

    createOutputs(){
        // this.mostrarAngulo    = new MostrarAngulo(this.angle);
        // this.colorirPonto     = new ColorirOnHover(this.ponto2,0xaa0000,0xffff33).setCanvas(this);
        // this.colorirTracejado = new ColorirOnHover(this.ponto2.tracejado, 0xaa0000, 0xffff33).setCanvas(this);

        // //Função auxiliar para incrementar o contador do ângulo começando de 0
        // //Retorna uma closure
        // this.mostrarAngulo.increment = (() => {
        //     let a = 0; 
        //     return () => {
        //         this.mostrarAngulo.text.elemento.element.textContent = `${Math.round(this.angle.degrees)}° = ${a++} segmentos`
        //     }
        // })();

    }

    //Configurações, nesse caso o controle de arrastar o ponteiro
    Configuracao1(){
    }

    update(){
        // this.atualizarOptions();

        super.update();
        super.update();
        super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        // super.update();
        
        // if(options.atualizar) triangle.update();

        const problema = this.problemas[this.progresso];

        if(!problema) return console.log("Finalizado");

        if(problema.satisfeito(this)){
            problema.consequencia(this);
            this.progresso++;
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

    mostrarGrausAparecendo(angle){

        const mostrarAngulo = new MostrarAngulo(angle).addToScene(this.scene);

        const aparecerTexto = new Animacao()
                                .setValorInicial(0)
                                .setValorFinal(1)
                                .setInterpolacao((a,b,c) => a*(1-c) + b*c)
                                .setUpdateFunction((valor) => {
                                    mostrarAngulo.text.elemento.element.style.opacity = valor
                                })
                                .setDuration(60)
                                .setCurva(x => {

                                    x = 1 - Math.abs(1 - x*2)

                                    return -(Math.cos(Math.PI * x) - 1) / 2;
                                })
                                .voltarAoInicio(false)
                                .manterExecucao(false)
                                .setOnTermino(() => mostrarAngulo.update({dentro:false}))

        angle.mostrarAngulo = mostrarAngulo;

        return aparecerTexto;

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
                        ).setOnStart(() => {

                            angle1.mostrarAngulo.update({dentro:true});
                            angle2.mostrarAngulo.update({dentro:true});
                        })
                    })
                )
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

}
