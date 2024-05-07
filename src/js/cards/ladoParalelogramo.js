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

        //Ligar aresta oposta selecionada com o mover lados para só iluminar estiver sendo arrastado
        this.criarColorirArestaSelecionada(paralelogramo.edges[2], 0xe828282);
        this.criarColorirArestaSelecionada(paralelogramo.edges[0], 0xffff00);
        this.criarMoverLados(paralelogramo.edges[2], paralelogramo.edges[0]);
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

                                    if(novoEstado.dentro == false){
                                        estado.ladoOpostoSelecionado = false;
                                    }
                                }

                                if(estado.verificar){

                                    if(estado.ladoOpostoSelecionado == true){

                                        carta.criarEquacao(lado, ladoOposto, estado.ultimaPosicao);

                                        estado.verificar = false;

                                        lado.removeAllOutputs();
                                        ladoOposto.removeAllOutputs();
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

    criarColorirArestaSelecionada(aresta, corFinal){

        const fase = this.fase;

        const corInicial = aresta.material.color.getHex();

        const colorir = new Output()
                        .addInputs(
                            new InsideElipse(aresta, 0.05, fase.camera, fase.scene) // Para saber se o mouse está proximo da elipse ao redor da aresta
                        )
                        .setUpdateFunction(function(novoEstado){

                            const estado = this.estado;

                            if(novoEstado.dentro && !estado.ativado){
                                estado.ativado = true;

                                if(estado.colorirAresta.execucaoTerminada()) 
                                    estado.colorirAresta = animarColorirAresta(corInicial, corFinal);
                                else
                                    estado.colorirAresta.reverse(true);
                                

                                fase.animar(estado.colorirAresta);
                            }

                            if(novoEstado.dentro == false && estado.ativado){
                                estado.ativado = false;
                                
                                estado.colorirAresta.reverse(true);

                                fase.animar(estado.colorirAresta);
                            }
                        })
                        .setEstadoInicial({
                            ativado:false,
                            colorirAresta: animarColorirAresta(corFinal, corInicial),
                        });

        function animarColorirAresta(inicial, final){
            
            const animacao = colorirAngulo(aresta)
                            .setValorInicial(inicial)
                            .setValorFinal(final)
                            .voltarAoInicio(false)
                            .setDuration(30)
                            // .setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)

            return animacao;
        }

        return colorir;
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

        const equacao = new Equality(lado.variable, ladoOposto.variable);

        const igualdade = fase.createMathJaxTextBox(equacao.html.textContent, ladoOposto.getPosition().sub(direcao.clone().multiplyScalar(2)).toArray(), 10);

        //Tornar texto na animação de bracket um método do bracket
        const posicaoIgualdade = bracket.position;

        const desenharChaves = bracket.animacao().setDelay(60);

        const mostrarIgualdade = apagarCSS2(igualdade).reverse()
                                .setOnTermino(() => null) //Mudar variáveis baseado naquelas que já tem valor, atualizar equação e desenhar novamente
                                .setOnStart(() => {
                                    fase.scene.add(igualdade);
                                    // igualdade.position.copy(posicaoIgualdade)
                                })
                                .setDuration(100);


        //Mudar variável conhecida da equação => whiteboard guarda identidade das variáveis
        //Animação de mudar variável para valor => pode ser afetada localmente
        //Adcionar o valor conhecido da equação na whiteboard

        //Fazer animação mudando o valor 

        const mudarValor = new AnimacaoSequencial(
            new MostrarTexto(igualdade)
            .setValorInicial(100)
            .setValorFinal(20)
            .setDuration(80)
            .setCurva(x => {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;

                return x < 0.5
                ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            })
            .setOnTermino(function(){
                equacao.changeVariable(lado.variable.value, ladoOposto.variable.name);
                igualdade.mudarTexto(equacao.html.textContent)
                this.setProgresso(0)
            }),

            new MostrarTexto(igualdade)
            .setDuration(80)
            .setCurva(x => {
                const c1 = 1.70158;
                const c2 = c1 * 1.525;

                return x < 0.5
                ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            })
        )

        const moverEquacao = fase.moverEquacao({
                                    elementoCSS2: igualdade,
                                    duration1: 100,
                                    duration2: 80,
                                    spline: [
                                        new THREE.Vector3(-4.05, 0.8, 0),
                                        new THREE.Vector3(-3.95, 0, 0),
                                    ],
                                    delayDoMeio: 50,
                                })

        const animacao = new AnimacaoSimultanea(
                            desenharChaves,
                            new AnimacaoSequencial(mostrarIgualdade, mudarValor, moverEquacao),
                        );

        fase.animar(animacao);

        
    }
}