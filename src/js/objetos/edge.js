import * as THREE from 'three';
import { Objeto } from './objeto';

export class Edge extends Objeto{

    constructor(triangle, index){

        super();

        this.triangle = triangle;
        this.index    = index;
        this.material = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.grossura = 0.05;

        this.render();
    }

    render(){

        const vertices       = this.triangle.vertices;
        
        const proximo        = (this.index+1)%vertices.length;

        const esfera         = vertices[this.index].mesh;
        const esferaSeguinte = vertices[proximo].mesh;

        const vetor = esferaSeguinte.position.clone().sub(esfera.position);

        const cylinderGeometry = new THREE.CylinderGeometry(this.grossura, this.grossura, vetor.length(), 16);
        
        const cano = new THREE.Mesh(cylinderGeometry, this.material);
        
        const posicao = esferaSeguinte.position.clone().add(esfera.position).multiplyScalar(0.5);

        cano.position.copy(posicao);

        cano.lookAt(esferaSeguinte.position);

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
        return (this.mesh)? this.mesh.geometry.parameters.height : 0;
    }

    get quaternion(){
        return this.mesh.quaternion;
    }

    get hitbox(){
        return this.mesh;
    }
}