import * as THREE from 'three';

export class Edge {

    constructor(triangle, index){
        this.triangle = triangle;
        this.index    = index;
        this.material = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.grossura = 0.05;

        this.renderMalha();
    }

    renderMalha(){

        const vertices       = this.triangle.vertices;
        
        const proximo        = (this.index+1)%vertices.length;

        const esfera         = vertices[this.index];
        const esferaSeguinte = vertices[proximo];

        const media     = (eixo) => (esfera.position[eixo] + esferaSeguinte.position[eixo])/2;
        const diferenca = (eixo) => (-esfera.position[eixo] + esferaSeguinte.position[eixo]);

        const tamanho = ["x","y","z"].map(eixo => diferenca(eixo)).map(d => d*d).reduce((a,b) => a+b , 0);

        const cylinderGeometry = new THREE.CylinderGeometry(this.grossura, this.grossura, Math.sqrt(tamanho), 16);

        const cano = new THREE.Mesh(cylinderGeometry, this.material);
        cano.position.set(media("x"), media("y"), media("z"));

        cano.lookAt(esferaSeguinte.position);

        cano.rotateX(Math.PI/2);

        this.mesh = cano;

        return this;
    }

    addToScene(scene){
        this.scene = scene;
        this.scene.add(this.mesh)
        return this;
    }

    update(){
        
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.scene.remove(this.mesh);

        this.renderMalha();

        this.scene.add(this.mesh);
    }

    get length(){
        return (this.mesh)? this.mesh.geometry.parameters.height : 0;
    }

    get quaternion(){
        return this.mesh.quaternion;
    }
}