import * as THREE from 'three'
import Animacao, { curvas } from "./animation";

export default class SimularMovimento extends Animacao{

    constructor(objeto, trajetoria){
        super(objeto);

        const points = this.generateRandomPoints(3, 0.01);

        this.trajetoria = new THREE.CatmullRomCurve3(points, true);

        this.interpolacaoComum();
        this.setDuration(10000)
    }

    generateRandomPoints(numPoints, radius) {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = radius * Math.sqrt(Math.random());  // Uniform distribution within a circle
            const x = r * Math.cos(angle);
            const y = (Math.random() - 0.5) * 2;  // Spread points randomly along the y-axis
            points.push(new THREE.Vector3(x, y, 0));
        }
        return points;
    }

    update(peso){

        const ponto = this.trajetoria.getPoint(peso);

        ponto.add(this.centroOrbita);

        this.objeto.draggable.notify({dragging:true, position: ponto});
    
    }

    onStart(){
        this.centroOrbita = this.objeto.getPosition();
    }

}