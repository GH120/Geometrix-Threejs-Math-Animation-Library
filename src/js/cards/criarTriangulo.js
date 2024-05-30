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

export class CriarTriangulo {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
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

        const paralelogramo    = this.paralelogramoSelecionado
        
        alert(`Poligono ${(paralelogramo)? "encontrado" : "não encontrado"}`);

        return paralelogramo;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        //Pede para o usuário escolher os vértices do triângulo

        const dialogo = ["Clique nos vértices para desenhar o triângulo"]

        fase.animar(fase.animacaoDialogo(dialogo[0]));

        new DividirEmTriangulos(this.paralelogramoSelecionado, this.fase);
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

                                carta.paralelogramoSelecionado = paralelogramo;

                            })
                            .addInputs(paralelogramo.hoverable);

        this.outputs.push(verificador);

        this.verificadorDeHover = verificador; 
    }

    //Output clicar nos vertices criar Tracejado
    //Cria triângulo e manda de volta para os objetos da fase
    //Adiciona essa carta na pilha quando terminar a execução

    controleGeral(){


        return new Output()
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.dentro){

                        const vertice = novoEstado.alvo;

                        if(estado.verticesSelecionados.includes(vertice)){

                        }
                    }
               })
               .setEstadoInicial({
                    verticesSelecionados: []
               })
    }
}