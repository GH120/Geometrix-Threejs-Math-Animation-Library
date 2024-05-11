import Animacao, { AnimacaoSequencial, AnimacaoSimultanea } from "../animacoes/animation";
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

export class AnguloParalogramo {


    constructor(whiteboard){

        this.whiteboard = whiteboard;

        this.a = null;
        this.b = null;
        this.c = null;

        this.outputs = [];
        this.tracejados = {}
    }

    dialogos = {
        inicio: "Vamos usar o ângulo conhecido para descobrir o restante",
        divisaoAnguloIgual1: "Podemos dividir o paralelogramo em dois triângulos",
        divisaoAnguloIgual2: "Arraste os lados cinza para os amarelos",

        //Colore um azul e o outro vermelho
        divisaoAnguloIgual3: "Veja, o triângulo de baixo é igual ao de cima, pois seus lados são iguais",

        //Cria uma aresta solida no lugar do tracejado, cor amarela
        //Arrasta o ângulo desconhecido ao original, formando um triângulo superior
        //Retorna os lados as suas poisções e o ângulo também, formando o paralelogramo novamente
        //Aparece o mostrarAngulo do ângulo desconhecido
        divisaoAnguloIgual4: "Então seus ângulos são iguais",
        divisaoAnguloIgual5: "Sabendo disso, e qual é o ângulo de 70° no triangulo de cima? Clique nele",
        comentario1: "Agora arraste o outro",
        comentario2: "(Pode parecer um pouco repetitivo, mas verá o propósito)"

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

        const todosLadosConhecidos = false;

        alert(`paralelogramo ${(paralelogramo)? "encontrado" : "não encontrado"}`);

        alert(`paralelogramo com ângulos desconhecidos:${(!todosLadosConhecidos) ? " SIM - Aceito" : "NÃO - Rejeitado"}`);

        return paralelogramo && !todosLadosConhecidos;
    }

