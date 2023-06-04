import * as THREE from 'three'

export default class Circle{

    constructor(centro, raio, grossura = 0.01){
        this.centro = centro;
        this.raio = raio;
        this.grossura = grossura;

        this.construirMesh();
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
        posicoes = posicoes.map((coordenada, indice) => coordenada + getCoordenada(indice));

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));

        this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xff0000}));
    }

    setFromTriangle(triangulo){
        
        const posicoes = triangulo.vertices.map(vertice => vertice.positions.clone());
    }
}