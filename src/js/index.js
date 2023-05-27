import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import {SenoOnHover, CossenoOnHover, TangenteOnHover} from './handlers/trigonometry';
import {Animacao} from './animacoes/animation';
import {Divisao} from './animacoes/divisao';
import {Programa} from './programa'


import {Triangle} from './objetos/triangle';
import grid from '../assets/grid.avif';
import * as dat from 'dat.gui';

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

//Cria o triângulo
const triangle = new Triangle()
                    .renderVertices()
                    .renderEdges()
                    .renderAngles()
                    .addToScene(scene);


////////////////////////////Interfáce gráfica/////////////////////////////////////
const gui = new dat.GUI();

let guiControls = {
  trigFunction: 'default',
  toggleFunction: function() {

    let funcaoOnHover;

    programa.mudarFuncaoTrigonometrica();

    const traducao = (nome) => (nome == "sin")? "seno"    : 
                               (nome == "cos")? "cosseno" : 
                               (nome == "tan")? "tangente": "nada";

    button.name(`Mostrando ${traducao(programa.estado.nome)}`);
  }
};


const options = {
  "tamanho da esfera": 0.1,
  "grossura": 0.05,
  "raio do ângulo": 0.7,
  "atualizar": false,
  "duração da animação":90
};

gui.add(options, 'grossura', 0.01, 0.2).onChange( () => triangle.update());
gui.add(options, 'tamanho da esfera', 0.1, 2).onChange( () => triangle.update());
gui.add(options, 'raio do ângulo', 0.05, 3).onChange( () => triangle.update());
gui.add(options, "duração da animação",45,600).onChange((value) => {divisao.setDuration(value); divisao.delay = value/2})

// gui.add({onClick: () => options.atualizar = !options.atualizar},'onClick').nome("atualizar todo frame")

const buttonProperties = {
  onClick: () => options.atualizar = !options.atualizar
};

gui.add( {onClick: () => frames1 = divisao.getFrames()}, 'onClick').name('Mostrar animação de divisão');
gui.add( {onClick: () => options.atualizar = !options.atualizar}, 'onClick').name('atualizar todo frame');
let button = gui.add(guiControls, 'toggleFunction');
button.name("Mostrando nada")

function attOptions() {
  triangle.grossura = options.grossura;
  triangle.sphereGeometry = new THREE.SphereGeometry(options["tamanho da esfera"]);
  triangle.angles.map(angle => angle.angleRadius = options["raio do ângulo"])
}
////////////////////////////////////////////////////////////////////////////////////

//Exemplos de animações, depois refatorar
const mudarCor = new Animacao(triangle.angles[1])
                    .setValorInicial(0x000000)
                    .setValorFinal(0x0000ff)
                    .setDuration(300)
                    .setInterpolacao(function(inicial,final,peso){
                      return( inicial*(1-peso)*(1-peso)*(1-peso) + final*peso*peso*peso);
                    })
                    .setUpdateFunction(function(valor){
                      this.objeto.sectorMaterial = new THREE.MeshBasicMaterial({color:valor});
                      this.objeto.update();
                    });

const divisao = new Divisao(triangle.edges[0], triangle.edges[2]).addToScene(scene);

let frames1 = null;
const frames2 = mudarCor.getFrames();

const programa = new Programa(triangle,scene,camera);


//Loop de animação
function animate() {
    requestAnimationFrame( animate );
    if(frames1) frames1.next();
    frames2.next();
    attOptions();
    if(options.atualizar) triangle.update();
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
  