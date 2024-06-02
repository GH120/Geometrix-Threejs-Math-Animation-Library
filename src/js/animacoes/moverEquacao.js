import MostrarTexto from "./MostrarTexto";
import Animacao, { AnimacaoSequencial } from "./animation";
import * as THREE from 'three';
import MoverTexto from "./moverTexto";


export default class MoverEquacao extends AnimacaoSequencial{


    constructor(elementoCSS2, fase, equacao, spline, duration1, duration2, delayDoMeio){
        super(elementoCSS2);

        this.fase = fase;

        this.setup(elementoCSS2,equacao, spline, duration1, duration2, delayDoMeio)
    }

    setup(elementoCSS2, equacao, spline, duration1, duration2, delayDoMeio){

        //Consertar depois
        if(!spline){
            spline = [
                new THREE.Vector3(1.473684210526315, -2.2692913385826774, 0),
                new THREE.Vector3(-0.39766081871345005, -0.6944881889763783, 0),
            ]
        }

        if(!equacao){

            const novoElemento = document.createElement("div");

            novoElemento.innerHTML = elementoCSS2.element.innerHTML;

            // novoElemento.style.width = '400px'; // Set width to 200 pixels
            // novoElemento.style.height = '40px'; // Set height to 150 pixels
            // novoElemento.style.top = '10px'; // Set top position to 50 pixels from the top of the parent element

            novoElemento.style.position = 'relative';

            // novoElemento.children[0].style.width = '400px';
            novoElemento.children[0].style.height = 'auto';

            equacao = {html: novoElemento, nome: elementoCSS2.nome}
        }

        if(!duration1){
            duration1 = 50
        }

        if(!duration2){
            duration2 = 50;
        }

        if(!delayDoMeio){
            delayDoMeio = 0;
        }

        const fase = this.fase;

        //Consertar depois, está debaixo da whiteboard
        // novoElemento.element.style.zIndex = 10000;

        const mostrarTexto = new MostrarTexto(elementoCSS2)
                                .setValorFinal(300)
                                .setProgresso((duration1)? 0 : 1)
                                .setDelay(delayDoMeio)
                                .setDuration(duration1)
                                .setValorFinal(3000)
                                .setOnStart(() => {
                                    fase.scene.add(elementoCSS2);
                                    this.elementoClone = fase.whiteboard.adicionarEquacao(equacao)
                                });

        const moverEquacaoParaDiv = new MoverTexto(elementoCSS2)
                                    .setOnStart(function(){
                                        const equacaoDiv   = fase.whiteboard.equacoes[0].element;

                                        const dimensoes    = equacaoDiv.getBoundingClientRect();

                                        const posicaoFinal = fase.pixelToCoordinates((dimensoes.right + dimensoes.left)/2, (dimensoes.top + dimensoes.bottom)/2)

                                        this.setSpline([
                                            elementoCSS2.position.clone(),
                                            ...spline,
                                            posicaoFinal
                                        ])

                                        // fase.whiteboard.equationList.children[0].style.display = "none"
                                        

                                    })
                                    .setOnTermino(() =>{
                                        fase.scene.remove(elementoCSS2);
                                        // fase.whiteboard.equationList.children[0].style.display = "block"
                                        fase.whiteboard.ativar(true);
                                    })
                                    .setDuration(duration2)


        this.animacoes= [mostrarTexto, moverEquacaoParaDiv]

        this.setCheckpointAll(false);

        return this;
        
    }
}