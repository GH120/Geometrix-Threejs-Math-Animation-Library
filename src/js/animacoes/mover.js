import Animacao from "./animation";
import * as THREE from 'three';

export const mover = (objeto, posicaoInicial, posicaoFinal) =>   

                    new Animacao(objeto)
                    .setValorInicial(posicaoInicial)
                    .setValorFinal(posicaoFinal)
                    .setInterpolacao(function(inicial,final,peso){
                        return new THREE.Vector3().lerpVectors(inicial,final,peso);
                    })
                    .setUpdateFunction(function(position){
                        this.objeto.setPosition(position);
                    })
                    .setCurva(x =>  -(Math.cos(Math.PI * x) - 1) / 2)
                    .setDuration(100)