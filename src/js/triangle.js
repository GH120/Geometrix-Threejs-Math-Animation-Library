import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Draggable} from './draggable';
import {Hoverable} from './hoverable';

class Angle{

    constructor(){

        this.angleCount = 10;
        this.sectorMaterial = new THREE.MeshBasicMaterial({color:0xff0000})

        console.log("yes1")

        // const posicoes = sectorGeometry.getAttribute('position').array;

        // sectorGeometry.setAttribute('angulo', new THREE.Float32BufferAttribute([angulo], 1));
        // sectorGeometry.setAttribute('anguloGraus', new THREE.Float32BufferAttribute([angulo * (180 / Math.PI)], 1));

    }

    setPositions(positions, index){

        console.log(positions,index)

        this.position = positions[index];
        this.seguinte = positions[(index+1)%positions.length];
        this.anterior = positions[(index+2)%positions.length];

        return this;
    }

    getVetores(){

        const diferenca = (origem, destino, eixo) => (destino[eixo] - origem[eixo]);

        const CriarVetor = (origem, destino) => new THREE.Vector3( ...[0,1,2].map(eixo => diferenca(destino, origem, eixo)));

        //Dois vetores apontando para os vértices opostos a esse
        this.vetor1 = CriarVetor(this.position, this.seguinte).normalize();
        this.vetor2 = CriarVetor(this.position, this.anterior).normalize();

        this.angulo = this.vetor1.angleTo(this.vetor2);
        
        return this;
    }

    renderMalha(){

        // Create the geometry for the sector
        const sectorGeometry = new THREE.BufferGeometry();
        const sectorVertices = [];
        const position = this.position;

        let last = [position[0], position[1], position[2]];

        for (let i = 0; i <= this.angleCount; i++) {

            const vetor = new THREE.Vector3(0,0,0);
            
            //Interpola entre os dois vetores para conseguir um ponto do angulo
            vetor.lerpVectors(this.vetor2, this.vetor1, i/this.angleCount).normalize();

            const x = position[0] - vetor.x*this.angleRadius;
            const y = position[1] - vetor.y*this.angleRadius;
            sectorVertices.push(position[0], position[1], position[2])
            sectorVertices.push(...last);
            sectorVertices.push(x, y, position[2]);

            last = [x,y,position[2]];
        }

        sectorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sectorVertices, 3));

        // // Cria a malha
        this.mesh = new THREE.Mesh(sectorGeometry, this.sectorMaterial);

        this.mesh.onHover = this.onHover;

        return this;
    }

    onHover(onHover){

        if(!this.pObjs) return;

        if (onHover) {

            const elemento = this.pObjs[index].elemento;

            elemento.element.textContent = (this.angulo * (180 / Math.PI)).toFixed() + "°";

            const vetor = new THREE.Vector3(0,0,0).lerpVectors(this.vetor2,this.vetor1,0.5).normalize();

            elemento.vetor = vetor;

            this.pObjs[index].on = true;
        }
        else{
            this.pObjs[index].on = false;
        }
    }

    setText(textObjects){
        this.pObjs = textObjects;

        return this;
    }
}


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

        const copia = positions.map(p => p);

        this.angle = positions.map( (position, index) => 
                                                            new Angle()
                                                            .setPositions(positions,index)
                                                            .getVetores()
                                                            .renderMalha()
                                                            .setText(this.pObjs)
                                                           
        );

        return this;
    }

    createControlers(camera){

        // this.hoverable = this.angles.map(angle => new Hoverable(angle, camera));
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
    }

}