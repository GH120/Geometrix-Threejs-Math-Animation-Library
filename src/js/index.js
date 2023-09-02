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
import { Addition, Equality, Multiplication, Square, Value, Variable } from './equations/expressions';

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

programa.canvas = canvas;

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

document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById("openEquationWindow");
    const closeButton = document.getElementById("closeButton");
    const equationWindow = document.getElementById("equationWindow");

    let whiteboard;

    const elemento = new Equality(
      new Multiplication(
        new Addition(
          new Variable("x"), 
          new Value(1)
        ), 
        new Square(
          new Addition(
            new Variable("y"), 
            new Value(-1)
          )
        )
      ),
      new Value(3)
    )

    openButton.addEventListener("click", function() {
        openButton.classList.add("hidden");
        equationWindow.classList.remove("hidden");
        
        //Adiciona plano de fundo branco a tela de equações
        //Ele é um objeto do threejs, que tem as proporções da tela html, que é transparente
        whiteboard = addWhiteBoard(equationWindow);

        equationWindow.append(elemento.html);

        scene.add(whiteboard);
        
    });

    closeButton.addEventListener("click", function() {
        openButton.classList.remove("hidden");
        equationWindow.classList.add("hidden");

        scene.remove(whiteboard)
    });
});


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