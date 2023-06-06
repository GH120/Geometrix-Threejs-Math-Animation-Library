import * as THREE from 'three'
import Circle from '../objetos/circle';
import { Animacao } from './animation';

export default class Circunscrever extends Animacao {

    constructor(triangulo, scene, anguloInicial = 0, anguloFinal = 360, duration = 100){

        super(triangulo)

        this.triangulo = triangulo;
        this.scene = scene;
        this.valorInicial = anguloInicial;
        this.valorFinal = anguloFinal;
        this.frames = duration;
        
        this.circulo = this.circunscrever(triangulo);

        this.setUpdateFunction(function(angulo){
            
            this.scene.remove(this.circulo.mesh);

            this.circulo.construirMesh(angulo);

            this.circulo.update()

            this.scene.add(this.circulo.mesh);
        })
    }

    interpolacao(inicial, final, peso){

        const curva = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

        return inicial*(1-curva(peso)) + final*curva(peso);
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
        for(let i = 0; i < 100; i++){
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

        const centro = chute;
        const raio   = R1(chute).length();

        return new Circle(centro, raio*(1.05), 0.05);
    }
}