import * as THREE from 'three'

export default class Circle{

    constructor(centro, raio, grossura = 0.01){

        this.hitbox = new THREE.Mesh(new THREE.SphereGeometry(0.5));

        this.hitbox.visible = false;

        this.centro = centro;
        this.raio = raio;
        this.grossura = grossura;

        this.construirMesh();
        this.update();
    }

    getPontos(resolucao){
        const pontos = [];

        const theta = (n) => Math.PI/180*n;
                                    
        const pontoExterno = (i) => [Math.cos(theta(i)), Math.sin(theta(i)), 0];
        
        const pontoInterno = (i) => pontoExterno(i).map(eixo => eixo*(1-this.grossura));
        
        for(let i = 0; i < resolucao; i++){
            //Triângulo externo abaixo, os três pontos dele
            pontos.push(...pontoInterno(i));
            pontos.push(...pontoExterno(i));
            pontos.push(...pontoInterno((i+1)%360));
            //Triângulo interno abaixo, os três pontos dele
            pontos.push(...pontoExterno(i));
            pontos.push(...pontoExterno((i+1)%360));
            pontos.push(...pontoInterno((i+1)%360));
        }

        return pontos;
    }

    construirMesh(resolucao=360){

        const geometry = new THREE.BufferGeometry();

        let posicoes = this.getPontos(resolucao);

        const getCoordenada = (i) => (i%3==0)? this.centro.x : 
                                     (i%3==1)? this.centro.y : 
                                     (i%3==2)? this.centro.z : null;

        posicoes = posicoes.map(coordenada => coordenada*this.raio);

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xff0000}));
    }

    circunscrever(triangulo){

        const posicoes = triangulo.vertices.map(vertice => vertice.position.clone());

        const P1 =  posicoes[0];
        const P2 =  posicoes[1];
        const P3 =  posicoes[2];
 
        let chute = triangulo.centro.clone();

        const R1 = ponto => ponto.clone().sub(P1);
        const R2 = ponto => ponto.clone().sub(P2);
        const R3 = ponto => ponto.clone().sub(P3);

        //Método das bissetrizes 2D
        for(let i = 0; i < 10; i++){
            const modulo1 = R1(chute).length() - R2(chute).length();
            const modulo2 = R2(chute).length() - R3(chute).length();

            const direcao1  = R1(chute).normalize();
            const direcao2  = R2(chute).normalize();

            const valor = modulo => modulo/2;

            direcao1.multiplyScalar(valor(modulo1));
            direcao2.multiplyScalar(valor(modulo2));
            
            chute.sub(direcao1.add(direcao2));

            console.log(modulo1, modulo2);
        }

        this.centro = chute;
        this.update();
    }

    update(){
        this.mesh.position.copy(this.centro);
    }

    get centro(){
        return this.hitbox.position.clone();
    }

    set centro(centro){
        this.hitbox.position.copy(centro);
    }
}