import * as THREE from 'three'
import Animacao, { AnimacaoSequencial, curvas } from "./animation";
import { apagarObjeto } from './apagarObjeto';
import { Objeto } from '../objetos/objeto';
import { mover } from './mover';
import MoverVertice from '../outputs/moverVertice';

export default class SimularMovimento extends Animacao{

    constructor(objeto, trajetoria=null, raio=0.5, quantidadeDePontos=3){
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

    comSetinha(scene){

        return new AnimacaoSequencial(
            this.mostrarSetinha(scene), 
            this
        )
        .manterExecucaoTodos(false)
        .setOnTermino(() => {
            scene.remove(this.setinha.mesh)
        })
    }

    mostrarSetinha(scene, removeOnTermino=false){
        const dir = new THREE.Vector3( -1, 2, 0 );

        //normalize the direction vector (convert to vector of length 1)
        dir.normalize();
        
        const origin = new THREE.Vector3( 0, 0, 0 );
        const length = 0.3;
        const hex = 0x000000;

        const group = new THREE.Group();

        const arrowMesh = new THREE.ArrowHelper( dir, origin, length, hex , 0.75*length, 0.5*length);

        arrowMesh.position.copy(dir.clone().negate().multiplyScalar(length));

        group.add(arrowMesh)
        
        const arrowHelper = Objeto.fromMesh(group);
       
        this.setinha = arrowHelper;

        const moverSetinha = mover(arrowHelper, new THREE.Vector3(10,0,0), null)
                            .setOnStart(() => {
                                moverSetinha.setValorFinal(this.objeto.getPosition());
                                arrowHelper.addToScene(scene);
                                
                                new MoverVertice(arrowHelper).addInputs(this.objeto.draggable);
                            });


        if(removeOnTermino) moverSetinha.setOnTermino(() => scene.remove(this.setinha.mesh))
                            

        return moverSetinha;
    }

}