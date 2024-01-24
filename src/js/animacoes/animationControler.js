import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import KeyInput from '../inputs/keyInput'
import { Output } from '../outputs/Output'
import Animacao from './animation'
import { TextoAparecendo } from './textoAparecendo'

export default class AnimationControler {

    constructor(animacao, fase, estado, controlerAnterior, controlerSucessor){
        this.animacao = animacao
        this.fase = fase
        this.estado = estado
        this.controlerAnterior = controlerAnterior
        this.controlerSucessor = controlerSucessor

        this.createPauseHandler();
    }

    //reinicia ou inicia a animação atual a partir do seu primeiro frame
    start(){ 
        this.fase.changeState(this.estado) //criar função depois

        this.iterator = this.animation.getFrames()

        return this
    }   

    //pausa a animação e avança para o próximo controler
    skip(){
        this.pause()
        this.controlerSucessor.start()

        return this.controlerSucessor
    }

    //inverte a situação de pause
    pause(){
        this.paused = !this.paused

        return this
    }

    run(){
        this.iterator.next()
    }

    revert(){
        
        this.pause()

        if (this.animacao.frame != 0){
            this.start()

            return this
        }

        this.controlerAnterior.start()

        return this.controlerAnterior
    }

    restart(){
        let controler = this

        while(controler.controlerAnterior){
            controler = controler.controlerAnterior
        }

        this.pause()
        controler.start()
    }


    //Parte da lógica de pausar animações
    createPauseHandler(){

        const fase = this.fase;

        const keyInput = new KeyInput();

        const pausar = new Output()
                       .setUpdateFunction(function(novoEstado){
                            //Enter
                            if(novoEstado.keyDown == 13){

                                this.estado.pause = !this.estado.pause;

                                const pausado = this.estado.pause;

                                fase.animacoes.map(animacao => animacao.pause = pausado);

                                fase.scene.remove(fase.aviso);
                            }
                       });

        keyInput.addObserver(pausar);

        this.keyInput     = keyInput;
        this.pauseHandler = pausar;
    }

    handleCheckpoint(){

        //Quando terminar uma animação, então ele para a execução da sequência
        for(const animacao of this.fase.animacoes){

            const isSequential = animacao.constructor.name == "AnimacaoSequencial";

            if(!isSequential) continue;

            const hasCheckPoint = animacao.subAnimacaoAtual.checkpoint;

            const lastFrame = animacao.subAnimacaoAtual.frame == animacao.subAnimacaoAtual.frames - 1;

            if(hasCheckPoint && lastFrame && !animacao.pause){
                
                animacao.pause = true;

                //Avisa pro handler de pause que o estado está pausado
                this.pauseHandler.estado.pause = true;

                this.animacaoPausar();
            }
        }
    }

    //Solução temporária, fazer depois no react
    animacaoPausar(){

        const container = document.createElement('p');
        container.style.fontFamily = "Courier New, monospace";
        container.style.fontSize = "15px";
        container.style.display = 'inline-block';

        // Create the CSS2DObject using the container
        const aviso = new CSS2DObject(container);     
        
        const texto = "Aperte Enter para proseguir...";


        //Refatorar a gambiarra do textoAparecendo

        // Split the text into individual characters
        const characters = texto.split('');

        // Create spans for each character and apply the fading effect
        characters.forEach((character,index) => {
            const span = document.createElement('span');
            span.textContent = character;
            aviso.element.appendChild(span);
        });

        aviso.position.y = -2.5;
        aviso.position.x = 4;

        this.fase.aviso = aviso;

        this.fase.animar(new TextoAparecendo(aviso.element).setProgresso(0));

        this.fase.scene.add(aviso);

    }

    //end(){
    //    this.iterator = null
    //
    //    return this 
    //}

    
}