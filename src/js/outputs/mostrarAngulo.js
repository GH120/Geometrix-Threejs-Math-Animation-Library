import * as THREE from 'three'
import {CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Output } from './Output';
import { apagarCSS2 } from '../animacoes/apagarCSS2';

export class MostrarAngulo extends Output{

    constructor(angle){
        super();

        this.angulo = angle;
        this.estado  = {};
        this.createText();
        this.distanciaTextoParaAngulo = 2;

    }

    createText(){
        const p = document.createElement('p');
        p.style.fontFamily = "'Latin Modern Math', 'Computer Modern', serif";
        p.textContent = "teste";

        // const wrapper = document.createElement("div");

        // wrapper.addChild(p);

        const cPointLabel = new CSS2DObject(p);

        this.text = {elemento:cPointLabel, on:false}

        return this;
    }

    onHover(onHover){

        if (onHover) {

            const elemento = this.text.elemento;

            const angulo = this.angulo;

            elemento.element.textContent = `${(angulo.degrees).toFixed()}°`;

            const vetor = new THREE.Vector3(0,0,0)
                        .lerpVectors(angulo.vetor2,     angulo.vetor1,      0.5)
                        .normalize()
                        .multiplyScalar(this.distanciaTextoParaAngulo * angulo.angleRadius)
                        .applyMatrix4(new THREE.Matrix4().extractRotation(angulo.mesh.matrixWorld));

            const position = this.angulo.mesh.position.clone();

            if(this.fase){

                const razao = elemento.element.textContent.length/4;

                const retangulo = {top:0, bottom:18, left: 0, right: 29.81 * razao};

                const ponto1 = this.fase.pixelToCoordinates(retangulo.top, retangulo.right);
                const ponto2 = this.fase.pixelToCoordinates(retangulo.bottom, retangulo.left);

                const dimensoesTexto = ponto1.clone().sub(ponto2);

                console.log(dimensoesTexto)

                position.sub(dimensoesTexto.multiplyScalar(0.5))
            }

            const newPosition = position.sub(vetor)

            elemento.position.copy(newPosition)

            this.text.on = true;
        }
        else{
            this.text.on = false;
        }
    }

    _update(novoEstado){

        this.estado = {...this.estado, ...novoEstado};

        const scene = this.scene;

        if(!this.scene) throw Error("Faltou setar a cena com o .addToScene(scene)")

        scene.remove(this.text.elemento)

        if(this.estado.dentro)
            scene.add(this.text.elemento)

        this.onHover(this.estado.dentro);
    }

    addToScene(scene){
        this.scene = scene;
        return this;
    }

    addToFase(fase){
        this.fase = fase;
        this.scene = fase.scene;
        return this;
    }

    animacao(){

        return  apagarCSS2(this.texto.elemento).reverse()
                                               .setOnTermino(() => null)
                                               .setOnStart(() => this.update({dentro: true}))
    }
}