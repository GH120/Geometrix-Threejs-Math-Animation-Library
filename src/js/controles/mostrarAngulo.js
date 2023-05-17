import * as THREE from 'three'
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';

export class MostrarAngulo{

    constructor(triangulo, index){

        this.triangulo = triangulo;
        this.vertice = triangulo.vertices[index];
        this.angulo = triangulo.angles[index];
        this.createText();

    }

    createText(){
        const p = document.createElement('p');
        p.textContent = "teste";
        p.style = "font-size: 14px; font-weight: bold; color: #333;";
        const cPointLabel = new CSS2DObject(p);

        this.text = {elemento:cPointLabel, on:false}

        return this;
    }

    onHover(onHover){

        if (onHover) {

            const elemento = this.text.elemento;

            const angulo = this.angulo;

            elemento.element.textContent = (angulo.degrees).toFixed() + "°";

            const vetor = new THREE.Vector3(0,0,0).lerpVectors(angulo.vetor2,angulo.vetor1,0.5).normalize().multiplyScalar(1.2*angulo.angleRadius);

            const position = this.vertice.position.clone();

            const newPosition = position.sub(vetor).add(new THREE.Vector3(0.15,0.15,0))

            elemento.position.copy(newPosition)

            this.text.on = true;
        }
        else{
            this.text.on = false;
        }
    }

    update(){

        const scene = this.scene;

        scene.remove(this.text.elemento)

        if(this.text.on)
            scene.add(this.text.elemento)
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }

    get centro(){
        return this.triangulo.vertices.map(vertice => vertice.position.clone()).reduce((a,b) => a.add(b), new THREE.Vector3(0,0,0)).multiplyScalar(1/3);
    }
}