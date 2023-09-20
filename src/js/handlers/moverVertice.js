import { Handler } from './handler';
import * as THREE from 'three';

//Preciso adicionar smoothing para valores como 30°, 45°, 60° e 90°
//Implementar o smoothing como o vídeo do autotargeting ensinou
export default class MoverVertice extends Handler{

    constructor(triangulo, vertice){
        super();
        this.triangulo = triangulo;
        this.vertice = vertice;

    }

    update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const point = this.estado.position;

        // console.log(point, "funciona")

        // console.log(point);

        if(!point) return;

        // this.getFocos();

        // const speed = new THREE.Vector3().subVectors(point, this.vertice.position);

        this.vertice.moveTo(point);

        this.triangulo.update();
    }

    //Retorna os pontos focais, ou seja, os pontos que iriam satisfazer um dos requisitos
    getFocos(){
        
    }
}