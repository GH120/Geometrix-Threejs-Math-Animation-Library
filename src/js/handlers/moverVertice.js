import * as THREE from 'three';

//Preciso adicionar smoothing para valores como 30°, 45°, 60° e 90°
//Implementar o smoothing como o vídeo do autotargeting ensinou
export default class MoverVertice{

    constructor(objeto, vertice){
        this.objeto = objeto;
        this.vertice = vertice;
    }

    update(point){

        if(!point) return;

        this.getFocos();

        const speed = new THREE.Vector3().subVectors(point, this.vertice.position);

        console.log(point, this.vertice)

        this.vertice.position.copy(point);

        this.objeto.update();
    }

    //Retorna os pontos focais, ou seja, os pontos que iriam satisfazer um dos requisitos
    getFocos(){
        
    }
}