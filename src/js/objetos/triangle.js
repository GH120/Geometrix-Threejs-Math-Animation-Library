import * as THREE from 'three';
import {Draggable} from '../controles/draggable';
import {Hoverable} from '../controles/hoverable';
import {MostrarAngulo} from '../controles/mostrarAngulo';
import { ColorirIsoceles } from '../controles/colorirIsoceles';
import {Angle} from './angle';
import {Edge} from './edge.js';

import {SenoOnHover, CossenoOnHover, TangenteOnHover} from '../controles/trigonometry';


export class Triangle{

    constructor(){

        this.grossura = 0.05
        this.sphereGeometry =   new THREE.SphereGeometry(0.1);
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });

        this.positions = [
            [0,0,0],
            [0,-1,0],
            [-1,-1,0],
        ]

        this.positions = this.positions.map(vetor => vetor.map(n => n*3))

        this.positions = this.positions.map(vetor => [vetor[0]+3, vetor[1]+3, vetor[2]]);
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

    createControlers(camera){

        this.hoverable = this.angles.map(   angle  => new Hoverable(angle.mesh, camera));
        this.draggable = this.vertices.map( vertex => new Draggable(vertex    , camera).addObserver(this));

        //É um observer, quando onHover é acionado, adiciona ou remove o texto do ângulo
        this.mostrarAngulo = this.angles.map((angle, index) => new MostrarAngulo(angle, this.vertices[index]));
        this.colorirIsoceles = new ColorirIsoceles(this);

        // //Liga esses observers ao hover, quando hover é acionado, ele notifica para mostrar o ângulo
        this.hoverable.map((hoverable,index) => hoverable.addObserver(this.mostrarAngulo[index]));
        this.draggable.map( draggable => draggable.addObserver(this.colorirIsoceles));

        return this;
    }

    addToScene(scene){

        this.scene = scene;

        this.vertices.map(vertex => scene.add(vertex));
        this.edges.map(   edge   => edge.addToScene(scene));
        this.angles.map(  angle  => angle.addToScene(scene));

        this.mostrarAngulo.map(m => m.addToScene(scene));

        this.update();

        return this;
    }

    update(){

        const scene = this.scene;

        //Atualiza as malhas das arestas
        this.edges.map(edge => edge.update());

        //Atualiza a malha dos ângulos
        this.angles.map(angle => angle.update())

        //Manda os controlers de hover apontarem para a nova malha
        this.hoverable.map((hover, index) => hover.object = this.angles[index].mesh);
    }

    retangulo(){
        return this.angles.map(angle => angle.angulo)
                          .filter(angulo => Math.abs(angulo - Math.PI/2) < 0.01)
                          .reduce((ehNoventaGraus, existe) => existe || ehNoventaGraus, false);
    }

    isoceles(){

        const igual = (a,b) => Math.abs(a.angulo - b.angulo) < Math.PI/90;

        for(const angulo1 of this.angles)
            for(const angulo2 of this.angles)
                if(angulo1 != angulo2 && igual(angulo1,angulo2))
                    return true;
        
        return false;
    }
}