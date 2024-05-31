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
import imagemParalelogramoLado from '../../assets/CartaParalalogramoLado.png'
import { MoverGrausParaPosicaoEquacao } from "../animacoes/moverGrausParaPosicaoEquacao";

//Consertar: mostrar igualdade de ângulo (valor inicial cortando delta YZW)
//           tamanho dos vertices (Muito pequeno)
//           Cor da aresta do meio quando engrossando
//           Posição da aresta horizontal quando arrastando
//           Hitbox dos lados e suas cores


//Refatorar depois, código improvisado na pressa
export class SomaDosAngulosTriangulo {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.outputs = [];
    }

    static imagem = this.imagem = imagemParalelogramoLado;

    dialogos = {
        inicio: "A soma dos ângulos internos de um triângulo é 180°",
        UmDesconhecido: "Como existe um ângulo desconhecido, vamos dar a ele um nome",
        Calcular: "Resolva a equação dada para achar os ângulos"

    }

    //Quando a carta for arrastada, pega os triângulos da scene
    //Torna eles hoverable e adiciona um output quando estiverem em cima
    trigger(fase){

        const triangulos = fase.objetos.filter(objeto => objeto.isTriangulo && objeto.isTriangulo());

        this.fase = fase;

        this.controle = this.criarControleGeral();

        fase.adicionarControleDaCarta(this.controle);

        for(const triangulo of triangulos){

            //Por algum motivo, precisa sempre criar novos outputs

            if(!triangulo.hoverable){
                new Hoverable(triangulo, fase.camera);
            }

            // if(!this.verificadorDeHover)
            const verificador = this.criarVerificadorDeHover(triangulo, fase.scene, fase.camera);

        }
    }
    
    accept(){

        const paralelogramo    = this.trianguloSelecionado

        const todosLadosConhecidos = false;

        alert(`paralelogramo ${(paralelogramo)? "encontrado" : "não encontrado"}`);

        alert(`paralelogramo com ângulos desconhecidos:${(!todosLadosConhecidos) ? " SIM - Aceito" : "NÃO - Rejeitado"}`);

        return paralelogramo && !todosLadosConhecidos;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        const triangulo = this.trianguloSelecionado;

        const dialogo = fase.animacaoDialogo(this.dialogos.inicio);


        // const angulosDesconhecidos = triangulo.angles.filter(angle => !angle.variable.value);

        // for(const angulo of angulosDesconhecidos){

        //     if(!angulo.MostrarAngulo) new MostrarAngulo(angulo).addToFase(this.fase);

        //     const vertices = circularShift(triangulo.vertices, angulo.index);

        //     angulo.variable.name = vertices.map(vertice => vertice.variable.name).join('');

        //     alert(angulo.variable.name)

        //     console.log(vertices, vertices.map(vertice => vertice.variable), vertices.map(vertice => vertice.variable.name).join(''))

        //     this.adicionarAcento(angulo.variable.nome, 0, "\u0302");

        //     fase.animar(angulo.mostrarAngulo.animacao(true));
        // }

        const moverAngulos = new MoverGrausParaPosicaoEquacao(triangulo.angles, fase);

        fase.animar(dialogo);
        fase.animar(moverAngulos.setOnTermino(() => this.controle.update({ativado:true})));

        //Planejamento:

        //1 - Dividir o paralelogramo em dois triângulos baseado no ângulo conhecido -> feito
        //2 - Mostrar que eles são iguais pois os triângulos são iguais -> feito
        //3 - Dividir o paralelogramo em dois triângulos baseado nos dois ângulos desconhecidos
        //4 - Usar a carta dos 180° para mostrar que o ângulo restante pode ser calculado

        //1.1 - Animação dividir paralelogramos
    }



    //OUTPUTS

    criarVerificadorDeHover(triangulo, scene, camera){

        const carta = this;

        const verificador = new Output()
                            .setUpdateFunction(function(novoEstado){

                                const renderizado = triangulo.renderedInScene();

                                this.estado.valido = novoEstado.dentro && renderizado;

                                carta.trianguloSelecionado = triangulo;

                                this.notify({dentro: novoEstado.dentro, triangulo: triangulo})

                                this.ativar(false);

                            })
                            .addInputs(triangulo.hoverable);

        this.outputs.push(verificador);

        return verificador; 
    }


    criarControleGeral(){

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    if(novoEstado.ativado){
                        this.notify({...novoEstado, carta: "SomaDosAngulosTriangulo"});
                    }
               })
    }

     //Controle intermediário, move um lado apenas

     adicionarAcento(str, position, accentChar) {
        if (position < 0 || position >= str.length) {
            throw new Error("Position out of bounds");
        }
        // Split the string into two parts
        let before = str.slice(0, position + 1);
        let after = str.slice(position + 1);
    
        // Add the accent character
        let accentedChar = str.charAt(position) + accentChar;
    
        // Combine the parts back together
        return before + accentChar + after;
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