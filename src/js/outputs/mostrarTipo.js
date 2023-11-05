import * as THREE from 'three';
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Output } from './Output';


//mostra o tipo do triângulo
export class MostrarTipo extends Output{

    constructor(triangulo){
        super();
        this.triangulo = triangulo;
        this.createText();
    }

    _update(){
        let tipo = "Triângulo ";

        const maiorAngulo = this.triangulo.angles.reduce((a,b) => (a.degrees > b.degrees)? a : b, 0);
        
        tipo += (this.triangulo.retangulo())? "Retângulo " : (maiorAngulo.degrees > 90)? "Obtusângulo " : "Acutângulo ";

        tipo += (this.triangulo.isoceles())? (this.triangulo.equilatero())? "Equilatero " : "Isoceles" : "Escaleno";

        const posicaoMaisAlta = this.triangulo.angles.map(angle => angle.position)
                                                       .reduce((a,b) =>(a.y>b.y)? a : b)
                                                       .clone();

        this.text.position.copy(this.centro);

        this.text.position.y = posicaoMaisAlta.y + Math.sqrt(this.raio/10);

        this.text.element.textContent = tipo;

        const scene = this.scene;

        scene.remove(this.text)

        scene.add(this.text)
    }

    get centro(){
        return this.triangulo.angles.map(angle => angle.position.clone()).reduce((a,b) => a.add(b), new THREE.Vector3(0,0,0)).multiplyScalar(1/3);
    }

    get raio(){
        return this.triangulo.angles[0].position.clone().sub(this.centro).length();
    }

    createText(){
        const p = document.createElement('p');
        p.textContent = "teste";
        p.style = "font-size: 30px; font-weight: bold; color: #333;";
        p.style.fontFamily = "Playfair Display, serif"
        const cPointLabel = new CSS2DObject(p);

        this.text = cPointLabel;

        return this;
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }
}