import { AnimacaoSequencial, AnimacaoSimultanea } from "../animacoes/animation";
import { apagarCSS2 } from "../animacoes/apagarCSS2";
import { colorirAngulo } from "../animacoes/colorirAngulo";
import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Draggable } from "../inputs/draggable";
import { Hoverable } from "../inputs/hoverable";
import Bracket from "../objetos/bracket";
import { Output } from "../outputs/Output";
import * as THREE from 'three';
import InsideElipse from "../outputs/insideElipse";
import MostrarTexto from "../animacoes/MostrarTexto";
import DividirEmTriangulos from "../outputs/dividirEmTriangulos";
import { Objeto } from "../objetos/objeto";
import { apagarObjeto } from "../animacoes/apagarObjeto";
import { AnguloParalogramo } from "./anguloParalelogramo";
import imagemParalelogramoLado from '../../assets/CartaParalalogramoLado.png'
import imagemAnguloParalelogramo from '../../assets/anguloParalelogramo.png'
import { SomaDosAngulosTriangulo } from "./somaDosAngulos";
import { Triangle } from "../objetos/triangle";
import { Poligono } from "../objetos/poligono";
import { ApagarPoligono } from "../animacoes/apagarPoligono";

export class CriarTriangulo {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
    }

    dialogos = {
        inicio: "Clique nos vértices para dividir o polígono em triângulos",
        fim: "Agora novas cartas podem ser usadas nos triângulos criados"
    }

    //Quando a carta for arrastada, pega os triângulos da scene
    //Torna eles hoverable e adiciona um output quando estiverem em cima
    trigger(fase){

        const paralelogramos = fase.objetos;

        this.fase = fase;

        for(const paralelogramo of paralelogramos){

            //Por algum motivo, precisa sempre criar novos outputs

            if(!paralelogramo.hoverable){
                new Hoverable(paralelogramo, fase.camera);
            }

            // if(!this.verificadorDeHover)
                this.criarVerificadorDeHover(paralelogramo, fase.scene, fase.camera);
        }
    }
    
    accept(){

        const paralelogramo    = this.poligonoSelecionado
        
        alert(`Poligono ${(paralelogramo)? "encontrado" : "não encontrado"}`);

        return paralelogramo;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        //Pede para o usuário escolher os vértices do triângulo

        fase.animar(fase.animacaoDialogo(this.dialogos.inicio));


        this.controle = this.controleGeral();

        this.fase.adicionarControleDaCarta(this.controle);

        this.dividirEmTriangulos = new DividirEmTriangulos(this.poligonoSelecionado, this.fase);

        this.controle.addInputs(this.dividirEmTriangulos);
        //Cria o triângulo baseado nos vértices escolhidos

        //Criar outputs para todos os vértices
    }



    //OUTPUTS

    criarVerificadorDeHover(paralelogramo, scene, camera){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(novoEstado){

                                const paralelogramoRenderizado = paralelogramo.renderedInScene();

                                this.estado.valido = novoEstado.dentro && paralelogramoRenderizado;

                                carta.poligonoSelecionado = paralelogramo;

                            })
                            .addInputs(paralelogramo.hoverable);

        this.outputs.push(verificador);

        this.verificadorDeHover = verificador; 
    }

    //Output clicar nos vertices criar Tracejado
    //Cria triângulo e manda de volta para os objetos da fase
    //Adiciona essa carta na pilha quando terminar a execução

    controleGeral(){

        const fase  = this.fase;
        const carta = this;


        //Só suporta um triângulo desenhado
        return new Output()
               .setUpdateFunction(function(novoEstado){

                    if(novoEstado.trianguloCompleto){

                        const dialogo = carta.fase.animacaoDialogo(carta.dialogos.fim);

                        fase.animar(dialogo);

                        const info = carta.handleTermino(novoEstado);

                        this.notify(info);
                    }
                    
               })
               .setEstadoInicial({
                    triangulosDesenhados: 0
               })
    }

    handleTermino(estado){

        const fase = this.fase;

        const apagarTriangulos = new AnimacaoSimultanea()
                                    .setAnimacoes(
                                        estado.triangulosAtivos
                                       .map(triangulo => apagarObjeto(triangulo)
                                                         .setOnTermino(() => triangulo.removeFromScene())
                                        )
                                    );

        this.fase.animar(apagarTriangulos);

        const lateral = this.checkSentidoTriangulo(estado.VerticesSelecionados);

        const triangulos = this.createTriangulos(estado.VerticesSelecionados);
                    
        //Botar isso para o controle interface entre carta e fase
        // if(lateral){
        //     fase.cartas = [{tipo: AnguloParalogramo, imagem: imagemAnguloParalelogramo}];
        // }
        // else{
        //     fase.cartas = [{tipo: SomaDosAngulosTriangulo, imagem: imagemParalelogramoLado}];
        // }

        // fase.settings.ativarMenuCartas(false);
        // fase.settings.ativarMenuCartas(true);

        return {
            triangulos: triangulos, 
            sentido: lateral,
            carta: "CriarTriangulo"
        };
    }

    //Verifica o tipo de corte diagonal do triângulo
    checkSentidoTriangulo(verticesSelecionados){

        const verticesIndices = verticesSelecionados.map(vertice => this.poligonoSelecionado.vertices.indexOf(vertice));

        const triangulosAceitos = [[0,1,3], [1,2,3]];

        const valeParaTodos = (a,b) => a && b;
        const valeParaAlgum = (a,b) => a || b;

        const lateral = triangulosAceitos
                        .map(
                            trianguloAceito => verticesIndices.map(indice => trianguloAceito.includes(indice))
                                                              .reduce(valeParaTodos, true)
                        )
                        .reduce(valeParaAlgum, false);

        return lateral;
    }

    createTriangulos(verticesSelecionados){

        const verticeOposto = this.poligonoSelecionado.vertices.filter(vertice => !verticesSelecionados.includes(vertice))[0];

        const indiceOposto = this.poligonoSelecionado.vertices.indexOf(verticeOposto);

        const numeroVertices = this.poligonoSelecionado.numeroVertices;


        const verticeProximo = (indice)  => this.poligonoSelecionado.vertices[(indice + 1) % numeroVertices];
        const verticeAnterior = (indice) => this.poligonoSelecionado.vertices[(indice + numeroVertices - 1) % numeroVertices];

        const verticesOpostos = [
            verticeAnterior(indiceOposto), 
            verticeOposto, 
            verticeProximo(indiceOposto)
        ];

        const triangulo1 = new Poligono(verticesSelecionados.map(v => v.getPosition().toArray()))
                                .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                                .render()
                                .nomearVertices(...verticesSelecionados.map(v => v.variable.name));

        const triangulo2 = new Poligono(verticesOpostos.map(v => v.getPosition().toArray()))
                                .configuration({grossura:0.025, raioVertice:0.04, raioAngulo:0.2})
                                .render()
                                .nomearVertices(...verticesOpostos.map(v => v.variable.name));
 

        const mostrarTriangulo1 = new ApagarPoligono(triangulo1)
                                .reverse()
                                .setOnStart(() => triangulo1.addToScene(this.fase.scene));

        const mostrarTriangulo2 = new ApagarPoligono(triangulo2)
                                .reverse()
                                .setOnStart(() => triangulo2.addToScene(this.fase.scene));

        

        const animacao = new AnimacaoSimultanea(mostrarTriangulo1, mostrarTriangulo2);

        this.fase.animar(animacao);

        this.fase.objetos.push(triangulo1, triangulo2);

        return [triangulo1, triangulo2];
    }
}