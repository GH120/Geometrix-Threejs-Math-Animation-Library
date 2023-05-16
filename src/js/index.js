import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './trigonometry';

import {Triangle} from './triangle';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';


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

//Cria o triângulo
const triangle = new Triangle()
                    .renderVertices()
                    .renderEdges()
                    .renderText()
                    .renderAngles()
                    .createControlers(camera)
                    .addToScene(scene);


////////////////////////////Interfáce gráfica/////////////////////////////////////
const gui = new dat.GUI();

let guiControls = {
  trigFunction: 'default',
  toggleFunction: function() {

    let funcaoOnHover;

    if (guiControls.trigFunction === 'seno') {
      guiControls.trigFunction = 'cosseno';
      button.name('Mostrando cosseno');
      funcaoOnHover = CossenoOnHover;
    } else if(guiControls.trigFunction === 'cosseno'){
      guiControls.trigFunction = 'tangente';
      button.name('Mostrando tangente');
      funcaoOnHover = TangenteOnHover;
    }
    else if(guiControls.trigFunction === 'tangente'){
      guiControls.trigFunction = 'default';
      button.name('Mostrando nada');
      funcaoOnHover = null;
    }
    else{
      guiControls.trigFunction = 'seno';
      button.name('Mostrando seno');
      funcaoOnHover = SenoOnHover;
    }

    if(funcaoOnHover != null) 
      triangle.hoverable.map((hover,index) => hover.observers[1] = (new funcaoOnHover().setTriangulo(triangle, index)));

    else
      triangle.hoverable.map((hover,index) => hover.observers[1] = null)

    console.log(triangle.hoverable);
  }
};


const options = {
  "tamanho da esfera": 0.1,
  "grossura": 0.05,
  "raio do ângulo": 0.7,
};

gui.add(options, 'grossura', 0.01, 0.2).onChange( () => triangle.update());
gui.add(options, 'tamanho da esfera', 0.1, 2).onChange( () => triangle.update());
gui.add(options, 'raio do ângulo', 0.05, 3).onChange( () => triangle.update());
let button = gui.add(guiControls, 'toggleFunction');
button.name("Mostrando nada")

function attOptions() {
  triangle.grossura = options.grossura;
  triangle.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
  triangle.angles.map(angle => angle.angleRadius = options["raio do ângulo"])
}
////////////////////////////////////////////////////////////////////////////////////

//Loop de animação
function animate() {
    requestAnimationFrame( animate );
    attOptions();
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
  