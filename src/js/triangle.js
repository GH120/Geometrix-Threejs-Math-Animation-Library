import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Draggable} from './draggable';
import {Hoverable} from './hoverable';
import {Angle} from './angle';

export class Triangle{

    constructor(scene = null){

        this.angleCount = 10;
        this.angleRadius = 1;
        this.grossura = 0.05
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.sphereGeometry =   new THREE.SphereGeometry(0.1);
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });
        this.scene = scene;

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
            return {elemento: this.createText("teste", esfera.position), on:false};
        });

        return this;
    }

    createText(texto, position) { 
        const p = document.createElement('p');
        p.textContent = texto;
        const cPointLabel = new CSS2DObject(p);
        // this.scene.add(cPointLabel);
        cPointLabel.position.set(...position);

        return cPointLabel;
    }

    renderAngles(){

        const sectorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});
        
        const positions = this.vertices.map(vertex => [vertex.position.x, vertex.position.y, vertex.position.z]);

        this.angles = positions.map( (position, index) => {

            new Angle()
            .setPositions(positions,index)
            .getVetores()
            .renderMalha()
            .setText(this.pObjs)
        });

        return this;
    }

    createControlers(camera){

        this.hoverable = this.angles.map(angle => new Hoverable(angle, camera));
        this.draggable = this.vertices.map(vertex => new Draggable(vertex,camera));

        return this;
    }

    update(scene){

        // adicionando vertices
        this.edges.map(edge => {

            edge.geometry.dispose();
            edge.material.dispose();
            scene.remove(edge);
            
        });
        this.renderEdges();
        this.edges.map(edge => scene.add(edge));

        // adicionando texto do angulo
        if (this.pObjs) {
            this.pObjs.map((objeto, index) => {

                scene.remove(objeto.elemento);

                if(objeto.on) {
                    scene.add(objeto.elemento);
                }

                objeto.elemento.position.copy(this.vertices[index].position);

                // if(objeto.elemento.objeto.elemento.position.x += objeto.elemento.vetor[0];
                
            });
        }

        const positions = this.vertices.map(vertex => [vertex.position.x, vertex.position.y, vertex.position.z]);

        // retirada e colocada dos angulos
        this.angles.map((angle, index) => {

            angle.mesh.geometry.dispose();
            angle.mesh.material.dispose();
            scene.remove(angle.mesh);

            angle
            .setPositions(positions,index)
            .getVetores()
            .renderMalha()

            scene.add(angle.mesh);

            this.hoverable[index].object = angle     
        });
    }

}