    process(){

        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        this.controle = this.controleGeral();

        fase.adicionarControleDaCarta(this.controle);

        const dialogo = fase.animacaoDialogo(this.dialogos.inicio)
                            // .setNome("Dialogo Carta")
                            .setOnTermino(() => this.controle.update({iniciar: true}))

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
            divisaoAnguloIgual2a: "Eles não são parecidos?",
            divisaoAnguloIgual2b: "Isso pois",
    
            //Colore um azul e o outro vermelho
            divisaoAnguloIgual3: "Veja, os lados do ângulo desconhecido são os mesmos do conhecido",
    
            //Cria uma aresta solida no lugar do tracejado, cor amarela
            //Arrasta o ângulo desconhecido ao original, formando um triângulo superior
            //Retorna os lados as suas poisções e o ângulo também, formando o paralelogramo novamente
            //Aparece o mostrarAngulo do ângulo desconhecido
            divisaoAnguloIgual4: "Logo, os dois ângulos são iguais",

            comentario1: "Agora arraste o outro",
            comentario2: "(Pode parecer um pouco repetitivo, mas verá o propósito)"


    
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

     //Controle intermediário, move um lado apenas
    criarMoverLados(lado, ladoOposto){

        //Criar um suboutput para verificar se sobrevoa sobre um elemento?

        const carta = this;

        if(!lado.draggable)       new Draggable(lado, this.fase.camera);
        if(!lado.hoverable)       new Hoverable(lado, this.fase.camera);
        if(!ladoOposto.hoverable) new Hoverable(ladoOposto, this.fase.camera);


        const moverLados = new Output()
                           .setUpdateFunction(function(novoEstado){

                                const estado = this.estado;

                                if(estado.finalizado) return;

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
                                    estado.ultimaPosicao = lado.getPosition();
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

                                        estado.verificar = false;

                                        estado.finalizado = true;

                                        //Avisa o controle principal qual lado foi selecionado
                                        this.notify({
                                            ladoSelecionado: ladoOposto, 
                                            ladoOriginal: lado,
                                            ultimaPosicaoDoLadoOriginal: estado.ultimaPosicao
                                        })
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
                                finalizado: false
                            })
                           .addInputs(
                                lado.draggable, 
                                lado.hoverable,
                                ladoOposto.hoverable
                            );

        return moverLados;

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


    controleGeral(){

        const carta = this;

        const paralelogramo = this.paralelogramoSelecionado;

        const n = paralelogramo.numeroVertices;

        //Função para conseguir proximo indice circular 
        const proximoIndice = (i, step) => (step < 0)? (i + n + step%n) % n : (i + step) % n

        const anguloConhecido = paralelogramo.angles.filter(angle => angle.variable.value)[0];

        const indiceAnguloOposto = proximoIndice(anguloConhecido.index, n/2);

        const anguloOposto = paralelogramo.angles[indiceAnguloOposto];

        const lados = [
            paralelogramo.edges[proximoIndice(indiceAnguloOposto, 1)], 
            paralelogramo.edges[proximoIndice(indiceAnguloOposto, 2)]
        ];

        const ladosOpostos = [
            paralelogramo.edges[proximoIndice(indiceAnguloOposto, 3)], 
            paralelogramo.edges[proximoIndice(indiceAnguloOposto, 4)]
        ];

        return new Output()
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    //Começa com o desenhar tracejado e explicando funcionamento
                    //Pede para arrastar os dois lados
                    if(novoEstado.iniciar){

                        carta.colorirLados = lados.concat(ladosOpostos)
                                                  .map((lado, indice) => carta.criarColorirArestaSelecionada(lado, (indice >= 2)? 0xffff00 : 0x828282))
                        carta.moverLados   = lados.map((lado, indice) => carta.criarMoverLados(lado, ladosOpostos[indice]))

                        carta.colorirLados.forEach(colorir => colorir.update({dentro:true}));

                        this.addInputs(...carta.moverLados);

                        const proximo  = proximoIndice(anguloConhecido.index, 1);
                        const anterior = proximoIndice(anguloConhecido.index, -1);
                        
                        const desenharTracejado = carta.animacaoDividirParalelogramo(
                                                    paralelogramo.vertices[proximo], 
                                                    paralelogramo.vertices[anterior]
                                                 )

                        const dialogo = new AnimacaoSequencial(
                                            carta.fase.animacaoDialogo(carta.dialogos.divisaoAnguloIgual1),
                                            carta.fase.animacaoDialogo(carta.dialogos.divisaoAnguloIgual2)
                                        )   

                        const animacao = new AnimacaoSimultanea(desenharTracejado, dialogo)
                                         .setNome("Dialogo Carta")
                                         .setOnTermino(() => carta.colorirLados.map(colorir => colorir.update({dentro:false})))

                        carta.fase.animar(animacao);

                        estado.etapa = carta.dialogos.divisaoAnguloIgual2;
                    }

                    if(novoEstado.ladoSelecionado){

                        estado.ladosMovidos++;

                        let cor = (estado.ladosMovidos == 1)? 0xaa0000 : 0x0000aa;

                        const lado            = novoEstado.ladoOriginal;
                        const ladoOposto      = novoEstado.ladoSelecionado;
                        const posicao         = novoEstado.ultimaPosicaoDoLadoOriginal;

                        estado.posicoesOriginais[lados.indexOf(lado)] = posicao.clone();

                        //Desativa os controles desativando os outputs dos lados
                        lado.removeAllOutputs();
                        ladoOposto.removeAllOutputs();

                        const moverLado = new AnimacaoSequencial(
                                            mover(lado, lado.getPosition(), ladoOposto.getPosition()).setDelay(200),
                                            // mover(lado, lado.getPosition(), posicaoOriginal.clone()),
                                            // mover(ladoOposto, ladoOposto.getPosition(), posicaoOriginal.clone())
                                         );

                        const colorir1  = colorirAngulo(lado).setValorInicial(lado.material.color.getHex()).setValorFinal(cor);
                        const colorir2  = colorirAngulo(ladoOposto).setValorInicial(ladoOposto.material.color.getHex()).setValorFinal(cor);

                        if(estado.ladosMovidos == 1){


                            const dialogo = new AnimacaoSequencial(
                                                carta.fase.animacaoDialogo(carta.dialogos.comentario1),
                                                carta.fase.animacaoDialogo(carta.dialogos.comentario2)
                                            )


                            const animacao = new AnimacaoSimultanea(moverLado,colorir1,colorir2,dialogo);

                            animacao.setNome("Dialogo Carta");

                            carta.fase.animar(animacao);

                        }

                        else if(estado.ladosMovidos == 2){


                            const dialogo = carta.fase.animacaoDialogo(carta.dialogos.divisaoAnguloIgual3)

                            const mostrarTriangulo =  carta.animacaoMostrarTriangulo(lados,ladosOpostos, estado.posicoesOriginais);

                            const animacao = new AnimacaoSimultanea(moverLado,colorir1,colorir2,dialogo,mostrarTriangulo);

                            animacao.setNome("Dialogo Carta");

                            carta.fase.animar(animacao);
                        }
                    }

                    //Moveu os dois lados:
                    //Mudar etapa para arrastar angulo

                    if(estado.ladosMovidos == 2){
                        alert("Termino");
                    }
                    
                    //Angulos iguais
               })
               .setEstadoInicial({
                    etapa:              this.dialogos.inicio,
                    anguloConhecido:    anguloConhecido,
                    anguloDesconhecido: anguloOposto,
                    ladosSelecionados:  lados,
                    posicoesOriginais:  {},
                    ladosMovidos:       0
               })
    }

