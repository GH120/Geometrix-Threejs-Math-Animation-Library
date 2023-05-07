import * as THREE from 'three';

export class Triangle{

    constructor(){

        this.angleCount = 10;
        this.grossura = 0.05
        this.cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xe525252 });
        this.sphereGeometry =   new THREE.SphereGeometry(0.1);
        this.sphereMaterial =   new THREE.MeshBasicMaterial({ color: 0x8c8c8c });

        this.positions = [
            [0,0,-1],
            [0,-1,-1],
            [-1,-1,-1],
        ]

        this.positions = this.positions.map(vetor => vetor.map(n => n*5))

        this.positions = this.positions.map(vetor => [vetor[0]+5, vetor[1]+5, vetor[2]]);
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

    renderAngles(){

        const sectorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000});
        
        const positions = this.vertices.map(vertex => [vertex.position.x, vertex.position.y, vertex.position.z]);

        this.angles = positions.map( (position, index) =>{

            const seguinte = positions[(index+1)%this.positions.length];
            const anterior = positions[(index+2)%this.positions.length];

            // Create the geometry for the sector
            const sectorGeometry = new THREE.BufferGeometry();
            const sectorVertices = [];

            const diferenca = (origem, destino, eixo) => (destino[eixo] - origem[eixo]);

            const CriarVetor = (origem, destino) => new THREE.Vector3( ...[0,1,2].map(eixo => diferenca(destino, origem, eixo)));

            //Dois vetores apontando para os vértices opostos a esse
            const vetor1 = CriarVetor(position, seguinte).normalize();
            const vetor2 = CriarVetor(position, anterior).normalize();


            let last = [position[0], position[1], position[2]];

            for (let i = 0; i <= this.angleCount; i++) {

                const vetor = new THREE.Vector3(0,0,0);
                
                //Interpola entre os dois vetores para conseguir um ponto do angulo
                vetor.lerpVectors(vetor2,vetor1, i/this.angleCount).normalize();

                const x = position[0] - vetor.x*0.4;
                const y = position[1] - vetor.y*0.4;
                sectorVertices.push(position[0], position[1], position[2])
                sectorVertices.push(...last);
                sectorVertices.push(x, y, position[2]);

                last = [x,y,position[2]];
            }

            sectorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sectorVertices, 3));

            sectorGeometry.computeVertexNormals();


            // Create the sector mesh and add it to the scene
            const sectorMesh = new THREE.Mesh(sectorGeometry, sectorMaterial);

            return sectorMesh;
        });

        return this;
    }

    update(scene){
        this.edges.map(edge => {

            edge.geometry.dispose();
            edge.material.dispose();
            scene.remove(edge);
            
        });
        this.renderEdges();
        this.edges.map(edge => scene.add(edge));

        this.angles.map(angle => {

            angle.geometry.dispose();
            angle.material.dispose();
            scene.remove(angle);
            
        });
        this.renderAngles();
        this.angles.map(angle => scene.add(angle));
    }


}