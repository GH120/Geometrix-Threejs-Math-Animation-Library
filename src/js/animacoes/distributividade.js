import Animacao, { AnimacaoSequencial } from "./animation";
import * as THREE from 'three';
import DesenharMalha from "./desenharMalha";
import { TextoAparecendo } from "./textoAparecendo";

export class Distributividade extends Animacao{

    constructor(objeto){
        super(objeto);
    }

    *getFrames(){

      for(const animacao of this.animacoes){
        yield* animacao.getFrames();
      }
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

      update(equation, equacao){

        console.log(equation,equacao, equation.children[1],  equation.children[5].children[1]);

        const ac = this.comutatividade(equation.children[1],equation.children[5].children[1]);

        const ad = this.comutatividade(equation.children[1],equation.children[5].children[2],true);

        const bc = this.comutatividade(equation.children[2],equation.children[5].children[1],true);

        const bd = this.comutatividade(equation.children[2],equation.children[5].children[2],true);

        const multiplicacoes = [ac,ad,bc,bd];

        this.animacoes = multiplicacoes.map(resultado => 
                          new AnimacaoSequencial(
                              new DesenharMalha(resultado.seta, this.scene).setDuration(100),
                              new TextoAparecendo(resultado.html).setOnStart(() => equacao.appendChild(resultado.html)).setDuration(100)
                          ));
        
        return this;
      }

      comutatividade(elemento1, elemento2,hasPlus){

        const retangulo1 =  elemento1.getBoundingClientRect()
      
        const retangulo2 =  elemento2.getBoundingClientRect()
      
        const middle = (rect) => (rect.left + rect.right)/2 
      
        const ponto1 = this.pixelToCoordinates(middle(retangulo1), retangulo1.top + 6);
      
        const ponto2 = this.pixelToCoordinates(middle(retangulo2), retangulo2.top + 6);

        return {
                seta: this.desenharSeta(ponto1,ponto2), 
                html: this.createEquationBox(elemento1, elemento2,hasPlus)
              }
      }

      createEquationBox(a,b, hasPlus){
        
        const equation = document.createElement("span");

        const text =  ((hasPlus)? " + ": "") + `(${a.textContent} ⋅ ${b.textContent})`;

        for(const letter of text.split('')){

          const child = document.createElement("span");
          child.textContent = letter;
          equation.appendChild(child);
        }

        equation.classList.add("equation-letter")

        return equation;
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

      spanParaCadaLetra(element){
        const text = element.textContent;
        element.innerHtml = "";
        element.textContent = "";
        for(const letter of text.split("")){
          const span = document.createElement("span");
          span.textContent = letter;
          span.classList.add("equation-letter")
          element.appendChild(span);
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