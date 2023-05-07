import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Triangle} from './triangle';
import {Draggable} from './draggable';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';


const scene = new THREE.Scene();

const loader = new THREE.TextureLoader();

scene.background = grid;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// const orbit = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.TextureLoader().load(grid);


const triangle = new Triangle()
                    .renderVertices()
                    .renderEdges();

triangle.vertices.map(vertex => new Draggable(vertex,camera));

triangle.vertices.map(vertex => console.log(vertex));
triangle.vertices.map(vertex => scene.add(vertex));
triangle.edges.map(edge => scene.add(edge))

camera.position.z = 5;

const gui = new dat.GUI();

const options = {
  "tamanho da esfera": 0.1,
  "grossura": 0.05
};

gui.add(options, 'grossura', 0.01, 0.2);
gui.add(options, 'tamanho da esfera', 0.1, 2);

function attOptions() {
  triangle.grossura = options.grossura;
  triangle.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
}


function animate() {
    requestAnimationFrame( animate );
    triangle.update(scene);
    attOptions();
    renderer.render( scene, camera );
  }
  animate();
  