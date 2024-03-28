import * as THREE from 'three';
import { Objeto } from './objeto';

export class Edge extends Objeto{

    constructor(origem, destino){

        super();

        this.origem = origem;
        this.destino = destino;

        this.material = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.grossura = 0.05;

        this.render();
    }

    render(){

        const origem  = this.origem;
        const destino = this.destino;

        const vetor = destino.clone().sub(origem);

        const cylinderGeometry = new THREE.CylinderGeometry(this.grossura, this.grossura, vetor.length(), 16);
        
        const cano = new THREE.Mesh(cylinderGeometry, this.material);
        
        const posicao = destino.clone().add(origem).multiplyScalar(0.5);

        cano.position.copy(posicao);

        cano.lookAt(destino);

        cano.rotateX(Math.PI/2);

        this.mesh = cano;

        return this;
    }

    update(){
        
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);

        this.render();

        this.scene.add(this.mesh);
    }

    get length(){
        return this.origem.clone().sub(this.destino).length();
    }

    get quaternion(){
        return this.mesh.quaternion;
    }

    get hitbox(){
        return this.mesh;
    }
}