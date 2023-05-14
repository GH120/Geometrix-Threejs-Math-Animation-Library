import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Draggable} from './draggable';
import {Hoverable} from './hoverable';
import {Angle} from './angle';

export class Triangle{

    constructor(){

        this.grossura = 0.05
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.sphereGeometry =   new THREE.SphereGeometry(0.1);
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });

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
        this.edges = this.vertices.map((esfera, indice) => this.createEdge(esfera,indice));
        return this;
    }

    createEdge(esfera,indice){

        const esferaSeguinte = this.vertices[(indice+1)%this.vertices.length];

        const media     = (eixo) => (esfera.position[eixo] + esferaSeguinte.position[eixo])/2;
        const diferenca = (eixo) => (-esfera.position[eixo] + esferaSeguinte.position[eixo]);

        const tamanho = ["x","y","z"].map(eixo => diferenca(eixo)).map(d => d*d).reduce((a,b) => a+b , 0);

        const cylinderGeometry = new THREE.CylinderGeometry(this.grossura, this.grossura, Math.sqrt(tamanho), 16);

        const cano = new THREE.Mesh(cylinderGeometry, this.cylinderMaterial);
        cano.position.set(media("x"), media("y"), media("z"));

        cano.lookAt(esferaSeguinte.position);

        cano.rotateX(Math.PI/2);


        return cano;
    }

    renderText() {
        this.pObjs = this.vertices.map((esfera, indice) => {
            return {elemento: this.createText("teste", esfera.position), on:false, getPosition: () => esfera.position};
        });


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

    renderAngles(){

        const sectorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});

        const vertices = this.vertices;
        
        this.angles = vertices.map( (vertex, index) => new Angle(vertices, index)
                                                        .setText(this.pObjs[index])
                                                        .render());

        return this;
    }

    createControlers(camera){

        this.hoverable = this.angles.map(   angle  => new Hoverable(angle.mesh, camera).addObserver(angle));
        this.draggable = this.vertices.map( vertex => new Draggable(vertex    , camera).addObserver(this));

        return this;
    }

    addToScene(scene){

        this.scene = scene;

        this.vertices.map(vertex => scene.add(vertex));
        this.edges.map(   edge   => scene.add(edge));
        this.angles.map(  angle  => angle.addToScene(scene));

        return this;
    }

    update(){

        const scene = this.scene;

        // adicionando vertices
        this.edges.map(edge => {

            edge.geometry.dispose();
            edge.material.dispose();
            scene.remove(edge);
            
        });

        this.renderEdges();
        
        this.edges.map(edge => scene.add(edge));

        //Atualiza a malha dos ângulos
        this.angles.map(angle => angle.update())

        //Manda os controlers de hover apontarem para a nova malha
        this.hoverable.map((hover, index) => hover.object = this.angles[index].mesh);
    }

}