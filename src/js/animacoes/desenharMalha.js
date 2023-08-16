//Desenha triângulo por triângulo a malha desejada, em ordem
import * as THREE from 'three';
import Animacao from "./animation";

export default class DesenharMalha extends Animacao{

    constructor(malha, scene){
        super(malha);

        this.scene = scene;

        this.valorInicial = 0;
        this.valorFinal   = malha.geometry.attributes.position.count;
        this.frames = 200;
        this.voltar = false;

        this.setUpdateFunction(function(posicao){

            const scene = this.scene;
            
            const posicoes = this.objeto.geometry.attributes.position.array.slice(0,posicao*3);

            const material = this.objeto.material;

            const geometry = new THREE.BufferGeometry();

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

            scene.remove(this.malha)

            this.malha = new this.objeto.constructor(geometry, material);

            scene.add(this.malha);
        })
    }

    onTermino(){
        console.log("terminou", this.scene)
    }

    interpolacao(inicial, final, peso){

        const curva = (x) =>  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

        peso = curva(peso);

        return Math.floor(inicial*(1-peso) + final*peso);
    }
}