    animacaoDividirParalelogramo(vertice1, vertice2){

        this.tracejado = new Tracejado(vertice1.getPosition(), vertice2.getPosition());

        const desenharTracejado = new MostrarTracejado(this.tracejado, this.fase.scene);

        return desenharTracejado;
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

    animacaoMostrarTriangulo(lados,ladosOpostos, posicoesOriginais){

        const paralelogramo = this.paralelogramoSelecionado;

        const moverLados = new AnimacaoSequencial(
                                new AnimacaoSimultanea(
                                    mover(lados[0], ladosOpostos[0].getPosition(), posicoesOriginais[0].clone()),
                                    mover(ladosOpostos[0], ladosOpostos[0].getPosition(), posicoesOriginais[0].clone())
                                ),
                                new AnimacaoSimultanea(
                                    mover(lados[1], ladosOpostos[1].getPosition(), posicoesOriginais[1].clone()),
                                    mover(ladosOpostos[1], ladosOpostos[1].getPosition(), posicoesOriginais[1].clone())
                            ))
                            .filler(500)

        const moverDeVolta = new AnimacaoSequencial(
                                new AnimacaoSimultanea(
                                    mover(lados[0], ladosOpostos[0].getPosition(), posicoesOriginais[0].clone())
                                    .reverse(),
                                    mover(ladosOpostos[0], ladosOpostos[0].getPosition(), posicoesOriginais[0].clone())
                                    .reverse()
                                ),
                                new AnimacaoSimultanea(
                                    mover(lados[1], ladosOpostos[1].getPosition(), posicoesOriginais[1].clone())
                                    .reverse(),
                                    mover(ladosOpostos[1], ladosOpostos[1].getPosition(), posicoesOriginais[1].clone())
                                    .reverse()
                            ))
                            .filler(500)

        const moverFinal = new AnimacaoSequencial(
                                mover(lados[0], lados[0].getPosition(), posicoesOriginais[0].clone()),
                                mover(lados[1], lados[1].getPosition(), posicoesOriginais[1].clone()),
                         )
                         .filler(500)

        const posicoesVertices = paralelogramo.vertices.slice(1,4).map(vertice => vertice.getPosition().toArray());

        //Mostrar uma nova aresta aparecendo no lugar do tracejado
        //Hard coded, depois generalizar
        const trianguloNovo = new Poligono(posicoesVertices)
                                .configuration({grossura:0.024, raioVertice:0.04, raioAngulo:0.3})
                                .render();

        trianguloNovo.angles.map(angulo => angulo.material.color = 0x0000aa);
        trianguloNovo.edges[1].material.color = 0xaa0000;
        trianguloNovo.edges[0].material.color = 0x0000aa;

        const aparecerTriangulo = new ApagarPoligono(trianguloNovo)
                                  .reverse()
                                  .setOnTermino(() => null)
                                  .setOnStart(() => trianguloNovo.addToScene(this.fase.scene))
                                  .setDuration(300)
                                  .filler(250);

        const edge = trianguloNovo.edges[2];

        edge.material.color = 0xeeeeee;
        edge.grossura = 0.024;
        edge.render();

        const aparecerAresta = apagarObjeto(edge)
                              .reverse()
                              .setOnTermino(() => null)
                              .setOnStart(() => edge.addToScene(this.fase.scene));
        //Mostrar um Triângulo do threejs aparecendo com coloração translucida

        const shape = new THREE.Shape();

        shape.moveTo(...paralelogramo.vertices[0].getPosition().toArray());
        shape.lineTo(...paralelogramo.vertices[1].getPosition().toArray());
        shape.lineTo(...paralelogramo.vertices[3].getPosition().toArray());

        const mostrarLados = new AnimacaoSequencial(
                                new AnimacaoSimultanea(
                                    this.animacaoEngrossarLado(paralelogramo.edges[1]),
                                    this.animacaoEngrossarLado(paralelogramo.edges[3]),
                                ),
                                new AnimacaoSimultanea(
                                    this.animacaoEngrossarLado(paralelogramo.edges[0]),
                                    this.animacaoEngrossarLado(paralelogramo.edges[2]),
                                ),
                                this.animacaoEngrossarLado(edge)
                            )

        const triangulo1 = Objeto.fromMesh(new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({color: 0x0000aa, opacity:0.5, transparent: true})))


        const aparecerAreaTriangulo = apagarObjeto(triangulo1)
                                       .reverse()
                                       .setValorFinal(0.5)
                                       .setCurva(x => {

                                            x = 1 - Math.abs(1-2*x);

                                            return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
                                        })
                                       .setOnStart(() => triangulo1.addToScene(this.fase.scene))
                                       .setOnTermino(() => null);
        //Girar esse triângulo no seu eixo de rotação para mostrar que os dois triângulos são iguais
        //Aparecer valor do mostrarAngulo

        console.log(paralelogramo.vertices.slice(0,3))

        const nomeTrianguloSuperior = paralelogramo.vertices.slice(1,4).map(vertice => vertice.variable.name).join('');
        const nomeTrianguloInferior = paralelogramo.vertices.filter((x,i) => i != 2).map(vertice => vertice.variable.name).join('');

        const equacao = this.fase.createMathJaxTextBox(`\\Delta ${nomeTrianguloSuperior}`, trianguloNovo.edges[0].getPosition().clone().add(new THREE.Vector3(0,0.3,0)).toArray(), 5);

        const aparecerEquacao = apagarCSS2(equacao)
                                .reverse()
                                .setOnTermino(() => null)
                                .setOnStart(() => this.fase.scene.add(equacao));

        const mudarEquacao = new MostrarTexto(equacao)
                             .setOnStart( () => equacao.mudarTexto(`\\Delta ${nomeTrianguloSuperior} \\equiv \\Delta ${nomeTrianguloInferior}`, 4))
                             .setValorInicial(70)
                             .setValorFinal(200)
                             .setCurva(x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

        const ilustrarIgualdade = new AnimacaoSequencial(mudarEquacao, moverDeVolta)

        return new AnimacaoSequencial(
                new AnimacaoSimultanea(
                    aparecerAresta, 
                    aparecerEquacao
                ), 
                moverLados, 
                ilustrarIgualdade,
                moverFinal,  
                mostrarLados
        );
    }

    animacaoEngrossarLado(lado){

        return new Animacao()
               .setValorInicial(lado.grossura)
               .setValorFinal(lado.grossura * 1.3)
               .setInterpolacao((a,b,c) => a*(1-c) + b*c)
               .setDuration(600)
               .voltarAoInicio(true)
               .setCurva(x => {

                    x = Math.abs(Math.sin(4.5*x*Math.PI)); //Vai e volta
                    
                    const c1 = 1.70158;
                    const c2 = c1 * 1.525;

                    return x < 0.5
                    ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
                    : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
                })
                .setUpdateFunction(function(valor){
                    lado.grossura = valor;
                    lado.update();
                })
                .setOnTermino(() =>{
                    lado.grossura = 0.024;
                    lado.update();
                })
    }

    voltarAoInicio(lado, ultimaPosicao){
        alert("Falhou");

        const deslocamento = ultimaPosicao.clone().sub(lado.mesh.position);

        lado.origem.add(deslocamento);
        lado.destino.add(deslocamento);

        lado.update();

        const fase = this.fase;

        const dialogo = fase.animacoesDialogo(
                            "Lado não encontrado, arraste ele mais perto do lado oposto",
                            "Os lados agora são arrastáveis, arraste um para o outro e veja o que acontece"
                        )
                        .setNome("Dialogo Carta")

        fase.animar(dialogo);
    }

    
}