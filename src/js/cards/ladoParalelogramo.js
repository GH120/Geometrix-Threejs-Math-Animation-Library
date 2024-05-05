import { AnimacaoSimultanea } from "../animacoes/animation";
import { apagarCSS2 } from "../animacoes/apagarCSS2";
import { TextoAparecendo } from "../animacoes/textoAparecendo";
import { Addition, Equality, Square, Value } from "../equations/expressions";
import { Draggable } from "../inputs/draggable";
import { Hoverable } from "../inputs/hoverable";
import Bracket from "../objetos/bracket";
import { Output } from "../outputs/Output";
import * as THREE from 'three';

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

        const paralelogramoValido    = this.outputs.filter(output => output.estado.valido);

        const paralelogramoRetangulo = paralelogramoValido.length;

        alert(`paralelogramo ${(paralelogramoValido.length)? "encontrado" : "não encontrado"}`);

        alert(`paralelogramo ${paralelogramoRetangulo? "retângulo: ACEITO" : "não retângulo: REJEITADO"}`);

        return paralelogramoRetangulo;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        const paralelogramo = this.paralelogramoSelecionado;

        fase.animar(fase.animacaoDialogo("Os lados agora são arrastáveis, arraste um para o outro e veja o que acontece"))

        this.criarMoverLados(paralelogramo.edges[2], paralelogramo.edges[0]);
        // Retorna uma equação de igualdade dos lados
        // Mudar texto da caixa de diálogos para ensinar jogador
    }

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

    criarMoverLados(lado, ladoOposto){

        //Criar um suboutput para verificar se sobrevoa sobre um elemento?

        const carta = this;

        if(this.criadoMoverLados) return;

        this.criadoMoverLados = true;

        new Draggable(lado, this.fase.camera);
        new Hoverable(lado, this.fase.camera);
        new Hoverable(ladoOposto, this.fase.camera);


        const moverLados = new Output()
                           .setUpdateFunction(function(novoEstado){

                                const estado = this.estado;

                                //Tratar seleção do lado principal
                                //Transformar em suboutput?
                                if(novoEstado.alvo == lado){

                                    if(novoEstado.dentro){
                                        estado.mouseSobreLadoPrincipal = true;
                                    }
                                    
                                    if(novoEstado.dentro == false){
                                        estado.mouseSobreLadoPrincipal = false;
                                    }
                                }
                                
                                if(estado.mouseSobreLadoPrincipal && novoEstado.dragging && !estado.arrastando){

                                    estado.arrastando    = true;
                                    estado.ultimaPosicao = lado.origem.clone();
                                    estado.direcao = ladoOposto.getPosition().sub(lado.getPosition()).normalize();

                                }

                                //Arrastar lado principal
                                if(estado.arrastando && novoEstado.dragging){

                                    const distanciaPercorrida = novoEstado.position
                                                                          .sub(lado.getPosition())
                                                                          .dot(estado.direcao);

                                    const deslocamento = estado.direcao.clone()
                                                                       .multiplyScalar(distanciaPercorrida)

                                    //Criar uma função para atualizar posição?
                                    //Como os lados tem uma rotação de 90°, precisam ser atualizados quando mudada a posição

                                    lado.origem.add(deslocamento);
                                    lado.destino.add(deslocamento);

                                    lado.update();
                                }

                                //Fim do arraste

                                if(estado.arrastando && novoEstado.dragging == false){
                                    
                                    estado.verificar  = true;
                                }

                                //Verificar se está dentro do lado paralelo

                                if(novoEstado.alvo == ladoOposto){
                                        
                                    if(novoEstado.dentro){
                                        estado.ladoOpostoSelecionado = true;
                                    }

                                    if(estado.dentro == false){
                                        estado.ladoOpostoSelecionado = false;
                                    }
                                }

                                if(estado.verificar){

                                    if(estado.ladoOpostoSelecionado == true){

                                        carta.criarEquacao(lado, ladoOposto, estado.ultimaPosicao);

                                        estado.verificar = false;
                                    }

                                    if(!estado.ladoOpostoSelecionado){

                                        carta.voltarAoInicio(lado, estado.ultimaPosicao);

                                        estado.verificar = false;
                                    }
                                }

                                //Se sim, retornar a equação
                           })
                           .setEstadoInicial({
                                mouseSobreLadoPrincipal: false,
                                arrastar: false,
                                ladoOpostoSelecionado: false,
                                verificar: false,
                            })
                           .addInputs(
                                lado.draggable, 
                                lado.hoverable,
                                ladoOposto.hoverable
                            )

    }


    voltarAoInicio(lado, ultimaPosicao){
        alert("Falhou");

        const deslocamento = ultimaPosicao.clone().sub(lado.origem);

        lado.origem.add(deslocamento);
        lado.destino.add(deslocamento);

        lado.update();

        const fase = this.fase;

        const dialogo = fase.animacoesDialogo(
                            "Lado não encontrado, arraste ele mais perto do lado oposto",
                            "Os lados agora são arrastáveis, arraste um para o outro e veja o que acontece"
                        )

        fase.animar(dialogo);
    }

    criarEquacao(lado, ladoOposto, ultimaPosicao){
        alert("Sucesso");

        const deslocamento = ultimaPosicao.clone().sub(lado.origem);

        lado.origem.add(deslocamento);
        lado.destino.add(deslocamento);

        lado.update();

        const direcao = deslocamento.clone().normalize();

        this.animacaoCriarEquacao(lado, ladoOposto, direcao.multiplyScalar(0.7));
    }

    animacaoCriarEquacao(lado, ladoOposto, direcao){

        const fase = this.fase;

        const bracket = Bracket.fromAresta(ladoOposto, -0.2, direcao)
                               .addToScene(fase.scene);

        const igualdade = fase.createMathJaxTextBox(ladoOposto.variable.name + "=" + lado.variable.name, ladoOposto.getPosition().toArray(), 3);

        //Tornar texto na animação de bracket um método do bracket
        const posicaoIgualdade = bracket.position;

        const desenharChaves = bracket.animacao();

        fase.scene.add(igualdade)

        const mostrarIgualdade = apagarCSS2(igualdade).reverse()
                                .setOnTermino(() => null)
                                .setOnStart(() => {
                                    fase.scene.add(igualdade);
                                    igualdade.position.copy(posicaoIgualdade)
                                })

        const animacao = new AnimacaoSimultanea(
                            desenharChaves,
                            mostrarIgualdade
                        );

        fase.animar(animacao);

        
    }
}