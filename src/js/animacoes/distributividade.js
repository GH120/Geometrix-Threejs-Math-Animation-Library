import Animacao from "./animation";
import * as THREE from 'three';

export class Distributividade extends Animacao{

    constructor(objeto){
        super(objeto);
    }

    curva(points){

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
      
      desenharSeta(origem, destino, altura=0.2){
      
        const vetor = new THREE.Vector3().subVectors(destino, origem);
      
        const ortogonal = new THREE.Vector3().crossVectors(vetor, new THREE.Vector3(0,0,-1)).normalize().multiplyScalar(altura)
      
      
        const p1 = new THREE.Vector3().add(vetor).multiplyScalar(1/3).add(origem).add(ortogonal);
        const p2 = new THREE.Vector3().add(vetor).multiplyScalar(2/3).add(origem).add(ortogonal);
      
        return this.curva([
          origem,
          p1,
          p2,
          destino
        ]);
      }

      comutatividade(elemento1, elemento2){

        const retangulo1 =  elemento1.getBoundingClientRect()
      
        const retangulo2 =  elemento2.getBoundingClientRect()
      
        const middle = (rect) => (rect.left + rect.right)/2 
      
        const ponto1 = this.pixelToCoordinates(middle(retangulo1), retangulo1.top + 10);
      
        const ponto2 = this.pixelToCoordinates(middle(retangulo2), retangulo2.top + 10);

        this.scene.add(this.desenharSeta(ponto1,ponto2));
      }

      pixelToCoordinates(x,y){

        const raycaster = new THREE.Raycaster();
      
        raycaster.setFromCamera(this.normalizar(x,y), this.camera);
          
        const intersects = raycaster.intersectObject(new THREE.Mesh(
          new THREE.PlaneGeometry(100,100),
          new THREE.MeshBasicMaterial({color:0xffffff})
        ));
      
        if (intersects.length > 0) {
          // Update the object's position to the intersection point
          return intersects[0].point;
        }
      }

      normalizar(x, y) {
        const rect = this.canvas.getBoundingClientRect();
        const normalizedX = (x - rect.left) / this.canvas.width * 2 - 1;
        const normalizedY = -(y - rect.top) / this.canvas.height * 2 + 1;
        return new THREE.Vector2(normalizedX,normalizedY);
      }

      addSettings(scene,camera,canvas){
        this.scene  = scene;
        this.camera = camera;
        this.canvas = canvas;
        return this;
      }
}