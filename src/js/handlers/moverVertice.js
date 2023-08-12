import * as THREE from 'three';

//Preciso adicionar smoothing para valores como 30°, 45°, 60° e 90°
//Implementar o smoothing como o vídeo do autotargeting ensinou
export default class MoverVertice{

    constructor(objeto, vertice){
        this.objeto = objeto;
        this.vertice = vertice;

        console.log(this.vertice, this.objeto)
    }

    update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const point = this.estado.position;

        if(!point) return;

        this.getFocos();

        const speed = new THREE.Vector3().subVectors(point, this.vertice.position);

        this.vertice.position.copy(point);

        this.objeto.update();
    }

    //Retorna os pontos focais, ou seja, os pontos que iriam satisfazer um dos requisitos
    getFocos(){
        
    }
}