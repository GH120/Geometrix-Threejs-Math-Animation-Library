import { Draggable } from "../inputs/draggable";
import ExecutarAnimacaoIdle from "../outputs/executarAnimacaoIdle";
import Animacao, { curvas } from "./animation";
import * as THREE from 'three'
import { apagarObjeto } from "./apagarObjeto";
import { Objeto } from "../objetos/objeto";
import { mover } from "./mover";

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

    const curva = x => curvas.wobbling(x, 0.25, 5)

    return new ExecutarAnimacaoIdle(
                    tremedeiraIdle(aresta, new THREE.Vector3(-1,0,0), 0.1).setDelay(delay*60).setDuration(120),
                    fase, 
                    delay, 
                    curva,
                    false
                )
                .addInputs(aresta.draggable)
}

export function mostrarHitboxTransparente(objeto){

    const hitbox = objeto.hitbox;

    console.log(objeto)

    hitbox.material = new THREE.MeshBasicMaterial({transparent:true, opacity:0, color:0x049ef4})

    objeto.scene.add(hitbox);


    return apagarObjeto(Objeto.fromMesh(hitbox))
          .setDuration(90)
          .setValorInicial(0)
          .setValorFinal(0.5);
}

export function controleHitboxTransparente(objeto, fase, delay){

    fase.debug = false;

    return new ExecutarAnimacaoIdle(mostrarHitboxTransparente(objeto), fase, delay);
}

export function moverSetinha(origem, destino, scene){


    const dir = destino.clone().sub(origem);

    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();
    
    const origin = new THREE.Vector3( 0, 0, 0 );
    const length = 0.3;
    const hex = 0xff0000;

    const group = new THREE.Group();

    const arrowMesh = new THREE.ArrowHelper( dir, origin, length, hex , 0.4*length, 0.2*length);

    arrowMesh.position.copy(dir.clone().negate().multiplyScalar(length));

    group.add(arrowMesh)
    
    const arrowHelper = Objeto.fromMesh(group);
    
    const moverSetinha = mover(arrowHelper, origem, destino)
                        .setOnStart(() => {
                            arrowHelper.addToScene(scene);
                        })

    moverSetinha.setinha = arrowHelper

    return moverSetinha;
}

export class MoverSetinhaIdle extends ExecutarAnimacaoIdle{

    constructor(origem, destino, fase, delay){

        super(moverSetinha(origem, destino, fase.scene), fase, delay);


    }

    _update(novoEstado){

        if(novoEstado.ativarAnimacaoIdle){
            this.start();
        }
        else if(novoEstado){
            const duration = this.animacaoIdle.frames;
            this.animacaoIdle.idle = false;
            this.animacaoIdle.finalizarExecucao(); 
            this.animacaoIdle.setinha.removeFromScene();

            // if(this.estado.restart) clearTimeout(this.estado.restart);

            // this.estado.restart = setTimeout(() => (this.estado.restart) ? this.start(): null, this.delay);
            //Se um dia refatorar animação, talvez isso quebre a animação idle pois os frames vão para o final
        }
    }
}