import { SplineCurve, Vector2 } from "three";
import Animacao, { curvas } from "./animation";

class SimularMovimento extends Animacao{

    constructor(objeto, trajetoria = new SplineCurve([])){
        super(objeto);

        const points = this.generateRandomPoints(10, 5);

        this.trajetoria = new THREE.CatmullRomCurve3(points);

        this.interpolacaoComum();
    }

    generateRandomPoints(numPoints, radius) {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = radius * Math.sqrt(Math.random());  // Uniform distribution within a circle
            const x = r * Math.cos(angle);
            const y = (Math.random() - 0.5) * 2;  // Spread points randomly along the y-axis
            const z = r * Math.sin(angle);
            points.push(new THREE.Vector3(x, y, z));
        }
        return points;
    }

    update(peso){

        const ponto = this.trajetoria.getPoint(peso);

        ponto.add(this.objeto.getPosition());

        this.objeto.mesh.position.copy(ponto);
    }

    curva(x){
        return curvas.easeInOutBounce(x);
    }


}