import { AnimacaoSimultanea } from "../animacoes/animation";
import { apagarCSS2 } from "../animacoes/apagarCSS2";
import { encolherAumentarIdle } from "../animacoes/idle";
import { Clickable } from "../inputs/clickable";
import { Draggable } from "../inputs/draggable";
import { Hoverable } from "../inputs/hoverable";
import { Output } from "./Output";
import ExecutarAnimacaoIdle from "./executarAnimacaoIdle";

export default class ResolverEquacao extends Output{

    /**Inputs: hover e drag da equacao movida e hovers das equacaoAlvos */
    constructor(equacao, fase, onResolucao = null, equacaoResultante=null, equacaoNova=null){
        super();

        this.fase = fase;

        this.equacao = equacao;
        this.tamanhoFonte  = 1;
        this.equacaoNova = null;

        this.equacaoResultante = `{\\color{purple}~Figuras~Semelhantes~(P1 , P2)}`
        
        this.setup(onResolucao, equacaoResultante);

        this.criarIdling();
    }

    setup(onResolucao, equacaoResultante){

        const fase          = this.fase;
        const equacao = this.equacao;

        if(onResolucao)       this.handleResolucao   = onResolucao.bind(this);
        if(equacaoResultante) this.equacaoResultante = equacaoResultante;

        if(!equacao.clickable) new Clickable(equacao, fase.whiteboard.camera, fase.whiteboard);

        console.log(equacao, "setup")

        this.addInputs(equacao.clickable);

    }

    update(novoEstado){

        if(novoEstado.clicado){

            this.handleResolucao(this.equacao)
            this.notify({clicado: true})
        }
    }

    voltarAoInicio(estado){
        // alert("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");

        const ultimaPosicao = estado.ultimaPosicao;

        const equacao = estado.equacao;

        equacao.mesh.position.copy(ultimaPosicao);
    }

    handleResolucao(equacao){

        const fase = this.fase;

        //Fade out das duas equações, remoção delas da whiteboard

        console.log("texto", equacao.texto);

        const fadeOutEquacao = apagarCSS2(equacao.texto     , fase.whiteboard.scene).setDuration(50);

        //Fade in da equação nova, adiciona ela na whiteboard

        const equacaoNova = (this.equacaoNova)? this.equacaoNova : fase.createMathJaxTextBox(this.equacaoResultante, [0,1,0], this.tamanhoFonte);

        const fadeInEquacaoNova = apagarCSS2(equacaoNova, fase.whiteboard.scene)
                                  .reverse()
                                  .setOnStart  (() => {

                                    fase.whiteboard.adicionarEquacao({html:equacaoNova.element, nome: equacaoNova.nome}); //Gambiarra, mudar depois com classe equação objeto

                                    this.notify({
                                        novaEquacao: fase.whiteboard.equacoes[fase.whiteboard.equacoes.length - 1]
                                    })
                                    
                                  })
                                  .setOnTermino(() => null)
                                  .setDuration(50)

        //Refatorar: mover para o removeFromScene da equação
        fase.whiteboard.removerEquacao(equacao.texto);

        fase.scene.remove(equacao.hitbox);


        const animacao = new AnimacaoSimultanea(
                            fadeOutEquacao,
                            fadeInEquacaoNova
                        )

        fase.whiteboard.animar(animacao);

        equacao.removeAllOutputs();
    }

    criarIdling(){

            const fase = this.fase;

            const equacaoMovida = this.equacao;
            
            const animacao = encolherAumentarIdle(equacaoMovida.texto).setDuration(90 + Math.round(30*Math.random()));

            const controleIdle = new ExecutarAnimacaoIdle(animacao, fase, 2)
                                    .addInputs(
                                        equacaoMovida.clickable, 
                                    )
                                    .start();


            this.controleIdling = controleIdle;
    }
}