import { Output } from './Output';
import * as THREE from 'three';

export class ColorirIsoceles extends Output{

    constructor(triangulo){
        super();
        this.triangulo = triangulo;
    }

    _update(){
        console.log("funcionou")

        const isoceles = this.triangulo.isoceles();

        this.descolorir();

        if(isoceles) this.colorirAngulos();
    }

    colorirAngulos(){

        const angles = this.triangulo.angles;

        const arredondar = valor => parseFloat(valor.toFixed());

        const igual = (alpha,beta) => Math.abs(arredondar(alpha.degrees) - arredondar(beta.degrees)) == 0;

        const iguais = angles.map(angulo1 => angles.filter(angulo2 => (angulo1.index != angulo2.index) && igual(angulo1,angulo2)))
                             .reduce((a,b) => a.concat(b),[]) 

        const color = (this.triangulo.equilatero())? 0x00ff00 : 0x0000aa;


        for(const angulo of iguais){
            angulo.material = new THREE.MeshBasicMaterial({color:color});
            angulo.update();
        }

        this.iguais = iguais;
    }

    descolorir(){

        for(const angulo of this.triangulo.angles){
            angulo.material = new THREE.MeshBasicMaterial({color:0xff0000});
            angulo.update();
        }
    }
}