import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Draggable} from './draggable';
import {Hoverable} from './hoverable';

class Angle{

    constructor(vertices, index){

        this.vertices = vertices;
        this.index = index;
        this.angleCount = 10;
        this.angleRadius = 1;
        this.sectorMaterial = new THREE.MeshBasicMaterial({color:0xff0000})

        // const posicoes = sectorGeometry.getAttribute('position').array;

        // sectorGeometry.setAttribute('angulo', new THREE.Float32BufferAttribute([angulo], 1));
        // sectorGeometry.setAttribute('anguloGraus', new THREE.Float32BufferAttribute([angulo * (180 / Math.PI)], 1));

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

        // console.log(sentidoHorario)

        let last = [...center];

        for (let i = 0; i <= this.angleCount; i++) {

            const vetor = new THREE.Vector3(0,0,0);
            
            //Interpola entre os dois vetores para conseguir o novo ponto
            vetor.lerpVectors(this.vetor2, this.vetor1, i/this.angleCount).normalize();

            const x = center[0] - vetor.x*this.angleRadius;
            const y = center[1] - vetor.y*this.angleRadius;
            const z = center[2];

            //Desenha o triângulo (posição do centro, posição anterior, posição atual)
            sectorVertices.push(...center)
            sectorVertices.push(...last);
            sectorVertices.push(x, y, z);

            last = [x,y,z];
        }

        sectorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sectorVertices, 3));

        // Cria a malha
        this.mesh = new THREE.Mesh(sectorGeometry, this.sectorMaterial);

        //Quando o onHover for acionado no mesh, ele vai chamar o onHover do Angle
        this.mesh.onHover = this.onHover.bind(this);

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

    update(scene){

        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        scene.remove(this.mesh);
        scene.remove(this.text.elemento)

        this.render();

        scene.add(this.mesh);
        if(this.text.on)
        scene.add(this.text.elemento)
    }
}


export class Triangle{

    constructor(scene){

        this.angleCount = 10;
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

        this.hoverable = this.angles.map(   angle  => new Hoverable(angle.mesh, camera));
        this.draggable = this.vertices.map( vertex => new Draggable(vertex    , camera));

        this.hoverable.map(hover => hover.observer = this);
        this.draggable.map(dragg => dragg.observer = this);

        console.log(this.hoverable)

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

        this.angles.map(angle => angle.update(scene))

        this.hoverable.map((hover, index) => hover.object = this.angles[index].mesh)  
    }

}