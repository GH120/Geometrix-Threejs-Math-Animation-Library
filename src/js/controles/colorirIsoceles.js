import * as THREE from 'three';

export class ColorirIsoceles {

    constructor(triangulo){
        this.triangulo = triangulo;
    }

    update(){

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


        for(const angulo of iguais){
            angulo.sectorMaterial = new THREE.MeshBasicMaterial({color:0x0000ff});
            angulo.update();
        }

        this.iguais = iguais;
    }

    descolorir(){

        for(const angulo of this.triangulo.angles){
            angulo.sectorMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
            angulo.update();
        }
    }
}