import { Draggable } from "../inputs/draggable";
import ExecutarAnimacaoIdle from "../outputs/executarAnimacaoIdle";
import Animacao, { curvas } from "./animation";
import * as THREE from 'three'

//EQUAÇÕES FEITAS PARA OUTPUT EXECUTAR ANIMAÇÃO IDLE

/**Equação encolhe e aumenta */
export function encolherAumentarIdle(css2d){

    return new Animacao(css2d)
           .interpolacaoComum()
           .setValorInicial(1)
           .setValorFinal(1.1)
           .setUpdateFunction(function(valor){
                css2d.element.children[0].style.transform = `scale(${valor})`;
           })
}

export function tremedeiraIdle(objeto, eixo = new THREE.Vector3(0,0,-1), desvio = 0.3){

    const quaternionInicial = objeto.mesh.quaternion.clone();
    const quaternionFinal   = objeto.mesh.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(eixo, desvio));
    
    const giro =  new Animacao(objeto)
                .setValorInicial(quaternionInicial)
                .setValorFinal(quaternionFinal)
                .setDuration(30)
                .setInterpolacao(function(inicial,final,peso){
                    return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                })
                .setCurva(x => (y => Math.sin(y*2*Math.PI))(curvas.easeInOutBack(x + 0.03*Math.random())))
                .setUpdateFunction(function(quaternion){
                    objeto.mesh.quaternion.copy(quaternion);
                });

    return giro;

}

export function controleTremedeiraIdle(objeto, fase, delay=5){

    const curva = x => (y => Math.sin(y*2*Math.PI))(curvas.easeInOutBack(x + 0.03*Math.random()))

    return new ExecutarAnimacaoIdle(
                 tremedeiraIdle(objeto).setDelay(delay*60).setDuration(delay*60),
                 fase, 
                 delay,
                 curva
                )
                .addInputs(objeto.draggable)
}



export function controleTremedeiraIdleAresta(aresta, fase, delay=3){

    //Começa que começa em 0.5 e termina em 0.5

    const comecarDoMeio = x => Math.abs(0.5 - 2*x) + Math.min(0, 3 - 4*x)

    const curva = x => curvas.wobbling(x, 0.1, 10)

    return new ExecutarAnimacaoIdle(
                    tremedeiraIdle(aresta, new THREE.Vector3(-1,0,0), 0.1).setDelay(delay*60).setDuration(120),
                    fase, 
                    delay, 
                    curva,
                    false
                )
                .addInputs(aresta.draggable)
}