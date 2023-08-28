import * as THREE from 'three';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import { Fase } from './fases/fase1';
import { Fase2 } from './fases/fase2';
import Bracket from './objetos/bracket'
import DesenharMalha from './animacoes/desenharMalha';
import { Fase3 } from './fases/fase3';

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

document.addEventListener("DOMContentLoaded", function() {
    const openButton = document.getElementById("openEquationWindow");
    const closeButton = document.getElementById("closeButton");
    const equationWindow = document.getElementById("equationWindow");


    //Gambiarra para os objetos estarem em cima do html, mas ter um fundo branco ao invés do background do threejs
    const planeGeometry = new THREE.PlaneGeometry(6, 4); // Width, height

    // Create a white material
    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color

    // Create a mesh using the geometry and material
    const whitePlane = new THREE.Mesh(planeGeometry, whiteMaterial);

    whitePlane.position.x = -4.4
    whitePlane.position.y = -2.7

    scene.add(whitePlane);

    whitePlane.visible = false;

    openButton.addEventListener("click", function() {
        openButton.classList.add("hidden");
        equationWindow.classList.remove("hidden");
        whitePlane.visible = true;
    });

    closeButton.addEventListener("click", function() {
        openButton.classList.remove("hidden");
        equationWindow.classList.add("hidden");
        whitePlane.visible = false;
    });
});