//Controle que abre a tela de equações, só funciona nela
//Seleciona os lados do polígono, se não houver o suficiente falha
//Se tiver todos os lados proporcionais, então comprime eles na propriedade lados proporcionais (com razão lado1/lado2 = x)
//Soma dos angulos internos de um triângulo é 180°

import Animacao, { AnimacaoSequencial, AnimacaoSimultanea, animacaoIndependente } from "../animacoes/animation";
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
import { Tracejado } from "../objetos/tracejado";
import { mover } from "../animacoes/mover";
import { Triangle } from "../objetos/triangle";
import { ApagarPoligono } from "../animacoes/apagarPoligono";
import { Poligono } from "../objetos/poligono";
import { apagarObjeto } from "../animacoes/apagarObjeto";
import { Objeto } from "../objetos/objeto";
import { Clickable } from "../inputs/clickable";
import MetalicSheen from "../animacoes/metalicSheen";
import { MostrarBissetriz } from "../outputs/mostrarBissetriz";
import { MostrarAngulo } from "../outputs/mostrarAngulo";
import imagemGrama from '../../assets/sky.webp'
import { MoverGrausParaPosicaoEquacao } from "../animacoes/moverGrausParaPosicaoEquacao";

//Consertar: mostrar igualdade de ângulo (valor inicial cortando delta YZW)
//           tamanho dos vertices (Muito pequeno)
//           Cor da aresta do meio quando engrossando
//           Posição da aresta horizontal quando arrastando
//           Hitbox dos lados e suas cores


//Refatorar depois, código improvisado na pressa
export class AngulosIguais {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.outputs = [];
    }

    static imagem = this.imagem = imagemGrama;

    dialogos = {
        inicio: "Selecione os polígonos com angulos iguais clicando neles",
        meio: "Selecione outro polígono para comparar ângulos",
        fim: "Com ângulos congruentes, falta apenas lados proporcionais para obter semelhança"
    }

    //Quando a carta for arrastada, pega os triângulos da scene
    //Torna eles hoverable e adiciona um output quando estiverem em cima
    trigger(fase){

        const objetos = fase.objetos;

        this.fase = fase;

        this.controle = this.criarControleGeral();

        for(const objeto of objetos){

            if(!objeto.clickable) new Clickable(objeto, fase.camera);
            
            const controleClick = this.criarControleClick(objeto);

            this.controle.addInputs(controleClick);
        }

       

        fase.adicionarControleDaCarta(this.controle);
    }
    
    accept(){

        const paralelogramo    = this.trianguloSelecionado

        const todosLadosConhecidos = false;

        return true
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        const triangulo = this.trianguloSelecionado;

        const dialogo = fase.animacaoDialogo(this.dialogos.inicio);

        fase.animar(dialogo);
    }



    //OUTPUTS

    criarControleClick(objeto){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(novoEstado){

                                const estado = this.estado;

                                if(novoEstado.clicado){
                                    // carta.selecionar(objeto);

                                    this.notify({objeto: objeto});
                                    this.ativar(false);
                                }

                                if(novoEstado.dentro){
                                    // carta.highlightObjeto(objeto);
                                }
                                else if(novoEstado.dentro == false){
                                    // carta.highlightObjeto(objeto, false)
                                }
                            })
                            .addInputs(objeto.clickable);

        this.outputs.push(verificador);

        return verificador; 
    }


    criarControleGeral(){

        const carta = this;

        const fase = this.fase;

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.objeto){

                        estado.objetosSelecionados.push(novoEstado.objeto);


                        const quantidade = estado.objetosSelecionados.length;

                        if(quantidade == 1){

                            const dialogo = fase.animacaoDialogo(carta.dialogos.meio);

                            fase.animar(dialogo);
                        }
                        else{
                            // const dialogo = fase.animacaoDialogo(carta.dialogos.fim);

                            // fase.animar(dialogo);

                            //Não verifica ainda se são de fato proporcionais
                            const notificarFimExecucao = () => this.notify({carta: "AngulosIguais"})

                            carta.animarLadosProporcionais(estado.objetosSelecionados)
                                 .setOnTermino(notificarFimExecucao);

                            this.observed.map(input => input.removeInputs()); //Remove todos os clickVertice

                        }
                    }
               })
               .setEstadoInicial({
                    objetosSelecionados: [],
                    etapa: 0
               })
    }

    animarLadosProporcionais(objetos){

        const fase = this.fase;


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


        objetos = objetos.sort((a,b) => a.edges[0].length > b.edges[0].length);

        console.log(...objetos, objetos.map(objeto => objeto.edges[0].length));

        const angulosIguais   = new AnimacaoSequencial(
            fase.animacaoColorirAngulosIguais(objetos[1], objetos[0], equacoes),
            fase.animacaoEquacoesVirandoUmaSo('primeiroDialogo', equacoes.angulosIguais, 2)
        );

        fase.animar(angulosIguais);

        return angulosIguais
    }

    
}

function arrayRotate(arr, reverse=true) {
    if (reverse) arr.unshift(arr.pop());
    else arr.push(arr.shift());
    return arr;
  }

  function circularShift(array, count){
    
    let copia = array.map(e => e);

    for(let i =0; i< count; i++ ){

        arrayRotate(copia);
    }

    return copia;
  }