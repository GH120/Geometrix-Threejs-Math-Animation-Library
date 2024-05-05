import * as THREE from 'three';
import DesenharMalha from '../animacoes/desenharMalha';
import { AnimacaoSequencial } from '../animacoes/animation';
import { Objeto } from './objeto';

export default class Bracket extends Objeto{

  constructor(altura=0.2, ponto1=[3,0,0], ponto2=[3,3,0], offset){

      super();

      const ponto1Array = ponto1[0];
      const ponto2Array = ponto2[0];

      if(ponto1Array) ponto1 = new THREE.Vector3(...ponto1);
      if(ponto2Array) ponto2 = new THREE.Vector3(...ponto2);

      if(offset){
        ponto1.sub(offset);
        ponto2.sub(offset);
      }

      console.log(ponto1,ponto2);

      this.position = new THREE.Vector3().lerpVectors(ponto1,ponto2);

      this.largura = ponto1.clone().sub(ponto2).length()*0.5;

      this.altura  = altura;

      this.calculateMatrix(ponto1,ponto2);

      this.render()
  }

  render(){

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

      points = points.map(ponto => ponto.applyMatrix4(this.matrix))

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

    const linhaCima  = this.mesh.children[0];
    const linhaBaixo = this.mesh.children[1];

    return new AnimacaoSequencial(
                    new DesenharMalha(linhaBaixo,this.scene).reverse(),
                    new DesenharMalha(linhaCima, this.scene)
              )
              .setOnTermino(() =>{
                console.log(this.scene.remove(linhaCima));
                console.log(this.scene.remove(linhaBaixo));
              })
              .setCheckpoint(false)

  }

  //** Muda pontos 1 e 2 para renderizar a malha de novo */
  setOrigemDestino(origem,destino){

      origem  = new THREE.Vector3(...origem);

      destino = new THREE.Vector3(...destino);

      this.largura = destino.clone().sub(origem).length()*0.5;

      this.calculateMatrix(origem,destino);

      this.renderMalha();

      return this;
  }

  static fromAresta(edge, altura, offset){

    const ponto1 = edge.origem;
    const ponto2 = edge.destino;

    return new Bracket(altura, ponto1, ponto2, offset);
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