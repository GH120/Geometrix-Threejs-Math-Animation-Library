import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';

import {Triangle} from './triangle';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//const orbit = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.TextureLoader().load(grid);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);


const triangle = new Triangle(scene)
                    .renderVertices()
                    .renderEdges()
                    .renderText()
                    .renderAngles()
                    .createControlers(camera);


console.log(triangle);

triangle.vertices.map(vertex => scene.add(vertex));

triangle.edges.map(edge => scene.add(edge));

camera.position.z = 5;

const gui = new dat.GUI();

const options = {
  "tamanho da esfera": 0.1,
  "grossura": 0.05,
  "raio do ângulo": 0.7
};

gui.add(options, 'grossura', 0.01, 0.2);
gui.add(options, 'tamanho da esfera', 0.1, 2);
gui.add(options, 'raio do ângulo', 0.05, 3);

function attOptions() {
  triangle.grossura = options.grossura;
  triangle.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
  triangle.angleRadius = options["raio do ângulo"]
}


function animate() {
    requestAnimationFrame( animate );
    triangle.update(scene);
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
  