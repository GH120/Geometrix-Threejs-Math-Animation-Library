import * as THREE from 'three'
import Animacao, { curvas } from "./animation";

export default class SimularMovimento extends Animacao{

    constructor(objeto, trajetoria, raio=0.5, quantidadeDePontos=3){
        super(objeto);

        const points = [
            new THREE.Vector3(0,0,0),
            ...(trajetoria)? trajetoria : this.generateRandomPoints(quantidadeDePontos, raio),
            new THREE.Vector3(0,0,0)
        ]

        this.trajetoria = new THREE.CatmullRomCurve3(points, true);

        this.interpolacaoComum();
        this.setDuration(300)
    }

    generateRandomPoints(numPoints, radius) {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = radius * Math.sqrt(Math.sqrt(Math.random()));  // Uniform distribution within a circle
            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle)  // Spread points randomly along the y-axis
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

    curva(x){
        return curvas.easeInOutBounce(x)
    }

}