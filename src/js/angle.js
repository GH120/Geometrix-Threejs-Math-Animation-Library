import * as THREE from 'three';

export class Angle{

    constructor(vertices, index){

        this.vertices = vertices;
        this.index = index;
        this.angleRadius = 1;
        this.sectorMaterial = new THREE.MeshBasicMaterial({color:0xff0000})

    }

    render(){
        this.setPositions();
        this.getVetores();
        this.renderMalha();
        return this;
    }

    setPositions(){

        const index     = this.index;
        const positions = this.vertices.map(vertex => [vertex.position.x, vertex.position.y, vertex.position.z]);

        this.position = positions[index];
        this.seguinte = positions[(index+1)%positions.length];
        this.anterior = positions[(index+2)%positions.length];

        return this;
    }

    getVetores(){

        const diferenca = (origem, destino, eixo) => (destino[eixo] - origem[eixo]);

        const CriarVetor = (origem, destino) => new THREE.Vector3( ...[0,1,2].map(eixo => diferenca(destino, origem, eixo)));

        //Dois vetores apontando para os vértices opostos a esse
        let vetor1 = CriarVetor(this.position, this.seguinte).normalize();
        let vetor2 = CriarVetor(this.position, this.anterior).normalize();

        //Se estiverem no sentido horário, inverter sua ordem
        const sentidoHorario = new THREE.Vector3(0,0,0).crossVectors(vetor1, vetor2).dot(new THREE.Vector3(0,0,1)) > 0;

        if(sentidoHorario){
            const vetor = vetor1;
            vetor1 = vetor2;
            vetor2 = vetor;
        }

        
        this.vetor1 = vetor1;
        this.vetor2 = vetor2;
        this.angulo = vetor1.angleTo(vetor2);
        
        return this;
    }

    renderMalha(){

        // Create the geometry for the sector
        const sectorGeometry = new THREE.BufferGeometry();
        const sectorVertices = [];
        const center = this.position;

        let last = [...center];

        //Numero de segmentos de triangulos a serem desenhados
        const segmentos = Math.round(this.angulo*180/Math.PI);

        for (let i = 0; i <= segmentos; i++) {

            const vetor = new THREE.Vector3(0,0,0);
            
            //Interpola entre os dois vetores para conseguir o novo ponto
            vetor.lerpVectors(this.vetor2, this.vetor1, i/segmentos).normalize();

            const x = center[0] - vetor.x*this.angleRadius;
            const y = center[1] - vetor.y*this.angleRadius;
            const z = center[2];

            //Desenha o triângulo (posição do centro, posição anterior, posição atual)
            sectorVertices.push(...center);
            sectorVertices.push(...last);
            sectorVertices.push(x, y, z);

            last = [x,y,z];
        }

        sectorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sectorVertices, 3));

        // Cria a malha
        this.mesh = new THREE.Mesh(sectorGeometry, this.sectorMaterial);

        return this;
    }

    onHover(onHover){

        if (onHover) {

            const elemento = this.text.elemento;

            elemento.element.textContent = (this.angulo * (180 / Math.PI)).toFixed() + "°";

            const vetor = new THREE.Vector3(0,0,0).lerpVectors(this.vetor2,this.vetor1,0.5).normalize().multiplyScalar(1.2*this.angleRadius);

            const position = this.text.getPosition()

            const newPosition = position.clone().sub(vetor).add(new THREE.Vector3(0.15,0.15,0))

            elemento.position.copy(newPosition)

            this.text.on = true;
        }
        else{
            this.text.on = false;
        }
    }

    setText(text){
        this.text = text;

        return this;
    }

    update(){

        const scene = this.scene;

        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        scene.remove(this.mesh);
        scene.remove(this.text.elemento)

        this.render();

        scene.add(this.mesh);

        if(this.text.on)
        scene.add(this.text.elemento)
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }
}