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

export function tremedeiraIdle(objeto, eixo = new THREE.Vector3(0,0,-1)){

    const quaternionInicial = objeto.mesh.quaternion.clone();
    const quaternionFinal   = objeto.mesh.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(eixo, 0.3));
    
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
                 tremedeiraIdle(objeto).setDelay(delay),
                 fase, 
                 delay,
                 curva
                )
                .addInputs(objeto.draggable)
}



export function controleTremedeiraIdleAresta(aresta, fase, delay=5){

    const curva = x => (y => Math.sin(y*2*Math.PI))(curvas.easeInOutBack(x + 0.03*Math.random()))

    return new ExecutarAnimacaoIdle(
                    tremedeiraIdle(aresta, new THREE.Vector3(-1,0,0)).setDelay(delay), 
                    fase, 
                    delay, 
                    curva
                )
                .addInputs(aresta.draggable)
}