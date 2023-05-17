import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Draggable} from '../controles/draggable';
import {Hoverable} from '../controles/hoverable';
import {Angle} from './angle';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from '../controles/trigonometry';

class Edge {

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
}

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
        
        this.angles = vertices.map( (vertex, index) => new Angle(vertices, index)
                                                        .setText(this.pObjs[index])
                                                        .render());

        return this;
    }

    renderText() {
        this.pObjs = this.vertices.map((esfera, indice) => {
            return {elemento: this.createText("teste", esfera.position), on:false, getPosition: () => esfera.position};
        });

        // this.nome = {elemento: this.createText("teste", this.vertices[0].position)};


        return this;
    }

    createText(texto, position) { 
        const p = document.createElement('p');
        p.textContent = texto;
        p.style = "font-size: 14px; font-weight: bold; color: #333;";
        const cPointLabel = new CSS2DObject(p);
        // this.scene.add(cPointLabel);
        cPointLabel.position.set(...position);

        return cPointLabel;
    }

    createControlers(camera){

        this.hoverable = this.angles.map(   angle  => new Hoverable(angle.mesh, camera).addObserver(angle));
        this.draggable = this.vertices.map( vertex => new Draggable(vertex    , camera).addObserver(this));

        return this;
    }

    addToScene(scene){

        this.scene = scene;

        this.vertices.map(vertex => scene.add(vertex));
        this.edges.map(   edge   => edge.addToScene(scene));
        this.angles.map(  angle  => angle.addToScene(scene));
        // scene.add(this.nome.elemento);

        return this;
    }

    update(){

        const scene = this.scene;

        console.log(this.isoceles());
        
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

        const igual = (a,b) => Math.abs(a.angulo - b.angulo) < Math.PI/135;

        for(const angulo1 of this.angles)
            for(const angulo2 of this.angles)
                if(angulo1 != angulo2 && igual(angulo1,angulo2))
                    return true;
        
        return false;
    }
}