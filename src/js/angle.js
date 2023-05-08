import * as THREE from 'three';

export class Angle{

    constructor(positions, index, textObjects){

        this.angleCount = 10;

        const position = positions[index];
        const seguinte = positions[(index+1)%this.positions.length];
        const anterior = positions[(index+2)%this.positions.length];

        // Create the geometry for the sector
        const sectorGeometry = new THREE.BufferGeometry();
        const sectorVertices = [];

        getVetores();
        renderMalha();

        const posicoes = sectorGeometry.getAttribute('position').array;

        sectorGeometry.setAttribute('angulo', new THREE.Float32BufferAttribute([angulo], 1));
        sectorGeometry.setAttribute('anguloGraus', new THREE.Float32BufferAttribute([angulo * (180 / Math.PI)], 1));

        // Create the sector mesh and add it to the scene
        this.mesh = new THREE.Mesh(sectorGeometry, sectorMaterial);

        this.pObjs = textObjects
        this.mesh.onHover = this.onHover;

    }

    getVetores(positions, index){

        const diferenca = (origem, destino, eixo) => (destino[eixo] - origem[eixo]);

        const CriarVetor = (origem, destino) => new THREE.Vector3( ...[0,1,2].map(eixo => diferenca(destino, origem, eixo)));

        //Dois vetores apontando para os vértices opostos a esse
        this.vetor1 = CriarVetor(position, seguinte).normalize();
        this.vetor2 = CriarVetor(position, anterior).normalize();

        this.angulo = vetor1.angleTo(vetor2);
    }

    renderMalha(){

        let last = [position[0], position[1], position[2]];

        for (let i = 0; i <= this.angleCount; i++) {

            // const vetorlast = new THREE.Vector3(...last);
            const vetor = new THREE.Vector3(0,0,0);
            // console.log(vetorlast);
            
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
    }

    onHover(onHover){

        if(!this.pObjs) return;

        if (onHover) {

            const elemento = this.pObjs[index].elemento;

            elemento.element.textContent = (angulo * (180 / Math.PI)).toFixed() + "°";

            const vetor = new THREE.Vector3(0,0,0).lerpVectors(vetor2,vetor1,0.5).normalize();

            elemento.vetor = vetor;

            this.pObjs[index].on = true;
        }
        else{
            this.pObjs[index].on = false;
        }
    }

    addText(textObjects){
        this.pObjs = textObjects;
    }
}