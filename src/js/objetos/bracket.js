import * as THREE from 'three';
import DesenharMalha from '../animacoes/desenharMalha';
import { AnimacaoSequencial } from '../animacoes/animation';

export default class Bracket{

  constructor(largura, altura, ponto1=new THREE.Vector3(3,0,0), ponto2=new THREE.Vector3(3,3,0)){

      this.largura = ponto1.clone().sub(ponto2).length()*0.5;

      this.altura  = altura;

      this.calculateMatrix(ponto1,ponto2);

      this.renderMalha()
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
          this.criarCurva([
              new THREE.Vector3(0,0,0), 
              new THREE.Vector3(0,this.altura,0), 
              new THREE.Vector3(this.largura,0,0), 
              new THREE.Vector3(this.largura,this.altura,0)
          ])
      );

      this.mesh = bracket;

  }

  criarCurva(points){

      points = points.map(p => p.applyMatrix4(this.matrix))

      const curve = new THREE.CubicBezierCurve3(...points);

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

  calculateMatrix(ponto1,ponto2){

    //Translação
    const meio = ponto1.clone().add(ponto2).multiplyScalar(0.5);

    const translation = new THREE.Matrix4().makeTranslation(meio.x+this.altura+0.2,meio.y,meio.z);

    console.log(translation)

    //Rotação
    const angulacao = ponto2.clone().sub(ponto1).normalize();

    const horizontal = new THREE.Vector3(1, 0, 0);

    // Calculate the axis of rotation (cross product of initial and target vectors)
    const axis = new THREE.Vector3().crossVectors(horizontal, angulacao).normalize();

    // Calculate the angle between the initial and target vectors
    const angle = Math.acos(horizontal.dot(angulacao));

    // Create a rotation matrix
    const rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis, angle);

    this.matrix = translation.multiply(rotationMatrix)
  }

  animacao(){
    return new AnimacaoSequencial(
                    new DesenharMalha(this.mesh.children[0],this.scene).reverse(),
                    new DesenharMalha(this.mesh.children[1],this.scene)
            )
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