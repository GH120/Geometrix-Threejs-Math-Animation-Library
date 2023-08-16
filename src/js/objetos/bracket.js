import * as THREE from 'three';

export default class Bracket{

    constructor(largura, altura){
        this.largura = largura;
        this.altura  = altura;

        this.renderMalha();
    }

    setDimensions(){
        
    }

    renderMalha(){

        const bracket = new THREE.Group();

        bracket.add(
            this.criarCurva([
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,this.altura,0),
                new THREE.Vector3(-this.largura,0,0), 
                new THREE.Vector3(-this.largura,this.altura,0)
            ])
        );

        bracket.add(
            criarCurva([
                new THREE.Vector3(0,0,0), 
                new THREE.Vector3(0,this.altura,0), 
                new THREE.Vector3(this.largura,0,0), 
                new THREE.Vector3(this.largura,this.altura,0)
            ])
        );
        
        this.mesh = bracket;

    }

    createCurve(points){

        const curve = new THREE.CubicBezierCurve3(points[0], points[1], points[2], points[3]);

        // Create the curve geometry
        const numSegments = 100; // Number of segments to approximate the curve
        const curvePoints = curve.getPoints(numSegments);
        const curveGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

        // Create a material for the curve
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the curve object
        const curveObject = new THREE.Line(curveGeometry, curveMaterial);

        return curveObject;
    }

    get length(){
        return this.largura.clone().sub(this.altura).length();
    }

    addToScene(scene){
        this.scene = scene;
        scene.add(this.mesh);
        return this;
    }

    update(){
        
        this.scene.remove(this.mesh);

        this.renderMalha();

        this.scene.add(this.mesh);
    }
}