import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import Animacao, { AnimacaoSimultanea , AnimacaoSequencial} from './animacoes/animation';
import {Divisao} from './animacoes/divisao';
import { Draggable } from './controles/draggable';
import MoverVertice from './handlers/moverVertice';
import {Programa} from './programa';
import Circle from './objetos/circle';
import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';
import Circunscrever from './animacoes/circunscrever';
import {Tracejado} from './objetos/tracejado';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MultipleClickable } from './controles/clickable';
import { Fase } from './fases/fase1';
import { Fase2 } from './fases/fase2';

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

const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
scene.add( directionalLight );
const light = new THREE.AmbientLight( 0x606060 ); // soft white light
scene.add( light );

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

const programa = new Fase(triangle,scene,camera);

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
  