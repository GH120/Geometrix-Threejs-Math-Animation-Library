import * as THREE from 'three';
import {Animacao} from './animation';

export class Divisao extends Animacao{

    constructor(lado1, lado2){
        super();
        this.dividendo = lado1;
        this.divisor = lado2;
    }
    
    animar(){
        const angle = Math.PI; // 180 degrees in radians

        const axis = new THREE.Vector3(0, 0, 1); // Z-axis

        const quaternionFinal = new THREE.Quaternion().setFromAxisAngle(axis, angle);

        let quaternionInicial = this.dividendo.mesh.quaternion;

        const girar = new Animacao(this.dividendo)
                      .setValorInicial(quaternionInicial)
                      .setValorFinal(quaternionFinal)
                      .setDuration(1200)
                      .setInterpolacao(function(inicial,final,peso){
                        return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                      })
                      .setUpdateFunction(function(quaternion){
                        this.objeto.mesh.quaternion.copy(quaternion);
                      });

        let posicaoInicial = this.dividendo.mesh.position.clone();

        const posicaoFinal = new THREE.Vector3(3,0,0).add(posicaoInicial);

        const mover = new Animacao(this.dividendo)
                      .setValorInicial(posicaoInicial)
                      .setValorFinal(posicaoFinal)
                      .setDuration(100)
                      .setInterpolacao(function(inicial,final,peso){
                        return new THREE.Vector3().lerpVectors(inicial,final,peso);
                      })
                      .setUpdateFunction(function(position){
                        this.objeto.mesh.position.copy(position);
                      })
        
        quaternionInicial = this.divisor.mesh.quaternion;

        const girar2 = new Animacao(this.divisor)
                        .setValorInicial(quaternionInicial)
                        .setValorFinal(quaternionFinal)
                        .setDuration(1200)
                        .setInterpolacao(function(inicial,final,peso){
                            return new THREE.Quaternion().slerpQuaternions(inicial,final,peso);
                        })
                        .setUpdateFunction(function(quaternion){
                            this.objeto.mesh.quaternion.copy(quaternion);
                        });
        
        posicaoInicial = this.divisor.mesh.position.clone();

        const diferencaAltura = this.divisor.length - this.dividendo.length;

        const mover2 = new Animacao(this.divisor)
                      .setValorInicial(posicaoInicial)
                      .setValorFinal(new THREE.Vector3(0.2,diferencaAltura/2,0).add(posicaoFinal))
                      .setDuration(100)
                      .setInterpolacao(function(inicial,final,peso){
                        return new THREE.Vector3().lerpVectors(inicial,final,peso);
                      })
                      .setUpdateFunction(function(position){
                        this.objeto.mesh.position.copy(position);
                      })

        
        
        this.animations = [mover,girar,mover2,girar2].map(animation => animation.getFrames());
    }

    *getFrames(){
        for(let i =0; i < 300; i++){
            yield this.animations.map(animation => animation.next());
        }
    }
}