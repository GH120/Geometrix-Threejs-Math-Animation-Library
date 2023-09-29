import * as THREE from 'three';
import { Objeto } from './objeto';

export class Angle extends Objeto{

    constructor(vertices, index=0){

        super();

        this.vertices = vertices;
        this.index = index;
        this.angleRadius = 0.7;
        this.grossura = 0.065;
        this.material = new THREE.MeshBasicMaterial({color:0xff0000})

        // this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1), this.material)

    }

    render(){
        this.setPositions();
        this.getVetores();
        this.renderMalha();
        return this;
    }

    setPositions(){

        const index     = this.index;
        const positions = this.vertices.map(vertex => vertex.mesh.position.clone());

        this.position = positions[index];
        this.seguinte = positions[(index+1)%positions.length];
        this.anterior = positions[(index+2)%positions.length];

        return this;
    }

    getVetores(){
        //Dois vetores apontando para os vértices opostos a esse
        let vetor1 = this.position.clone().sub(this.seguinte).normalize();
        let vetor2 = this.position.clone().sub(this.anterior).normalize();

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
        const center = [this.position.x, this.position.y, this.position.z];

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

        const MalhaAngulo  = new THREE.Mesh(sectorGeometry, this.material)
        const MalhaReto    = this.anguloReto;
        const noventaGraus = Math.round(this.angulo*180/Math.PI) == 90;

        this.mesh   = (noventaGraus)? MalhaReto : MalhaAngulo;

        this.hitbox =  MalhaAngulo;
        
        return this;
    }

    get anguloReto(){

        const grossura = this.grossura;
        const raio     = this.angleRadius;

        //Triangulo esquerdo e direito do quadrado base
        const trianguloEsquerdo  = [[0,0,0], [1,0,0],[1,1,0]];
        const trianguloDireito   = [[1,1,0], [0,1,0],[0,0,0]];

        const quadrado = [...trianguloDireito, ...trianguloEsquerdo];

        //Constroi os lados do quadrado oco copiando o quadrado base e alterando suas proporções
        const left   =  quadrado.map(array => new THREE.Vector3(...array))
                                .map(vetor => vetor.setX(vetor.x*grossura));
        const right  =  quadrado.map(array => new THREE.Vector3(...array))
                                .map(vetor => vetor.setX(vetor.x*grossura + 1 - grossura));
        const bottom =  quadrado.map(array => new THREE.Vector3(...array))
                                .map(vetor => vetor.setY(vetor.y*grossura));
        const top    =  quadrado.map(array => new THREE.Vector3(...array))
                                .map(vetor => vetor.setY(vetor.y*grossura + 1 - grossura));
        
        const vetores  = [...left, ...top];

        //Rotaciona o quadrado para orientação certa
        const rotacao = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0), this.vetor2));

        vetores.map(v => v.setY(v.y - 1));
        vetores.map(v => v.multiplyScalar(raio*0.7));
        vetores.map(v => v.applyMatrix4(rotacao));
        
        //Concatena os vetores que representam os pontos em um só array de eixos
        const posicoes = [].concat(...vetores.map(vetor => vetor.toArray()));

        //Cria a buffer geometry e atribui a posição os valores das posições
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        const mesh = new THREE.Mesh(geometry, this.material);

        const vetor = this.vetor1.clone().lerp(this.vetor2, 0.5).multiplyScalar(raio*Math.sqrt(2));

        const posicao = new THREE.Vector3(...this.position).sub(vetor);

        mesh.position.copy(posicao);

        const group = new THREE.Group();

        group.add(mesh);

        // mesh.lookAt(new THREE.Vector3(-1,-1,0))

        return group;
    }
    
    update(){

        const scene = this.scene;

        scene.remove(this.mesh);

        this.render();

        scene.add(this.mesh);
    }

    get degrees(){
        return this.angulo*(180/Math.PI);
    }
}