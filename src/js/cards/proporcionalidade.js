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
import MoverEquacao from "../animacoes/moverEquacao";
import { Clickable } from "../inputs/clickable";

export default class Proporcionalidade {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
    }

    
    //Torna eles hoverable e adiciona um output quando estiverem em cima
    trigger(fase){

        this.fase = fase;
    }
    
    //Se tiver qualquer objeto interativo na cena
    accept(){

        const objetosProporcionais = fase.informacao.objetosProporcionais;


        for(const objetoInfo of objetosProporcionais){

            this.controleSelecionarObjeto(objetoInfo);
            
        }

        alert(` Objetos proporcionais ${(objetosProporcionais.length)? "existem" : "não existem"}`);

        return objetosProporcionais.length;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;



        //Transformar isso em uma pilha?
        //Fase agora lida com esse controle
        // Retorna uma equação de igualdade dos lados
        // Mudar texto da caixa de diálogos para ensinar jogador
    }



    //OUTPUTS


    //Transformar em controle geral
    // controleArrastarLados(){

    //     const carta = this;

    //     const paralelogramo = this.paralelogramoSelecionado;

    //     //Outputs auxiliares

    //     carta.colorirArestas = [
    //         this.criarColorirArestaSelecionada(paralelogramo.edges[2], 0xe828282),
    //         this.criarColorirArestaSelecionada(paralelogramo.edges[0], 0xffff00),
    //         this.criarColorirArestaSelecionada(paralelogramo.edges[3], 0xe828282),
    //         this.criarColorirArestaSelecionada(paralelogramo.edges[1], 0xffff00)
    //     ];

    //     const moverLadosLaterais  = this.criarMoverLados(paralelogramo.edges[2], paralelogramo.edges[0]);
    //     const moverLadosVerticais = this.criarMoverLados(paralelogramo.edges[3], paralelogramo.edges[1]);


    //     const dialogos = {
    //         primeiroLadoMovido1: `Temos agora três lados conhecidos, `,
    //         primeiroLadoMovido2: `Use o mesmo raciocinio com o lado restante para obter seu valor`,
    //         ultimoLadoMovido: `Muito bem, agora conhecemos todos os lados`
    //     }

    //     //Controle propriamente dito
    //     return new Output()
    //            .setName('Controle Arraste') 
    //            .addInputs(moverLadosLaterais, moverLadosVerticais)
    //            .setUpdateFunction(function(novoEstado){

    //                 const estado = this.estado;
                    
    //                 const lado       = novoEstado.ladoOriginal; 
    //                 const ladoOposto = novoEstado.ladoSelecionado;
    //                 const ultimaPosicao = novoEstado.ultimaPosicaoDoLadoOriginal;

    //                 //Desativa todos os outputs como mover lado e colorir
    //                 lado.removeAllOutputs();
    //                 ladoOposto.removeAllOutputs();

    //                 carta.colorirArestas.map(arestaColorida => arestaColorida.update({dentro:false}));

    //                 estado.ladosConhecidos++;

    //                 const avisarSeControleTerminou = () => this.notify({execucaoTerminada: estado.ladosConhecidos == paralelogramo.numeroVertices})

    //                 //Só anima comentário depois de executar as animações da equação
    //                 //Quando terminado diálogo, notifica termino dessa execução
    //                 carta.criarEquacao(lado, ladoOposto, ultimaPosicao)
    //                      .setOnStart(
    //                         () => animarComentario(estado.ladosConhecidos)
    //                              .setOnTermino(avisarSeControleTerminou)
    //                      )
    //                      .setOnTermino(() =>{
    //                          this.notify({}) //Atualiza o valor das aresta que tem esse controle como input
    //                      })
    //            })
    //            .setEstadoInicial({
    //                 ladosConhecidos: paralelogramo.edges.filter(aresta => aresta.variable.value).length
    //             })

    //     //Funções auxiliares:

    //     //Função para ser rodada no término do criarEquacao
    //     function animarComentario(ladosConhecidos){

    //         let animacaoDialogo;

    //         if(ladosConhecidos == 3){
                
    //             animacaoDialogo = new AnimacaoSequencial(
    //                                 carta.fase.animacaoDialogo(dialogos.primeiroLadoMovido1), 
    //                                 carta.fase.animacaoDialogo(dialogos.primeiroLadoMovido2)
    //                             );

    //             animacaoDialogo.setNome("Dialogo Carta");

    //             carta.fase.animar(animacaoDialogo);
    //         }

    //         if(ladosConhecidos == 4){
                
    //             animacaoDialogo = carta.fase.animacaoDialogo(dialogos.ultimoLadoMovido);

    //             animacaoDialogo.setNome("Dialogo Carta");

    //             carta.fase.animar(animacaoDialogo);
    //         }

    //         return animacaoDialogo;
    //     }
    // }

    //Controle selecionar objeto, retorna equação
  
    controleSelecionarObjeto(informacao){


        //Seleciono um objeto, ele retorna um nome e uma propriedade se tiver 
        //Por exemplo, a hora do círculo tem uma propriedade com nome x horas tem y°
        //O lado do polígono vai dizer lado poligono 1 tem 4cm
        //fase.informacao.objetosProporcionais = [{objeto:, nome: , atributo: , equacao: }]

        const fase = this.fase;

        if(!informacao.objeto.clickable) new Clickable(informacao.objeto);

        return new Output()
               .addInputs(informacao.objeto.clickable)
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;


                    if(novoEstado.clicado && !estado.ativado){
                        //Retorna novo valor equação css2d

                        const equacao = informacao.equacao;
                        const posicao = informacao.posicao;
                        const tamanhoFonte = informacao.tamanhoFonte

                        const equationBox = fase.createMathJaxTextBox(equacao, posicao, tamanhoFonte);

                        fase.animar(new MoverEquacao(equationBox, fase, equacao, null, 60,60,60));

                        estado.ativado = true;
                    }
               })
    }


    //Controle juntar equações e verificar razão
    //Junto duas equações e retorno a razão entre elas
}