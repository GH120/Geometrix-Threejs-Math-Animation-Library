import { AnimacaoSequencial, AnimacaoSimultanea } from "../animacoes/animation";
import { apagarCSS2 } from "../animacoes/apagarCSS2";
import { colorirAngulo } from "../animacoes/colorirAngulo";
import { TextoAparecendo } from "../animacoes/textoAparecendo";
import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Draggable } from "../inputs/draggable";
import { Hoverable } from "../inputs/hoverable";
import { HoverPosition } from "../inputs/position";
import Bracket from "../objetos/bracket";
import { Output } from "../outputs/Output";
import * as THREE from 'three';
import InsideElipse from "../outputs/insideElipse";
import MostrarTexto from "../animacoes/MostrarTexto";
import MostrarTracejado from "../animacoes/mostrarTracejado";

export class AnguloParalogramo {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
        this.tracejados = {}
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

        alert(`paralelogramo com ângulos desconhecidos:${(!todosLadosConhecidos) ? " SIM - Aceito" : "NÃO - Rejeitado"}`);

        return paralelogramo && !todosLadosConhecidos;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        const paralelogramo = this.paralelogramoSelecionado;

        const dialogo = fase.animacaoDialogo(this.dialogos.inicio);

        dialogo.setNome("Dialogo Carta");

        fase.animar(dialogo);

        //Planejamento:

        //1 - Dividir o paralelogramo em dois triângulos baseado no ângulo conhecido
        //2 - Mostrar que eles são iguais pois os triângulos são iguais
        //3 - Dividir o paralelogramo em dois triângulos baseado nos dois ângulos desconhecidos
        //4 - Usar a carta dos 180° para mostrar que o ângulo restante pode ser calculado

        //1.1 - Animação dividir paralelogramo

        const dialogos = {
            inicio: "Vamos usar o ângulo conhecido para descobrir o restante",
            divisaoAnguloIgual1: "Podemos dividir o paralelogramo em dois triângulos",
            divisaoAnguloIgual2: "Arraste os lados amarelos para os cinza",
    
            //Colore um azul e o outro vermelho
            divisaoAnguloIgual3: "Veja, os lados do ângulo desconhecido são os mesmos do conhecido",
    
            //Cria uma aresta solida no lugar do tracejado, cor amarela
            //Arrasta o ângulo desconhecido ao original, formando um triângulo superior
            //Retorna os lados as suas poisções e o ângulo também, formando o paralelogramo novamente
            //Aparece o mostrarAngulo do ângulo desconhecido
            divisaoAnguloIgual4: "Logo, são os dois ângulos são iguais"
    
        }
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

    inicio(){

        const paralelogramo = this.paralelogramoSelecionado;

        const n = paralelogramo.numeroVertices;

        //Função para conseguir proximo indice circular 
        const proximoIndice = (i, step) => (i < 0)? (i + n - step) % n : (i + step) % n;

        const anguloConhecido = paralelogramo.angles.filter(angle => angle.variable.value);

        const indiceAnguloOposto = proximoIndice(anguloConhecido.index, n/2);

        const anguloOposto = paralelogramo.angles[indiceAnguloOposto];
        

        const lados = [
            paralelogramo.edges[indiceAnguloOposto], 
            paralelogramo.edges[proximoIndice(indiceAnguloOposto)]
        ];

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    //Começa com o desenhar tracejado e explicando funcionamento
                    //Pede para arrastar os dois lados

                    //Moveu os dois lados:
                    //Mudar etapa para arrastar angulo
                    
                    //Angulos iguais
               })
               .setEstadoInicial({
                    etapa:              this.dialogos.inicio,
                    anguloConhecido:    anguloConhecido,
                    anguloDesconhecido: anguloOposto,
                    ladosSelecionados:  lados,
                    ladosMovidos:       0
               })
    }

    animacaoDividirParalelogramo(vertice1, vertice2){

        const desenharTracejado = MostrarTracejado()
    }


    dialogos = {
        inicio: "Vamos usar o ângulo conhecido para descobrir o restante",
        divisaoAnguloIgual1: "Podemos dividir o paralelogramo em dois triângulos",
        divisaoAnguloIgual2: "Arraste os lados amarelos para os cinza",

        //Colore um azul e o outro vermelho
        divisaoAnguloIgual3: "Veja, os lados do ângulo desconhecido são os mesmos do conhecido",

        //Cria uma aresta solida no lugar do tracejado, cor amarela
        //Arrasta o ângulo desconhecido ao original, formando um triângulo superior
        //Retorna os lados as suas poisções e o ângulo também, formando o paralelogramo novamente
        //Aparece o mostrarAngulo do ângulo desconhecido
        divisaoAnguloIgual4: "Logo, são os dois ângulos são iguais"

    }
}