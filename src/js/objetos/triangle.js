import * as THREE from 'three';
import {Angle} from './angle';
import {Edge} from './edge.js';


export class Triangle{

    constructor(positions =  [[0,0,0],[3,0,0],[3,3,0],]){

        this.grossura = 0.05
        this.sphereGeometry =   new THREE.SphereGeometry(0.1);
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });

        this.positions = positions;
        this.edges = [];
        this.angles = [];
    }

    renderVertices(){
        this.vertices = this.positions.map(position => {
            const esfera = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
            esfera.position.set(...position);
            return esfera;
        });

        return this;
    }

    renderEdges(){
        this.edges = this.vertices.map((esfera, indice) => new Edge(this,indice));
        return this;
    }

    renderAngles(){

        const vertices = this.vertices;
        
        this.angles = vertices.map( (vertex, index) => new Angle(vertices, index).render());

        return this;
    }

    addToScene(scene){

        this.scene = scene;

        this.vertices.map(vertex => scene.add(vertex));
        this.edges.map(   edge   => edge.addToScene(scene));
        this.angles.map(  angle  => angle.addToScene(scene));

        this.update();

        return this;
    }

    removeFromScene(){

        this.scene = scene;

        this.vertices.map(vertex => scene.add(vertex));
        this.edges.map(   edge   => scene.remove(edge.mesh));
        this.angles.map(  angle  => scene.remove(angle.mesh));

        this.update();

        return this;
    }

    update(){

        const scene = this.scene;

        //Atualiza as malhas das arestas
        this.edges.map(edge => edge.update());

        //Atualiza a malha dos ângulos
        this.angles.map(angle => angle.update())
    }

    retangulo(){

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha) - arredondar(beta)) == 0;
        
        return this.angles.map(angulo => igual(angulo.degrees, 90))
                          .reduce((ehNoventaGraus, existe) => existe || ehNoventaGraus, false);
    }

    isoceles(){

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha.degrees) - arredondar(beta.degrees)) == 0;

        for(const angulo1 of this.angles)
            for(const angulo2 of this.angles)
                if(angulo1 != angulo2 && igual(angulo1,angulo2))
                    return true;
        
        return false;
    }

    equilatero(){

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha.degrees) - arredondar(beta.degrees)) == 0;

        for(const angulo1 of this.angles)
            for(const angulo2 of this.angles)
                if(!igual(angulo1,angulo2))
                    return false;
        
        return true;
    }

    get centro(){
        return this.vertices.map(vertice => vertice.position.clone())
                            .reduce((a,b) => a.add(b), new THREE.Vector3(0,0,0))
                            .multiplyScalar(1/3);
    }

    get raio(){
        return this.vertices[0].position.clone().sub(this.centro).length();
    }
}