import { AnimacaoSimultanea } from "../animacoes/animation";
import { apagarCSS2 } from "../animacoes/apagarCSS2";
import { Draggable } from "../inputs/draggable";
import { Hoverable } from "../inputs/hoverable";
import { Output } from "./Output";

export default class JuntarEquacoes extends Output{

    /**Inputs: hover e drag da equacao movida e hovers das equacaoAlvos */
    constructor(equacaoMovida, equacoesAlvo, fase, onJuncao = null, equacaoResultante=null){
        super();

        this.fase = fase;

        this.equacaoMovida = equacaoMovida;
        this.equacoesAlvo  = equacoesAlvo;
        this.equacaoNova   = null;
        this.tamanhoFonte  = 1;

        //Para criar na hora uma equacaoNova mathjax
        this.equacaoResultante = `{\\color{purple}~Figuras~Semelhantes~(P1 , P2)}`
        
        this.setup(onJuncao, equacaoResultante);
    }

    setup(onJuncao, equacaoResultante){

        const fase          = this.fase;
        const equacaoMovida = this.equacaoMovida;
        const equacoesAlvo  = this.equacoesAlvo;

        if(onJuncao)          this.handleJuncao      = onJuncao.bind(this);
        if(equacaoResultante) this.equacaoResultante = equacaoResultante;

        if(!equacaoMovida.hoverable) new Hoverable(equacaoMovida, fase.whiteboard.camera, fase.whiteboard);
        if(!equacaoMovida.draggable) new Draggable(equacaoMovida, fase.whiteboard.camera, fase.whiteboard);

        equacoesAlvo.forEach(equacao => {

            if(!equacao.hoverable) new Hoverable(equacao, fase.whiteboard.camera, fase.whiteboard);
        });

        this.addInputs(
            equacaoMovida.draggable,
            equacaoMovida.hoverable,
            ...equacoesAlvo.map(equacao => equacao.hoverable)
        )

    }

    update(novoEstado){

        const equacaoMovida = this.equacaoMovida;

        //O Estado de execução do output
        const estado = this.estado;


        //Verifica se está dentro da equação movida
        if(novoEstado.alvo == equacaoMovida){

            if(novoEstado.dentro == true){
                estado.dentro = true;
            }
            if(novoEstado.dentro == false){
                estado.dentro = false;
            }
        }

        else{

            //Verifica se a equação movida está sobre alguma equação alvo
            if(novoEstado.dentro == true){
                estado.valido = true;
                estado.equacaoSelecionada = novoEstado.alvo;
            }
            if(novoEstado.dentro == false){
                estado.valido = false;
                estado.equacaoSelecionada = null;
            }
        }

        //Condição de começo da execução
        if( 
            estado.dentro       == true  && 
            !estado.dragging             &&  //Também aceita estado.dragging indefinido
            novoEstado.dragging == true
        ){ 
            estado.dragging      = novoEstado.dragging;
            estado.equacaoMovida = novoEstado.alvo;
            estado.ultimaPosicao = novoEstado.alvo.mesh.position.clone();
        }

         // //Condição de termino da execução
        if(
            estado.dragging     == true  &&
            novoEstado.dragging == false 
        ){

            estado.dragging = false;

            //Ambas as equações, a movida por arraste e a que o cursor está acima
            const equacaoMovida      = estado.equacaoMovida;
            const equacaoSelecionada = estado.equacaoSelecionada;

            //Evaluate
            if(estado.valido) {
                this.handleJuncao(equacaoMovida, equacaoSelecionada);
            }
            else  
                this.voltarAoInicio(estado); 
        }

        //Condição de execução
        if(estado.dragging == true && novoEstado.position){
            
            console.log(novoEstado.position)
            equacaoMovida.mesh.position.copy(novoEstado.position);
            // alert(equacaoMovida.mesh.position.x)
        }
    }

    voltarAoInicio(estado){
        // alert("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");

        const ultimaPosicao = estado.ultimaPosicao;

        const equacaoMovida = estado.equacaoMovida;

        equacaoMovida.mesh.position.copy(ultimaPosicao);
    }

    handleJuncao(equacaoMovida, equacaoSelecionada){

        const fase = this.fase;

        //Fade out das duas equações, remoção delas da whiteboard

        const fadeOutEquacao1 = apagarCSS2(equacaoMovida.texto     , fase.whiteboard.scene).setDuration(100);
        const fadeOutEquacao2 = apagarCSS2(equacaoSelecionada.texto, fase.whiteboard.scene).setDuration(100);

        //Fade in da equação nova, adiciona ela na whiteboard

        const equacaoNova = (this.equacaoNova)? this.equacaoNova : fase.createMathJaxTextBox(this.equacaoResultante, [0,1,0], this.tamanhoFonte);

        const fadeInEquacaoNova = apagarCSS2(equacaoNova, fase.whiteboard.scene)
                                  .reverse()
                                  .setOnStart  (() => {

                                    fase.whiteboard.adicionarEquacao({html:equacaoNova.element});

                                    this.notify({
                                        novaEquacao: fase.whiteboard.equacoes[fase.whiteboard.equacoes.length - 1]
                                    })

                                  })
                                  .setOnTermino(() => null)
                                  .setDuration(100)

        fase.whiteboard.removerEquacao(equacaoMovida.texto);
        fase.whiteboard.removerEquacao(equacaoSelecionada.texto);


        const animacao = new AnimacaoSimultanea(
                            fadeOutEquacao1,
                            fadeOutEquacao2,
                            fadeInEquacaoNova
                        )

        fase.whiteboard.animar(animacao);

        equacaoMovida.removeAllOutputs();
        equacaoSelecionada.removeAllOutputs();
    }
}