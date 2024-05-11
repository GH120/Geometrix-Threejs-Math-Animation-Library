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

export class LadoParalogramo {


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

        const todosLadosConhecidos = paralelogramo.edges.filter(edge => edge.variable.value).length == paralelogramo.edges.length;

        alert(`paralelogramo ${(paralelogramo)? "encontrado" : "não encontrado"}`);

        alert(`paralelogramo ${(!todosLadosConhecidos) ? "retângulo: ACEITO" : "não retângulo: REJEITADO"}`);

        return paralelogramo && !todosLadosConhecidos;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        fase.adicionarControleDaCarta(this.controleArrastarLados());

        const dialogo = new AnimacaoSequencial(fase.animacaoDialogo("Os lados agora são arrastáveis, arraste um conhecido para seu oposto e veja o que acontece"));
        
        dialogo.setNome("Dialogo Carta")

        dialogo.setOnStart(  () => this.colorirArestas.map(colorir => colorir.update({dentro: true})));
        dialogo.setOnTermino(() => this.colorirArestas.map(colorir => colorir.update({dentro: false})));

        fase.animar(dialogo)

        
        //Transformar isso em uma pilha?
        //Fase agora lida com esse controle
        // Retorna uma equação de igualdade dos lados
        // Mudar texto da caixa de diálogos para ensinar jogador
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
}