import * as THREE from 'three';
import {Animacao} from './animation';

export class Divisao extends Animacao{

    constructor(lado1, lado2){
        super();
        this.dividendo = lado1;
        this.divisor = lado2;
        this.frames = 300;
    }

    //Animação para mover um lado
    mover(lado, posicaoInicial, posicaoFinal){

      return new Animacao(lado)
                .setValorInicial(posicaoInicial)
                .setValorFinal(posicaoFinal)
                .setDuration(300)
                .setInterpolacao(function(inicial,final,peso){
                  return new THREE.Vector3().lerpVectors(inicial,final,peso);
                })
                .setUpdateFunction(function(position){
                  this.objeto.mesh.position.copy(position);
                })
    }

    //Animação para girar um lado
    girar(lado, quaternionInicial, quaternionFinal){

      return new Animacao(lado)
                .setValorInicial(quaternionInicial)
                .setValorFinal(quaternionFinal)
                .setDuration(300)
                .setInterpolacao(function(inicial,final,peso){
                  return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                })
                .setUpdateFunction(function(quaternion){
                  this.objeto.mesh.quaternion.copy(quaternion);
                });
    }

    //Cria as animações a serem usadas
    animar(){

        const posicaoInicial = this.dividendo.mesh.position.clone();
        const posicaoFinal = new THREE.Vector3(3,0,0).add(posicaoInicial);
        const mover = this.mover(this.dividendo, posicaoInicial, posicaoFinal);

        const posicaoInicial2 = this.divisor.mesh.position.clone();
        const diferencaAltura = this.divisor.length - this.dividendo.length;
        const posicaoFinal2 = new THREE.Vector3(0.2,diferencaAltura/2,0).add(posicaoFinal);
        const mover2 = this.mover(this.divisor, posicaoInicial2, posicaoFinal2);

        const quaternionInicial = this.dividendo.mesh.quaternion.clone();
        const quaternionFinal = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
        const girar = this.girar(this.dividendo, quaternionInicial, quaternionFinal);
        
        const quaternionInicial2 = this.divisor.mesh.quaternion.clone();
        const girar2 = this.girar(this.divisor, quaternionInicial2, quaternionFinal)
        
        this.animations = [mover,girar,mover2,girar2];

        return this;
    }

    *getFrames(){

        this.animations.map(animation => animation.setDuration(this.frames));

        const animation = this.animations.map(animation => animation.getFrames());

        for(let i =0; i < this.frames; i++){
            yield animation.map(animation => animation.next());
        }
    }
}