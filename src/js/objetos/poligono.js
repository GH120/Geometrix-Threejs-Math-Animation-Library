import * as THREE from 'three';
import {Angle} from './angle';
import {Edge} from './edge.js';
import { Objeto } from './objeto';


export class Poligono extends Objeto{

    constructor(positions =  [[0,0,0],[3,0,0],[3,3,0],]){

        super();

        this.grossura = 0.05
        this.sphereGeometry =   new THREE.SphereGeometry(0.1);
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.numeroVertices = positions.length;


        this.positions = positions;
        this.edges = [];
        this.angles = [];
    }

    render(){

        this.rendered = true;

        this.renderVertices();
        this.renderEdges();
        this.renderAngles();
        return this;
    }

    renderVertices(){
        const esferas = this.positions.map(position => {
            const esfera = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
            esfera.position.set(...position);
            return esfera;
        });

        //Gambiarra enquanto não transforma o vértice em um objeto
        this.vertices = esferas.map(vertice => Objeto.fromMesh(vertice));

        // console.log(this.vertices)

        return this;
    }

    renderEdges(){

        const proximo = (index) => this.vertices[(index+1) % this.numeroVertices];

        const getPosition = (objeto) => objeto.mesh.position;

        this.edges = this.vertices.map(
                        (vertice, index) => new Edge(getPosition(vertice), getPosition(proximo(index)))
                    );

        return this;
    }

    renderAngles(){

        const vertices = this.vertices;
        
        this.angles = vertices.map( (vertex, index) => new Angle(vertices, index).render());

        return this;
    }

    addToScene(scene){

        this.scene = scene; 

        //Tratar caso onde não foi renderizado
        if(!this.rendered) this.render();

        this.vertices.map(vertex => vertex.addToScene(scene))
        this.edges.map(   edge   => edge.addToScene(scene));
        this.angles.map(  angle  => angle.addToScene(scene));

        this.update();

        return this;
    }

    removeFromScene(){

        const scene = this.scene;

        this.vertices.map(vertex => scene.remove(vertex.mesh));
        this.edges.map(   edge   => scene.remove(edge.mesh));
        this.angles.map(  angle  => scene.remove(angle.mesh));

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