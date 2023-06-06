import * as THREE from 'three';

export class Tracejado{

    constructor(origem, destino, largura=0.05, altura=0.2, spacingRatio=1){
        this.origem  = origem;
        this.destino = destino;
        this.largura = largura;
        this.altura  = altura;
        this.spacing = spacingRatio;

        // this.renderMalha();
        this.renderMesh();
    }

    renderMalha(){

        const tracejado = new THREE.Group();

        const quantidade = this.length/(this.altura*(1+this.spacing));

        const quadrados = [];

        for(let i = 0; i < quantidade; i++){
            quadrados.push(
                new THREE.Mesh(
                    new THREE.PlaneGeometry(this.width/2, this.height/2), 
                    new THREE.MeshBasicMaterial({color:0x808080})
                )
            );
        }

        const interpolar = indice => this.origem.clone().lerp(this.destino, indice*this.length/this.altura);

        quadrados.map((quadrado, indice) => quadrado.position.copy(interpolar(indice)));

        console.log(quadrados);

        quadrados.map(quadrado => tracejado.add(quadrado));

        this.mesh = tracejado;
    }

    renderMesh(){

        const tracejado = new THREE.Group();

        const quantidade = this.length/(this.altura*(1+this.spacing));

        const direcao = this.destino.clone()
                                    .sub(this.origem)
                                    .normalize()
                                    .multiplyScalar(this.altura);

        const ortogonal = (vetor) => ((vetor.x != 1)? vetor.clone().cross(new THREE.Vector3(0,0,1)).normalize() :
                                                      vetor.clone().cross(new THREE.Vector3(1,0,0)).normalize())
                                     .multiplyScalar(this.largura);
        
        const antihorario = (vetor1, vetor2) => (vetor1.clone().cross(vetor2).z > 0)? [vetor1,vetor2] : [vetor2, vetor1];

        //Horrores nunca presenciados pela humanidade
        //Mágica para criar os três pontos do triângulo inferior e superior do quadrado
        const criarTrianguloInferior = () => [].concat(...[new THREE.Vector3(0,0,0), ...antihorario(direcao, ortogonal(direcao).add(direcao))].map(vetor => vetor.toArray()));
        const criarTrianguloSuperior = () => [].concat(...[...antihorario(ortogonal(direcao).add(direcao), ortogonal(direcao)), new THREE.Vector3(0,0,0)].map(vetor => vetor.toArray()));

        for(let i = 0; i < quantidade; i++){

            const geometry = new THREE.BufferGeometry();

            const quadrado = [...criarTrianguloInferior(), ...criarTrianguloSuperior()];

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(quadrado,3));

            const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xf00f00}));

            const origem = this.origem.clone().add(direcao.clone().multiplyScalar(i*(1+this.spacing)));

            mesh.position.copy(origem);

            tracejado.add(mesh);
        }

        this.mesh = tracejado;

    }

    get length(){
        return this.origem.clone().sub(this.destino).length();
    }
}