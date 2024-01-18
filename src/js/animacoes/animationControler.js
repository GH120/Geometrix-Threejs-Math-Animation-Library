import Animacao from './animation'

export default class animationControler {

    constructor(animacao, fase, estado, controlerAnterior, controlerSucessor){
        this.animacao = animacao
        this.fase = fase
        this.estado = estado
        this.controlerAnterior = controlerAnterior
        this.controlerSucessor = controlerSucessor
    }

    //reinicia ou inicia a animação atual a partir do seu primeiro frame
    start(){ 
        this.fase.changeState(this.estado) //criar função depois

        this.iterator = animation.getFrames()

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

    //end(){
    //    this.iterator = null
    //
    //    return this 
    //}

    
}