import { Output } from './Output';
import * as THREE from 'three';

//Preciso adicionar smoothing para valores como 30°, 45°, 60° e 90°
//Implementar o smoothing como o vídeo do autotargeting ensinou
//** Não atualiza triângulo por padrão, tem que adicionar draggable.addObserver(triangulo) */
export default class MoverVertice extends Output{

    constructor(vertice){
        super();
        this.vertice = vertice;

    }

    _update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const point = this.estado.position;

        // console.log(point, "funciona")

        // console.log(point);

        if(!point) return;

        // this.getFocos();

        // const speed = new THREE.Vector3().subVectors(point, this.vertice.position);

        this.vertice.moveTo(point);

    }

    //Retorna os pontos focais, ou seja, os pontos que iriam satisfazer um dos requisitos
    getFocos(){
        
    }
}