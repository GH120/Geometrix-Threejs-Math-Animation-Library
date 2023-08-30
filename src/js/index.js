import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import { Fase } from './fases/fase1';
import { Fase2 } from './fases/fase2';
import Bracket from './objetos/bracket'
import DesenharMalha from './animacoes/desenharMalha';
import { Fase3 } from './fases/fase3';
import { Distributividade } from './animacoes/distributividade';

//Adicionar interface de colisão => hover.objeto = objeto, hover.objeto.hitbox -> angulo.hitbox returns angulo.mesh
//triangulo.hitbox = new Plane().setPosition(triangulo.center)

//setup Threejs
const scene = new THREE.Scene();
const width = window.innerWidth;
const height = window.innerHeight;

const canvas = document.getElementById('triangulo');
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.z = 5;

scene.background = new THREE.TextureLoader().load(grid);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

//Cria o triângulo e o programa
const triangle = new Triangle()
                    .renderVertices()
                    .renderEdges()
                    .renderAngles()
                    .addToScene(scene);

const programa = new Fase3(triangle,scene,camera);

//Loop de animação
function animate() {
    requestAnimationFrame( animate );

    //Atualiza o programa
    programa.update();

    renderer.render( scene, camera );
    labelRenderer.render( scene, camera );
}
animate();

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

function pixelToCoordinates(x,y){

  const raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(normalizar(x,y), camera);
    
  const intersects = raycaster.intersectObject(new THREE.Mesh(
    new THREE.PlaneGeometry(100,100),
    new THREE.MeshBasicMaterial({color:0xffffff})
  ));

  if (intersects.length > 0) {
    // Update the object's position to the intersection point
    return intersects[0].point;
  }

}

function normalizar(x, y) {
  const rect = canvas.getBoundingClientRect();
  const normalizedX = (x - rect.left) / canvas.width * 2 - 1;
  const normalizedY = -(y - rect.top) / canvas.height * 2 + 1;
  return new THREE.Vector2(normalizedX,normalizedY);
}

function createBracket(element){

  const retangulo = element.getBoundingClientRect();
  const ponto1 = pixelToCoordinates(retangulo.left, retangulo.bottom);
  const ponto2 = pixelToCoordinates(retangulo.right, retangulo.bottom);

  new Bracket(0.2, [ponto1.x - 0.4,ponto1.y - 0.2,0],[ponto2.x-0.4,ponto2.y-0.2,0]).addToScene(scene)
}

function curva(points){

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

function desenharSeta(origem, destino, altura=0.2){

  const vetor = new THREE.Vector3().subVectors(destino, origem);

  const ortogonal = new THREE.Vector3().crossVectors(vetor, new THREE.Vector3(0,0,-1)).normalize().multiplyScalar(altura)


  const p1 = new THREE.Vector3().add(vetor).multiplyScalar(1/3).add(origem).add(ortogonal);
  const p2 = new THREE.Vector3().add(vetor).multiplyScalar(2/3).add(origem).add(ortogonal);

  scene.add(curva([
    origem,
    p1,
    p2,
    destino
  ]))
}

function comutatividade(elemento1, elemento2){

  const retangulo1 =  elemento1.getBoundingClientRect()

  const retangulo2 =  elemento2.getBoundingClientRect()

  const middle = (rect) => (rect.left + rect.right)/2 

  const ponto1 = pixelToCoordinates(middle(retangulo1), retangulo1.top + 10);

  const ponto2 = pixelToCoordinates(middle(retangulo2), retangulo2.top + 10);

  scene.add(desenharSeta(ponto1,ponto2));
}

function addWhiteBoard(equationWindow){

    const rect = equationWindow.getBoundingClientRect();

    const bottomleft = pixelToCoordinates(rect.left, rect.bottom);

    const topright   = pixelToCoordinates(rect.right, rect.top) 

    const width = topright.x - bottomleft.x;

    const height = topright.y - bottomleft.y;

    //Gambiarra para os objetos estarem em cima do html, mas ter um fundo branco ao invés do background do threejs
    const planeGeometry = new THREE.PlaneGeometry(width,height); // Width, height

    // Create a white material
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color

    // Create a mesh using the geometry and material
    const whitePlane = new THREE.Mesh(planeGeometry, whiteMaterial);

    whitePlane.position.x = bottomleft.x + width/2;
    whitePlane.position.y = bottomleft.y + height/2;

    return whitePlane;
}

document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById("openEquationWindow");
    const closeButton = document.getElementById("closeButton");
    const equationWindow = document.getElementById("equationWindow");

    let whiteboard;

    const distributividade = new Distributividade(null)
                            .addSettings(scene,camera,canvas)

    openButton.addEventListener("click", function() {
        openButton.classList.add("hidden");
        equationWindow.classList.remove("hidden");

        whiteboard = addWhiteBoard(equationWindow);

        scene.add(whiteboard);
        
        // const a = equationWindow.children[2].children[1];
        // const b = equationWindow.children[2].children[7];

        // const spanParaCadaLetra = (element) => {
        //   const text = element.textContent;
        //   element.innerHtml = "";
        //   element.textContent = "";
        //   for(const letter of text.split("")){
        //     const span = document.createElement("span");
        //     span.textContent = letter;
        //     element.appendChild(span);
        //   }
        // }

        // spanParaCadaLetra(a)

        // console.log(a)
        
        distributividade.update(equationWindow)

        for(const child of equationWindow.children[2].children){
          if(child.identity) createBracket(child)
        }
    });

    closeButton.addEventListener("click", function() {
        openButton.classList.remove("hidden");
        equationWindow.classList.add("hidden");

        scene.remove(whiteboard)
    });
});