import Animacao from "./animation";

import * as THREE from 'three';

export default class MoverTexto extends Animacao{

    constructor(
        elementoTexto,
        splinePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 3, 0),
            new THREE.Vector3(4, 1, 0),
            new THREE.Vector3(6, 2, 0)
        ]
    ){

        super();

        this.spline = new THREE.CatmullRomCurve3(splinePoints);
        this.elementoTexto = elementoTexto;


        this.setValorInicial(0);
        this.setValorFinal(1);
        this.setDuration(300);
        this.setInterpolacao((a,b,c) => a*(1-c) + b*c);

        this.setUpdateFunction((tempo) =>{
            this.elementoTexto.position.copy(this.spline.getPointAt(tempo));
        })

        this.voltarAoInicio(false);

        this.setCurva(x => -(Math.cos(Math.PI * x) - 1) / 2)
    }

    setSpline( splinePoints){

        this.spline = new THREE.CatmullRomCurve3(splinePoints);
    }

    setText(elementoTexto){

        console.log(elementoTexto)

        this.elementoTexto = elementoTexto;

        return this;
    }
}