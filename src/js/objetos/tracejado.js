import * as THREE from 'three';

export class Tracejado{

    constructor(origem, destino, largura=0.01, altura=0.1, spacingRatio=1, cor=0xf00f00){
        this.origem  = origem;
        this.destino = destino;
        this.largura = largura;
        this.altura  = altura;
        this.spacing = spacingRatio;
        this.material = new THREE.MeshBasicMaterial({color:cor});

        this.renderMalha();
    }

    renderMalha(){

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

            const mesh = new THREE.Mesh(geometry, this.material);

            const origem = this.origem.clone().add(direcao.clone().multiplyScalar(i*(1+this.spacing)));

            mesh.position.copy(origem);

            tracejado.add(mesh);
        }

        this.mesh = tracejado;

    }

    get length(){
        return this.origem.clone().sub(this.destino).length();
    }

    addToScene(scene){
        this.scene = scene;
        scene.add(this.mesh);
        return this;
    }

    update(){
        
        this.scene.remove(this.mesh);

        this.renderMalha();

        this.scene.add(this.mesh);
    }
}