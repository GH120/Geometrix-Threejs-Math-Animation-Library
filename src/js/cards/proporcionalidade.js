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
import ElementoCSS2D from "../objetos/elementocss2d";
import JuntarEquacoes from "../outputs/juntarEquacoes";
import ResolverEquacao from "../outputs/resolverEquacao";

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

        const fase = this.fase;

        const objetosProporcionais = fase.informacao.objetosProporcionais;

        alert(` Objetos proporcionais ${(objetosProporcionais.length)? "existem" : "não existem"}`);

        return objetosProporcionais.length;
    }

    process(){


        // Criar novo output para selecionar lado e arrastar ele

        const fase = this.fase;

        // fase.debug = false;


        const objetosProporcionais = fase.informacao.objetosProporcionais;

        this.controleEquacoes = this.criarControleEquacoes();

        this.clicarObjetos = []

        for(const objetoInfo of objetosProporcionais){

            this.clicarObjetos.push(this.controleSelecionarObjeto(objetoInfo));
            
        }

        this.controle = this.controleGeral();

        this.fase.adicionarControleDaCarta(this.controle); //Refatorar

        const mudarDialogo = fase.animacaoDialogo('Clique em objetos para extrair suas propriedades');

        mudarDialogo.setNome('Dialogo Carta');

        fase.animar(mudarDialogo);



        //Transformar isso em uma pilha?
        //Fase agora lida com esse controle
        // Retorna uma equação de igualdade dos lados
        // Mudar texto da caixa de diálogos para ensinar jogador
    }



    //OUTPUTS


    //Transformar em controle geral
    controleGeral(){

        const carta = this;
        const fase  = this.fase;

        return new Output()
               .addInputs(...this.clicarObjetos, this.controleEquacoes)
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.objetoSelecionado){
                        //Criar equação com as informações obtidas

                        const equacao1   = novoEstado.objetoSelecionado;

                        const equacaoObjeto = new ElementoCSS2D(equacao1.equacao, fase.whiteboard);


                        equacao1.equacaoObjeto = equacaoObjeto;


                        for(const equacao2 of estado.equacoes){

                            //Refatorar
                            //Lida apenas com equacões sendo compatíveis apenas em pares
                            //Tratar o caso depois de equações em mais de um par
                            if(equacao2.compativelCom(equacao1) && equacao1.compativelCom(equacao2)){

                                const equacaoResultante = equacao1.equacaoResultante(equacao2);

 
                                equacao1.juntarEquacoes = new JuntarEquacoes(equacao1.equacaoObjeto, [equacao2.equacaoObjeto], fase, null, equacaoResultante); 
                                // if(!equacao2.juntarEquacoes) 
                                equacao2.juntarEquacoes = new JuntarEquacoes(equacao2.equacaoObjeto, [equacao1.equacaoObjeto], fase, null, equacaoResultante);

                                //Wrapper que avisa mais informações para o controle quando o juntar equações notificar mudança
                                const avisarMaisInformacoes = (equationInfo) => new Output()
                                                                              .addInputs(equationInfo.juntarEquacoes)
                                                                              .setUpdateFunction(function(novoEstado) {
                                                                                this.notify({
                                                                                    equationInfo:equationInfo, 
                                                                                    novaEquacao: novoEstado.novaEquacao
                                                                                })
                                                                               });

                                carta.controleEquacoes.addInputs(avisarMaisInformacoes(equacao1), avisarMaisInformacoes(equacao2))

                                estado.juntarEquacoes.push(equacao1.juntarEquacoes, equacao2.juntarEquacoes);
                                
                            }
                        }

                        estado.equacoes.push(equacao1);

                        this.notify({objetoSelecionado: novoEstado.objetoSelecionado});

                    }

                    //Criar um verificador para ver se equação poderá ser juntada com outra
                    if(novoEstado.novaEquacao){

                    }
                    
               })
               .setEstadoInicial({
                    equacoes:[],
                    clicarObjetos: this.clicarObjetos,
                    juntarEquacoes:[],
                    estadosResolucaoEquacao: [] 
               })
    }

    //Controle selecionar objeto, retorna equação
  
    controleSelecionarObjeto(informacao){


        //Seleciono um objeto, ele retorna um nome e uma propriedade se tiver 
        //Por exemplo, a hora do círculo tem uma propriedade com nome x horas tem y°
        //O lado do polígono vai dizer lado poligono 1 tem 4cm
        //fase.informacao.objetosProporcionais = [{objeto:, nome: , atributo: , equacao: }]

        const fase = this.fase;

        if(!informacao.objeto.clickable) new Clickable(informacao.objeto, fase.camera);

        return new Output()
               .addInputs(informacao.objeto.clickable)
               .setUpdateFunction(function(novoEstado){

                    const estado = this.estado;

                    if(novoEstado.clicado && !estado.ativado){
                        //Retorna novo valor equação css2d

                        const equacao = informacao.equacao();
                        const posicao = informacao.posicao;
                        const tamanhoFonte = informacao.tamanhoFonte

                        const equationBox = fase.createMathJaxTextBox(equacao, posicao, tamanhoFonte);

                        const moverEquacao = new MoverEquacao(equationBox, fase, null, null, 60,60,60)

                        fase.animar(moverEquacao);

                        this.ativar(false);

                        moverEquacao.setOnTermino(() => this.notify({objetoSelecionado: {...informacao, equacao: moverEquacao.elementoClone}}))

                    }
               })
    }


    //Controle juntar equações e verificar razão
    //Junto duas equações e retorno a razão entre elas

    criarControleEquacoes(){

        const fase = this.fase;

        const sidenote = fase.createSidenote('');


        //Quando tiver a parte de expressões mathjax funcional,
        //Vamos adicionar inputs do usuário para auxiliá-lo a resolver
        //Se ele acertar os valores das variáveis ele é recompensado
        //REFARTORAR EXPRESSÕES, EM STANDBY POR ENQUANTO
        return new Output()
               .setUpdateFunction(function(novoEstado){

                    console.log(novoEstado)

                    const estado = this.estado;

                    if(novoEstado.equationInfo) estado.equationInfo = novoEstado.equationInfo;

                    //Mais informações sobre a equação como valor, nome, resultados...
                    const equationInfo = estado.equationInfo

                    //Refatorar depois a parte das equações, esse trabalho aqui é desnecessário
                    const equacoes = equationInfo.estadosResolucaoEquacao;


                    const novaEquacao = novoEstado.novaEquacao;

                    if(novaEquacao && estado.etapa == 1){

                        this.debug = false;

                        const objetoEquacao = new ElementoCSS2D(novaEquacao, fase.whiteboard);

                        const mudarSidenote = fase.animacaoDialogo("Clique para resolver a equação", estado.sidenote)

                        fase.animar(mudarSidenote)

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase, null, equacoes[1](equationInfo))

                        this.addInputs(resolverEquacao);

                        estado.etapa++;
                    }

                    else if(novaEquacao && estado.etapa == 2){
                        const objetoEquacao = new ElementoCSS2D(novaEquacao, fase.whiteboard);

                        const mudarDialogo  = fase.animacaoDialogo("Podemos cancelar a unidade hora")
                        const mudarSidenote = fase.animacaoDialogo("Clique para resolver a equação", estado.sidenote)

                        fase.animar(mudarDialogo)
                        fase.animar(mudarSidenote);

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase, null, equacoes[2](equationInfo))

                        resolverEquacao.tamanhoFonte = 1.7;

                        this.addInputs(resolverEquacao);

                        estado.etapa++;
                    }

                    else if(novaEquacao && estado.etapa == 3){
                        const objetoEquacao = new ElementoCSS2D(novaEquacao, fase.whiteboard);

                        const mudarDialogo = fase.animacaoDialogo("Agora multiplicamos 30 graus para cada hora");

                        const mudarSidenote = fase.animacaoDialogo("Clique uma última vez", estado.sidenote)

                        fase.animar(mudarSidenote);
                        fase.animar(mudarDialogo);

                        const resolverEquacao = new ResolverEquacao(objetoEquacao, fase, null, equacoes[3](equationInfo))

                        resolverEquacao.tamanhoFonte = 1.7

                        this.addInputs(resolverEquacao);

                        estado.etapa++;
                    }


               })
               .setEstadoInicial({
                    etapa: 1,
                    equacoesResolvidas: 0,
                    sidenote: sidenote,
                    equationInfo: null //Não tem informações inicialmente sobre a equação a ser resolvida
               })

    }

}