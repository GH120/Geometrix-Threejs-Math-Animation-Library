//Desenha triângulo por triângulo a malha desejada, em ordem
import * as THREE from 'three';
import Animacao from "./animation";

export default class DesenharMalha extends Animacao{

    constructor(malha, scene){
        super(malha);

        this.scene = scene;

        this.valorInicial = 0;
        this.valorFinal   = malha.geometry.attributes.position.count;
        this.frames = 30;
        this.voltar = false;

        this.malha = malha.clone();

        malha.visible = false;

        this.setUpdateFunction(function(posicao){

            const scene = this.scene;

            const length = this.objeto.geometry.attributes.position.count;

            const intervalo = (this.reverso)? [-posicao*3] : [0, posicao*3]
            
            const posicoes = this.objeto.geometry.attributes.position.array.slice(...intervalo);

            const geometry = new THREE.BufferGeometry();

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

            scene.remove(this.malha)

            this.malha = new this.objeto.constructor(geometry, this.objeto.material);

            scene.add(this.malha);
        })
    }

    reverse(){
        this.reverso = true;
        return this;
    }

    interpolacao(inicial, final, peso){

        const curva = (x) => (x < 0.05)? Math.sin((x * Math.PI)) : Math.sin((x * Math.PI) / 2);

        peso = curva(peso);

        return Math.round(inicial*(1-peso) + final*peso);
    }
}